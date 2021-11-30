import pytest

from poker.models import PlanningPokerSession, Task
from poker.consumers import PlanningPokerConsumer
from users.services import create_user


@pytest.fixture
def task(db):
    return Task.objects.create(title='title', description='description', is_imported=False)


@pytest.fixture
def planning_poker_session(db, task, user):
    session = PlanningPokerSession.objects.create(moderator=user)
    task.planningpokersession = session
    task.save()
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
    return create_user


@pytest.fixture
def user(user_factory, db):
    return user_factory('user@email.com', 'token', name='firstname lastname')
