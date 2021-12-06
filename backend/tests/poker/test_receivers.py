from unittest.mock import Mock, patch

import pytest
from channels_presence.models import Presence, Room
from django.contrib.auth import get_user_model

from poker.receivers import participant_changed
from users.services import create_user


def test_participants_changed(mock_async_to_sync, user_factory):
    room = Room.objects.create(channel_name='test room')

    for i in range(5):
        user = user_factory(email=f"user-{i}")
        Presence.objects.create(
            channel_name=f'{user.email} channel',
            room=room,
            user=user
        )
    expected_message = {
        'type': 'participants.changed',
        'data': {
            'participants': [
                {'id': 1, 'name': 'Github User'},
                {'id': 2, 'name': 'Github User'},
                {'id': 3, 'name': 'Github User'},
                {'id': 4, 'name': 'Github User'},
                {'id': 5, 'name': 'Github User'}
            ]
        }
    }
    with patch('poker.receivers.channel_layer.group_send') as mock_group_send:
        participant_changed(room)
        mock_group_send.assert_called_with('test room', expected_message)
