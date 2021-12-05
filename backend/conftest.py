from typing import Tuple
from django.db import connections
import pytest
from unittest import mock
from channels.testing.websocket import WebsocketCommunicator

from core.asgi import application
from poker.models import PlanningPokerSession, Task
from poker.consumers import PlanningPokerConsumer
from users.services import create_user


@pytest.fixture(autouse=True)
def enable_db_access_for_all_tests(db):
    pass


@pytest.fixture
def task_factory(db):
    def _factory(title='title', description='description', is_imported=True, **kwargs):
        return Task.objects.create(title=title, description=description, is_imported=is_imported, **kwargs)
    return _factory


@pytest.fixture
def task(db, task_factory):
    t = task_factory()
    return t


@pytest.fixture
def poker_factory(task_factory, user):
    def _factory(moderator=user, tasks=2):
        session = PlanningPokerSession.objects.create(moderator=moderator)
        tasks = [task_factory(title=f"task-{i+1}") for i in range(tasks)]
        for task in tasks:
            task.planningpokersession = session
            task.save()
        session.current_task = tasks[0]
        session.save()
        return session
    return _factory


@pytest.fixture
def planning_poker_session(db, task, user):
    session = PlanningPokerSession.objects.create(moderator=user)
    session.current_task = task
    task.planningpokersession = session
    task.save()
    session.save()
    return session


@pytest.fixture
def poker_consumer(db, planning_poker_session, user):
    consumer = PlanningPokerConsumer()
    consumer.scope = {
        'url_route': {'kwargs': {'game_id': planning_poker_session.id}},
        'user': planning_poker_session.moderator
    }
    consumer.channel_name = 'poker_session_1'
    return consumer


@pytest.fixture
def user_factory():
    def _factory(email='user@email.com', access_token='token', **kwargs):
        return create_user(email=email, access_token=access_token, **kwargs)
    return _factory


@pytest.fixture
def user(user_factory, db):
    return user_factory(name='firstname lastname')


@pytest.fixture
def planning_poker_ws_client(db, planning_poker_session, user) -> Tuple[PlanningPokerSession, WebsocketCommunicator]:
    game_id = planning_poker_session.id
    ws_communicator = WebsocketCommunicator(
        application=application,
        path=f'ws/poker/{game_id}'
    )
    ws_communicator.scope['user'] = user
    return planning_poker_session, ws_communicator


@pytest.fixture
def mock_async_to_sync(monkeypatch):
    monkeypatch.setattr('poker.consumers.async_to_sync', lambda args: args)
