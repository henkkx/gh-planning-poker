from users.services import create_user, get_or_create_user
from users.models import User


class TestServices:
    def test_create_user(self, db):
        email = 'user@example.com'
        token = 'test token'
        user = create_user(
            email=email,
            access_token=token
        )
        that_same_guy = User.objects.filter(email=email).first()
        assert user == that_same_guy
        assert token == that_same_guy.access_token

    def test_get_or_create_user(self, db):
        email = 'user@example.com'
        token = 'test token'
        user, user_was_created = get_or_create_user(
            email=email,
            access_token=token
        )
        that_same_guy = User.objects.filter(
            email=email).first()
        assert user_was_created
        assert user == that_same_guy
        assert token == that_same_guy.access_token

        new_token = 'new_token'
        # should not create new user, just update the token
        still_the_same_guy, user_was_created = get_or_create_user(
            email=email,
            access_token=new_token)

        assert user == still_the_same_guy
        assert len(User.objects.all()) == 1
        assert not user_was_created
        assert still_the_same_guy.access_token == new_token
