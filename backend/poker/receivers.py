from asgiref.sync import async_to_sync
from django.dispatch import receiver

from channels.layers import get_channel_layer
from channels_presence.models import Room
from channels_presence.signals import presence_changed

channel_layer = get_channel_layer()


@receiver(presence_changed)
def participant_changed(room: Room, **kwargs):

    users = room.get_users().order_by('email')
    participants = [{'id': u.id, 'name': u.name} for u in users]

    participant_change_message = {
        'type': 'participants.changed',
        'data': {
            'participants': participants
        }
    }

    send_message_to_room = async_to_sync(channel_layer.group_send)
    send_message_to_room(room.channel_name, participant_change_message)