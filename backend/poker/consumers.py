from typing import Dict, List

from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer
from channels_presence.models import Room
from django.utils.functional import cached_property

from .models import PlanningPokerSession


class PlanningPokerConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.event_handlers = {
            'vote': self.save_vote
        }

    @property
    def user(self):
        return self.scope['user']

    def connect(self):
        try:
            self.room_name = f'planning_poker_session_{self.current_session.id}'
        except PlanningPokerSession.DoesNotExist:
            self.room_name = 'rejected'
            self.close(code=4004)
            return

        Room.objects.add(
            self.room_name,
            self.channel_name,
            self.user
        )

        self.accept()
        self.add_user_to_session()
        self.send_current_task(to_everyone=False)

    def add_user_to_session(self):
        self.current_session.voters.add(self.user)

    def disconnect(self, _close_code):
        Room.objects.remove(self.room_name, self.channel_name)

    def receive_json(self, content: dict):
        kwargs = content['data']
        handler = self.event_handlers[content.pop('event')]
        handler(**kwargs)

    @cached_property
    def current_session(self) -> PlanningPokerSession:
        # additionally select the related current task object from db so that later use of
        # PlanningPokerSession.current_task does not require hitting the database again
        return PlanningPokerSession.objects.select_related('current_task').get(
            pk=self.scope['url_route']['kwargs']['game_id']
        )

    def send_event(self, event: str, to_everyone=True, **data):
        if to_everyone:
            send_func = self.channel_layer.group_send
            destination = self.room_name
        else:
            send_func = self.channel_layer.send
            destination = self.channel_name

        payload = {
            "type": "send.json",
            "event": event,
            "data": data
        }

        send = async_to_sync(send_func)
        send(destination, payload)

    def send_current_task(self, to_everyone=True):
        current_task = self.current_session.current_task
        self.send_event(
            event='new_task_to_estimate',
            to_everyone=to_everyone,
            id=current_task.id,
            title=current_task.title,
            description=current_task.description
        )

    def participants_changed(self, message: Dict):
        participants: List[Dict] = message['data']['participants']
        self.send_event('participants_changed', participants=participants)

    def save_vote(self, value: int):

        self.current_session.refresh_from_db()

        current_task = self.current_session.current_task

        if current_task is None:
            print('No current task')
            return

        _, created = current_task.votes.update_or_create(
            user=self.user, defaults={'value': value}
        )

        current_task.save()
        self.send_event(
            'vote_cast',
            to_everyone=False,
            created=created,
            value=value
        )
