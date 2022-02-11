from typing import Tuple, Union

from django.db import transaction
from users.models import User


def create_user(username: str, access_token: str, **extra_fields) -> User:
    extra_fields = {
        'is_active': True,
        **extra_fields
    }

    user = User.objects.create(
        username=username, access_token=access_token, **extra_fields)

    return user


def update_fields(user: User, access_token: str, avatar_url: Union[str, None]) -> None:
    if user.access_token != access_token:
        user.access_token = access_token
        user.save(update_fields=['access_token'])
    if user.avatar_url != avatar_url:
        user.avatar_url = avatar_url
        user.save(update_fields=['avatar_url'])


@transaction.atomic
def get_or_create_user(*, username: str, access_token: str, **extra_data) -> Tuple[User, bool]:
    user = User.objects.filter(username=username).first()

    is_new_user_created = not user

    if is_new_user_created:
        user = create_user(
            username=username, access_token=access_token, **extra_data
        )
    else:
        update_fields(user, access_token, extra_data.get('avatar_url'))

    return user, is_new_user_created
