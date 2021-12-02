import pytest
from unittest.mock import Mock, patch
from channels.db import database_sync_to_async
from channels.testing import WebsocketCommunicator
from poker.models import PlanningPokerSession, Vote
from core.asgi import application


class TestWebSocket:

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

    @patch('poker.consumers.async_to_sync')
    @pytest.mark.parametrize('to_everyone', [True, False])
    def test_send_event(self, mock_async_to_sync, to_everyone, poker_consumer):
        mock_async_to_sync.side_effect = lambda args: args

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

    def test_receive_json(self, poker_consumer):
        EVENT = 'some_event'
        data = {'foo': 'bar'}
        mock_handler = Mock()
        poker_consumer.event_handlers = {
            EVENT: mock_handler
        }

        poker_consumer.receive_json({'event': EVENT, 'data': data})

        mock_handler.assert_called_with(**data)

    @pytest.mark.django_db(transaction=True)
    def test_vote_is_saved(self, settings, task, poker_consumer):
        USER_VOTE = 40
        user = poker_consumer.scope['user']

        current_session = poker_consumer.current_session
        current_session.current_task = task
        current_session.save()

        poker_consumer.save_vote(USER_VOTE)

        assert task.votes.filter(user=user, estimate=USER_VOTE).exists()
