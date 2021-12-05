from typing import Tuple

from django.db import transaction
from users.models import User


def create_user(email: str, access_token: str, **extra_fields) -> User:
    extra_fields = {
        'is_active': True,
        **extra_fields
    }

    user = User.objects.create(
        email=email, access_token=access_token, **extra_fields)

    return user


def update_token(user: User, access_token: str) -> None:
    if user.access_token != access_token:
        user.access_token = access_token
        user.save(update_fields=['access_token'])


@transaction.atomic
def get_or_create_user(*, email: str, access_token: str, **extra_data) -> Tuple[User, bool]:
    user = User.objects.filter(email=email).first()

    is_new_user_created = not user

    if is_new_user_created:
        user = create_user(
            email=email, access_token=access_token, **extra_data
        )
    else:
        update_token(user, access_token)

    return user, is_new_user_created
