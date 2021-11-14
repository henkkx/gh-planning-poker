import pytest

from poker.models import PlanningPokerSession, Task


@pytest.fixture
def task(db):
    return Task.objects.create(title='title', description='description', is_imported=False)


@pytest.fixture
def poker_session(db, story):
    session = PlanningPokerSession.objects.create()
    task.planningpokersession = session
    task.save()
    return session
