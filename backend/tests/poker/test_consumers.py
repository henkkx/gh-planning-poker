from channels_presence.models import Room
import pytest
from unittest.mock import Mock, patch
from channels.testing import WebsocketCommunicator
from poker.consumers import CODE_SESSION_ENDED

from core.asgi import application


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
        ws = WebsocketCommunicator(application=application, path=f"ws/poker/{42}")

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
        expected_kwargs = {"event": EVENT, "type": "send.json", "data": data}

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
        current_task_info = await ws.receive_json_from()
        title = current_task_info["data"]["title"]

        assert title == expected_title

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

    @pytest.mark.parametrize("has_current_task", [True, False])
    def test_vote_is_saved(
        self, has_current_task, task, poker_consumer, mock_async_to_sync
    ):
        USER_VOTE = 40
        user = poker_consumer.scope["user"]

        poker_consumer.channel_layer = Mock()

        current_session = poker_consumer.current_session

        current_session.current_task = task if has_current_task else None
        current_session.save()

        poker_consumer.save_vote(USER_VOTE)

        if has_current_task:
            assert task.votes.filter(user=user, value=USER_VOTE).exists()

            PREV_VOTE = USER_VOTE
            NEW_VOTE = 1
            poker_consumer.save_vote(NEW_VOTE)

            assert not task.votes.filter(user=user, value=PREV_VOTE).exists()
            assert task.votes.filter(user=user, value=NEW_VOTE).exists()
        else:
            assert not task.votes.filter(user=user, value=USER_VOTE).exists()

    def test_participants_changed(self, poker_consumer):
        participants = ["user1", "user2"]
        message = {"data": {"participants": participants}}

        with patch.object(poker_consumer, "send_event", Mock()) as mock_send_event:
            poker_consumer.participants_changed(message)

        mock_send_event.assert_called_with(
            "participants_changed", participants=participants
        )

    @pytest.mark.parametrize("has_current_task", [True, False])
    def test_send_current_task(self, has_current_task, poker_consumer, task):
        current_session = poker_consumer.current_session

        current_session.current_task = task if has_current_task else None
        current_session.save()

        current_task = current_session.current_task

        if has_current_task:
            with patch.object(poker_consumer, "send_event", Mock()) as mock_send_event:
                poker_consumer.send_current_task()
                mock_send_event.assert_called_with(
                    event="new_task_to_estimate",
                    to_everyone=True,
                    id=current_task.id,
                    title=current_task.title,
                    description=current_task.description,
                )
        else:
            with patch.object(poker_consumer, "close", Mock()) as mock_close:
                poker_consumer.send_current_task()
                mock_close.assert_called_with(CODE_SESSION_ENDED)

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
        poker_consumer.channel_layer = mock_channel_layer
        poker_consumer.scope["user"] = user_factory(
            name=NAME, email="regular@email.com"
        )
        poker_consumer.save_vote(1)

        with patch.object(poker_consumer, "send_event", Mock()) as mock_send_event:
            poker_consumer.reveal_cards()
            mock_send_event.assert_not_called()

        moderator = create_moderator_for_poker(current_session, name=MODERATOR_NAME)

        poker_consumer.scope["user"] = moderator

        poker_consumer.save_vote(40)

        with patch.object(poker_consumer, "send_event", Mock()) as mock_send_event:
            poker_consumer.reveal_cards()
            mock_send_event.assert_called_with(
                "cards_revealed",
                to_everyone=True,
                votes=[
                    (1, f"{NAME} voted 1 hour"),
                    (40, f"{MODERATOR_NAME} voted 40 hours"),
                ],
            )

    def test_moderator_can_request_next_round(
        self,
        poker_consumer,
        mock_async_to_sync,
        user,
        create_moderator_for_poker,
        mock_channel_layer,
    ):
        current_session = poker_consumer.current_session
        moderator = create_moderator_for_poker(current_session)

        poker_consumer.channel_layer = mock_channel_layer
        poker_consumer.scope["user"] = user

        with patch.object(
            poker_consumer, "send_current_task", Mock()
        ) as mock_send_current_task:
            poker_consumer.next_round()
            mock_send_current_task.assert_not_called()

        poker_consumer.scope["user"] = moderator

        with patch.object(
            poker_consumer, "send_current_task", Mock()
        ) as mock_send_current_task:
            poker_consumer.next_round()

            mock_send_current_task.assert_called_with(
                to_everyone=True,
            )
