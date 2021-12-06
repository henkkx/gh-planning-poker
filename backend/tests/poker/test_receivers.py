from unittest.mock import patch
from channels_presence.models import Presence, Room

from tests.utils import AnyInt
from poker.receivers import participant_changed


def test_participants_changed(mock_async_to_sync, user_factory):
    room = Room.objects.create(channel_name='test room')

    for i in range(1, 5):
        user = user_factory(email=f"user-{i}@email.com", name=f"user-{i}")
        Presence.objects.create(
            channel_name=f'{user.email} channel',
            room=room,
            user=user
        )
    expected_message = {
        'type': 'participants.changed',
        'data': {
            'participants': [
                {'id': AnyInt(), 'name': "user-1"},
                {'id': AnyInt(), 'name': "user-2"},
                {'id': AnyInt(), 'name': "user-3"},
                {'id': AnyInt(), 'name': "user-4"},
            ]
        }
    }
    with patch('poker.receivers.channel_layer.group_send') as mock_group_send:
        participant_changed(room)
        mock_group_send.assert_called_with('test room', expected_message)
