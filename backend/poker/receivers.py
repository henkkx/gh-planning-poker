from asgiref.sync import async_to_sync
from django.dispatch import receiver

from channels.layers import get_channel_layer
from channels_presence.models import Room
from channels_presence.signals import presence_changed

channel_layer = get_channel_layer()


@receiver(presence_changed)
def participants_changed(sender, room: Room, **_):

    users = room.get_users().order_by("username")
    participants = [{"id": u.id, "name": u.name} for u in users]

    message = {
        "type": "participants.changed",
        "data": {"participants": participants}
    }

    send_func = channel_layer.group_send
    send_message_to_room = async_to_sync(send_func)
    send_message_to_room(room.channel_name, message)
