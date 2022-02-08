from uuid import uuid4
import pytest
from core.asgi import application
from channels_presence.models import Room
from unittest.mock import Mock, patch
from channels.testing import WebsocketCommunicator

from tests.api.github_mocks import MockRepo
from tests.utils import AnyNumber


class TestPlanningPokerConsumer:
    @pytest.mark.asyncio
    @pytest.mark.django_db(transaction=True)
    async def test_can_connect_to_server(self, planning_poker_ws_client):
        _, ws = planning_poker_ws_client
        is_connected, _ = await ws.connect()
        assert is_connected
        await ws.disconnect()

    @pytest.mark.asyncio
    @pytest.mark.django_db(transaction=True)
    async def test_rejects_if_no_pokersession_exists(self):
        new_uuid = uuid4()
        ws = WebsocketCommunicator(
            application=application, path=f"ws/poker/{new_uuid}")

        is_connected, _ = await ws.connect()
        assert not is_connected
        await ws.disconnect()

    @pytest.mark.parametrize("to_everyone", [True, False])
    def test_send_event(
        self, to_everyone, mock_async_to_sync, mock_channel_layer, poker_consumer
    ):
        poker_consumer.channel_layer = mock_channel_layer
        mock_send = mock_channel_layer.send
        mock_group_send = mock_channel_layer.group_send

        EVENT = "some_event"
        ROOM = "room"
        CHANNEL = "channel"
        data = {"foo": "bar"}
        expected_kwargs = {"event": EVENT, "type": "send.json",
                           "data": data}

        poker_consumer.room_name = ROOM
        poker_consumer.channel_name = CHANNEL

        poker_consumer.send_event(EVENT, to_everyone=to_everyone, **data)
        if to_everyone:
            mock_group_send.assert_called_with(ROOM, expected_kwargs)
            mock_send.assert_not_called()
        else:
            mock_send.assert_called_with(CHANNEL, expected_kwargs)
            mock_group_send.assert_not_called()

    @pytest.mark.asyncio
    @pytest.mark.django_db(transaction=True)
    async def test_get_info_when_joining_session(self, planning_poker_ws_client):
        poker_session, ws = planning_poker_ws_client

        expected_title = poker_session.current_task.title

        await ws.connect()
        role_info = await ws.receive_json_from()

        assert role_info == {
            'data': {'is_moderator': True},
            'event': 'role_updated',
            'type': 'send.json'}

        task_list = await ws.receive_json_from()

        assert task_list == {
            'data': {
                'current_idx': 0,
                'tasks': ['task-1', 'task-2']
            },
            'event': 'task_list_received',
            'type': 'send.json'
        }

        current_task = await ws.receive_json_from()

        assert current_task['data']['title'] == expected_title

        await ws.send_json_to({"event": "vote", "data": {"value": 1}})

        await ws.disconnect()

    @pytest.mark.asyncio
    @pytest.mark.django_db(transaction=True)
    @patch('poker.models.get_github_repo')
    async def test_play_one_round(self, mock_get_github_repo, user, planning_poker_ws_client):
        _, ws = planning_poker_ws_client

        mock_get_github_repo.return_value = MockRepo()
        await ws.connect()

        # ignore initial data
        await ws.receive_json_from()
        await ws.receive_json_from()
        await ws.receive_json_from()
        await ws.receive_json_from()

        # send vote
        await ws.send_json_to({"event": "vote", "data": {"value": 1}})
        resp = await ws.receive_json_from()
        assert resp['data'] == {'created': True,
                                'vote': 'firstname lastname voted: "1"'}

        # get votes and start discussion
        await ws.send_json_to({"event": "reveal_cards"})
        resp = await ws.receive_json_from()

        assert resp['data']['stats'] == {
            'mean': 1,
            'median': 1,
            'std_dev': 'not enough votes',
            'total_vote_count': 1,
            'undecided_count': 0
        }

        # replay round and send a different vote
        await ws.send_json_to({"event": "replay_round"})
        await ws.receive_json_from()
        await ws.send_json_to({"event": "vote", "data": {"value": 40}})
        await ws.receive_json_from()
        await ws.send_json_to({"event": "reveal_cards"})
        resp = await ws.receive_json_from()
        assert resp['data']['stats']['mean'] == 40

        # finish discussion phase
        await ws.send_json_to({"event": "finish_discussion"})
        resp = await ws.receive_json_from()
        assert resp['event'] == "start_saving"

        # finish round and save a note about the results
        await ws.send_json_to({"event": "finish_round", "data": {"should_save_round": True, "note": "foo bar"}})

        resp = await ws.receive_json_from()

        json_comment = '{"total_vote_count": 1, "undecided_count": 0, "mean": 40, "median": 40, "std_dev": "not enough votes"} \n foo bar'
        mock_get_github_repo.assert_called_with(
            user, 'test', None
        )

        # moving on to the next round
        assert resp['event'] == "new_task_to_estimate"

        await ws.disconnect()

    def test_user_added_to_poker_session(
        self, poker_consumer, mock_channel_layer, mock_async_to_sync
    ):

        current_session = poker_consumer.current_session
        user = poker_consumer.user
        assert len(current_session.voters.all()) == 0

        Room.objects.add("room-1", "user")
        poker_consumer.room_name = "room-1"
        poker_consumer.channel_layer = mock_channel_layer
        poker_consumer.add_user_to_session()

        assert len(current_session.voters.all()) == 1
        assert current_session.voters.first() == user

    def test_receive_json(self, poker_consumer):
        EVENT = "some_event"
        data = {"foo": "bar"}
        mock_handler = Mock()
        poker_consumer.event_handlers = {EVENT: mock_handler}

        poker_consumer.receive_json({"event": EVENT, "data": data})

        mock_handler.assert_called_with(**data)

    def test_vote_is_saved(
        self, task, poker_consumer, mock_async_to_sync
    ):
        USER_VOTE = 40
        user = poker_consumer.scope["user"]

        poker_consumer.channel_layer = Mock()

        current_session = poker_consumer.current_session

        current_session.current_task = task
        current_session.save()

        poker_consumer.save_vote(USER_VOTE)

        assert task.votes.filter(user=user, value=USER_VOTE).exists()

        PREV_VOTE = USER_VOTE
        NEW_VOTE = 1
        poker_consumer.save_vote(NEW_VOTE)

        assert not task.votes.filter(user=user, value=PREV_VOTE).exists()
        assert task.votes.filter(user=user, value=NEW_VOTE).exists()

    def test_participants_changed(self, poker_consumer):
        participants = ["user1", "user2"]
        message = {"data": {"participants": participants}}

        with patch.object(poker_consumer, "send_event", Mock()) as mock_send_event:
            poker_consumer.participants_changed(message)

        mock_send_event.assert_called_with(
            "participants_changed", participants=participants
        )

    def test_send_current_task(self, poker_consumer, task):
        current_session = poker_consumer.current_session

        current_session.current_task = task
        current_session.save()

        current_task = current_session.current_task

        with patch.object(poker_consumer, "send_event", Mock()) as mock_send_event:
            poker_consumer.send_current_task()
            mock_send_event.assert_called_with(
                event="new_task_to_estimate",
                to_everyone=True,
                id=current_task.id,
                title=current_task.title,
                description=current_task.description,
            )

    def test_moderator_can_reveal_cards(
        self,
        poker_consumer,
        user_factory,
        create_moderator_for_poker,
        mock_channel_layer,
        mock_async_to_sync,
    ):
        NAME = "just a regular guy"
        MODERATOR_NAME = "Mod McModerator"

        current_session = poker_consumer.current_session
        current_task = current_session.current_task
        title, description = current_task.title, current_task.description

        poker_consumer.channel_layer = mock_channel_layer
        poker_consumer.scope["user"] = user_factory(
            name=NAME, email="regular@email.com"
        )

        VOTE_1, VOTE_2 = 1, 3

        poker_consumer.save_vote(VOTE_1)

        with patch.object(poker_consumer, "send_event", Mock()) as mock_send_event:
            poker_consumer.reveal_cards()
            mock_send_event.assert_not_called()

        moderator = create_moderator_for_poker(
            current_session, name=MODERATOR_NAME)

        poker_consumer.scope["user"] = moderator

        poker_consumer.save_vote(VOTE_2)

        with patch.object(poker_consumer, "send_event", Mock()) as mock_send_event:
            poker_consumer.reveal_cards()
            mock_send_event.assert_called_with(
                "cards_revealed",
                to_everyone=True,
                votes=[
                    (f'{NAME} voted: "1"'),
                    (f'{MODERATOR_NAME} voted: "3"'),
                ],
                stats={
                    'total_vote_count': 2,
                    'undecided_count': 0,
                    'mean': 2,
                    'median': 2,
                    'std_dev': AnyNumber(),
                },
                title=title,
                description=description
            )

    @patch('poker.models.get_github_repo')
    def test_moderator_can_request_next_round(
        self,
        mock_get_github_repo,
        poker_consumer,
        mock_async_to_sync,
        user,
        create_moderator_for_poker,
        mock_channel_layer,
    ):
        mock_get_github_repo.return_value = MockRepo()
        current_session = poker_consumer.current_session
        current_task = current_session.current_task
        moderator = create_moderator_for_poker(current_session)

        poker_consumer.channel_layer = mock_channel_layer
        poker_consumer.scope["user"] = user

        current_task.start_discussion()
        current_task.finish_discussion()
        current_task.save()

        with patch.object(
            poker_consumer, "send_current_task", Mock()
        ) as mock_send_current_task:
            poker_consumer.finish_round(True, "note")
            mock_send_current_task.assert_not_called()

        poker_consumer.scope["user"] = moderator

        with patch.object(
            poker_consumer, "send_current_task", Mock()
        ) as mock_send_current_task:
            poker_consumer.finish_round(True, "note")

            mock_send_current_task.assert_called_with(
                to_everyone=True,
            )
