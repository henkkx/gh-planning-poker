import pytest


@pytest.mark.django_db
def test_superuser(user_factory, settings):
    SUPER_USERNAME = 'superuser'
    settings.SUPER_USERNAME = SUPER_USERNAME
    user = user_factory()
    assert not user.is_superuser
    assert not user.is_staff

    superuser = user_factory(username=SUPER_USERNAME)
    assert superuser.is_superuser
    assert superuser.is_staff
