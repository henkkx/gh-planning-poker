import pytest
from unittest.mock import Mock, patch
from channels.db import database_sync_to_async
from channels.testing import WebsocketCommunicator
from poker.models import PlanningPokerSession
from core.asgi import application


class TestWebSocket:

    @pytest.mark.asyncio
    @pytest.mark.django_db(transaction=True)
    async def test_can_connect_to_server(self, planning_poker_session):
        game_id = planning_poker_session.id
        communicator = WebsocketCommunicator(
            application=application,
            path=f'ws/poker/{game_id}'
        )
        is_connected, _ = await communicator.connect()
        assert is_connected
        await communicator.disconnect()

    @pytest.mark.asyncio
    @pytest.mark.django_db()
    async def test_rejects_if_no_pokersession_exists(self):
        communicator = WebsocketCommunicator(
            application=application,
            path=f'ws/poker/{42}'
        )

        is_connected, code = await communicator.connect()
        assert not is_connected
        assert code == 4004
        await communicator.disconnect()
