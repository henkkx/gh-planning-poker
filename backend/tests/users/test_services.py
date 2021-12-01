from django.test import TestCase
from users.services import create_user
from users.models import User


class TestService(TestCase):

    def test_create_user(self):
        email = 'user@example.com'
        token = 'test token'
        user = create_user(
            email=email,
            access_token=token
        )
        that_same_guy = User.objects.filter(email=email).first()
        self.assertEqual(user, that_same_guy)
        self.assertEqual(that_same_guy.access_token, token)
