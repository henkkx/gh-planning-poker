import pytest


@pytest.mark.django_db
def test_superuser(user_factory, settings):
    SUPERUSER_EMAIL = 'superuser@email.com'
    settings.SUPER_USER_EMAIL = SUPERUSER_EMAIL
    user = user_factory()
    assert not user.is_superuser
    assert not user.is_staff

    superuser = user_factory(email=SUPERUSER_EMAIL)
    assert superuser.is_superuser
    assert superuser.is_staff
