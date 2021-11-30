import pytest
from channels.db import database_sync_to_async
from channels.testing import WebsocketCommunicator
from poker.models import PlanningPokerSession
from core.asgi import application


TEST_CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}


class TestWebSocket:

    @pytest.mark.asyncio
    @pytest.mark.django_db(transaction=True)
    async def test_can_connect_to_server(self, settings, planning_poker_session):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        game_id = planning_poker_session.id
        communicator = WebsocketCommunicator(
            application=application,
            path=f'ws/poker/{game_id}'
        )
        connected, _ = await communicator.connect()
        assert connected is True
        await communicator.disconnect()
