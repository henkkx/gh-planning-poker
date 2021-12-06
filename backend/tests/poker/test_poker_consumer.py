import pytest
from unittest.mock import Mock, patch
from channels.testing import WebsocketCommunicator
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
        ws = WebsocketCommunicator(
            application=application,
            path=f'ws/poker/{42}'
        )

        is_connected, code = await ws.connect()
        assert not is_connected
        assert code == 4004
        await ws.disconnect()

    @pytest.mark.parametrize('to_everyone', [True, False])
    def test_send_event(self, to_everyone, mock_async_to_sync, poker_consumer):

        mock_group_send = Mock()
        mock_send = Mock()

        class ChannelLayer:
            group_send = mock_group_send
            send = mock_send

        poker_consumer.channel_layer = ChannelLayer()

        EVENT = 'some_event'
        ROOM = 'room'
        CHANNEL = 'channel'
        data = {'foo': 'bar'}
        expected_kwargs = {'event': EVENT, 'type': 'send.json', 'data': data}

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
        title = current_task_info['data']['title']

        assert title == expected_title
        await ws.disconnect()

    def test_user_added_to_poker_session(self, poker_consumer, user, mock_async_to_sync):

        current_session = poker_consumer.current_session

        assert len(current_session.voters.all()) == 0

        poker_consumer.add_user_to_session()

        assert len(current_session.voters.all()) == 1
        assert current_session.voters.first() == user

    def test_receive_json(self, poker_consumer):
        EVENT = 'some_event'
        data = {'foo': 'bar'}
        mock_handler = Mock()
        poker_consumer.event_handlers = {
            EVENT: mock_handler
        }

        poker_consumer.receive_json({'event': EVENT, 'data': data})

        mock_handler.assert_called_with(**data)

    @pytest.mark.parametrize('has_current_task', [True, False])
    def test_vote_is_saved(self, has_current_task, task, poker_consumer, mock_async_to_sync):
        USER_VOTE = 40
        user = poker_consumer.scope['user']

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
        participants = ['user1', 'user2']
        message = {'data': {'participants': participants}}

        with patch.object(poker_consumer, 'send_event', Mock()) as mock_send_event:
            poker_consumer.participants_changed(
                message
            )

        mock_send_event.assert_called_with(
            'participants_changed', participants=participants
        )

    @pytest.mark.parametrize('has_current_task', [True, False])
    def test_send_current_task(self, has_current_task, poker_consumer, task):
        current_session = poker_consumer.current_session

        current_session.current_task = task if has_current_task else None
        current_session.save()

        current_task = current_session.current_task

        with patch.object(poker_consumer, 'send_event', Mock()) as mock_send_event:
            poker_consumer.send_current_task()
            if has_current_task:
                mock_send_event.assert_called_with(
                    event='new_task_to_estimate',
                    to_everyone=True,
                    id=current_task.id,
                    title=current_task.title,
                    description=current_task.description
                )
            else:
                mock_send_event.assert_called_with(event='no_tasks_left')
