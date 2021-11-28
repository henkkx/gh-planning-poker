from django.apps import AppConfig
from channels_presence.apps import RoomsConfig


class PokerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'poker'


# https://github.com/mitmedialab/django-channels-presence/issues/19
class ChannelsPresenceConfig(RoomsConfig):
    default_auto_field = 'django.db.models.AutoField'
    name = 'channels_presence'
