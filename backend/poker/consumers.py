from typing import Dict, List

from channels.generic.websocket import JsonWebsocketConsumer
from channels_presence.models import Room
from django.utils.functional import cached_property

from .models import PlanningPokerSession


class PlanningPokerConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.events = {
        }

    def connect(self):
        self.room_name = f'planning_poker_session_{self.current_session.id}'
        Room.objects.add(
            self.room_name,
            self.channel_name,
            self.scope['user']
        )

        self.accept()

    def disconnect(self, _close_code):
        Room.objects.remove(self.room_name, self.channel_name)

    @cached_property
    def current_session(self) -> PlanningPokerSession:
        # additionally select the related current task object from db so that later use of
        # PlanningPokerSession.current_task does not require hitting the database again
        return PlanningPokerSession.objects.select_related('current_task').get(
            pk=self.scope['url_route']['kwargs']['game_id']
        )

    def send_event(self, name: str, **data):
        print(name, data)

    def participants_changed(self, message: Dict):
        participants: List[Dict] = message['data']['participants']
        self.send_event('participants_changed', participants=participants)
