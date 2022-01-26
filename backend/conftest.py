from unittest.mock import Mock
import pytest
from typing import Tuple
from channels.testing.websocket import WebsocketCommunicator
from rest_framework.test import APIClient


from core.asgi import application
from poker.models import PlanningPokerSession, Task
from poker.consumers import PlanningPokerConsumer
from users.services import create_user


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture(autouse=True)
def enable_db_access_for_all_tests(db):
    pass


@pytest.fixture
def task_factory():
    def _factory(title='title', description='description', **kwargs):
        return Task.objects.create(title=title, description=description, **kwargs)
    return _factory


@pytest.fixture
def task(task_factory):
    return task_factory()


@pytest.fixture
def poker_factory(task_factory, user):
    def _factory(moderator=user, tasks=2):
        session = PlanningPokerSession.objects.create(moderator=moderator)
        tasks = [task_factory(title=f"task-{i+1}") for i in range(tasks)]
        tasks[0].start_round()
        for task in tasks:
            task.planning_poker_session = session
            task.save()
        session.current_task = tasks[0]
        session.save()
        return session
    return _factory


@pytest.fixture
def planning_poker_session(poker_factory):
    return poker_factory()


@pytest.fixture
def poker_consumer(planning_poker_session, user_factory):
    consumer = PlanningPokerConsumer()
    consumer.scope = {
        'url_route': {'kwargs': {'game_id': planning_poker_session.id}},
        'user': user_factory(name='Poker User', email='random@email.com')
    }
    consumer.channel_name = 'poker_session_1'
    return consumer


@pytest.fixture
def user_factory():
    def _factory(email='user@email.com', access_token='token', **kwargs):
        return create_user(email=email, access_token=access_token, **kwargs)
    return _factory


@pytest.fixture
def user(user_factory):
    return user_factory(email='user@email.com', name='firstname lastname')


@pytest.fixture
def create_moderator_for_poker(user_factory):
    def _create(session, email='moderator@email.com', name='Moderator', **kwargs):
        moderator = user_factory(email=email, name=name, **kwargs)
        session.moderator = moderator
        session.save()
        return moderator
    return _create


@pytest.fixture
def planning_poker_ws_client_factory(planning_poker_session, user):
    def _factory(connected_user=user, session=planning_poker_session) -> Tuple[PlanningPokerSession, WebsocketCommunicator]:
        game_id = session.id
        ws_communicator = WebsocketCommunicator(
            application=application,
            path=f'ws/poker/{game_id}'
        )
        ws_communicator.scope['user'] = connected_user
        return session, ws_communicator

    return _factory


@pytest.fixture
def planning_poker_ws_client(planning_poker_ws_client_factory) -> Tuple[PlanningPokerSession, WebsocketCommunicator]:
    return planning_poker_ws_client_factory()


@pytest.fixture
def mock_async_to_sync(monkeypatch):
    monkeypatch.setattr('poker.consumers.async_to_sync', lambda args: args)


@pytest.fixture
def mock_channel_layer():
    mock_group_send = Mock()
    mock_send = Mock()

    class MockChannelLayer:
        group_send = mock_group_send
        send = mock_send

    return MockChannelLayer()
