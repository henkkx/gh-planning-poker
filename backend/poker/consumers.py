from typing import Dict, List

from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer
from channels_presence.models import Room, Presence
from django.utils.functional import cached_property


from .models import PlanningPokerSession

CODE_SESSION_ENDED = 4000


class PlanningPokerConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.event_handlers = {
            "vote": self.save_vote,
            "reveal_cards": self.reveal_cards,
            "next_round": self.next_round,
            "participants_changed": self.participants_changed,
        }

    @property
    def user(self):
        return self.scope["user"]

    @cached_property
    def current_session(self) -> PlanningPokerSession:
        # additionally select the related current task object from db so that later use of
        # PlanningPokerSession.current_task does not require hitting the database again
        return PlanningPokerSession.objects.select_related("current_task").get(
            pk=self.scope["url_route"]["kwargs"]["game_id"]
        )

    @cached_property
    def tasks(self) -> List[str]:
        return [task.title for task in self.current_session.tasks.all()]

    @property
    def _is_moderator(self) -> bool:
        return self.user == self.current_session.moderator

    def _get_participants(self):
        participants = [
            {"id": p.id, "name": p.name} for p in self.current_session.voters.all()
        ]
        return participants

    def broadcast_participants(self):
        participants = self._get_participants()
        self.send_event("participants_changed", participants=participants)

    def connect(self):
        try:
            self.room_name = f"planning_poker_session_{self.current_session.id}"
        except PlanningPokerSession.DoesNotExist:
            self.room_name = "rejected"
            self.close()
            return

        Room.objects.add(self.room_name, self.channel_name, self.user)

        self.accept()
        self.send_current_task(to_everyone=False)
        self.send_task_list()
        self.add_user_to_session()

    def add_user_to_session(self):
        self.current_session.voters.add(self.user)
        self.broadcast_participants()
        self.touch_presence()

    def disconnect(self, close_code):
        if self.room_name == "rejected":
            return
        self.current_session.voters.remove(self.user)
        self.broadcast_participants()

    def receive_json(self, content: dict):
        kwargs = content["data"]
        handler = self.event_handlers[content.pop("event")]
        handler(**kwargs)

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
            "data": data,
            "is_moderator": self._is_moderator
        }

        send = async_to_sync(send_func)
        send(destination, payload)

    def send_current_task(self, to_everyone=True):
        current_task = self.current_session.current_task
        if current_task is None:
            self.close(4000)
            return
        self.send_event(
            event="new_task_to_estimate",
            to_everyone=to_everyone,
            id=current_task.id,
            title=current_task.title,
            description=current_task.description,
        )

    def send_task_list(self):
        self.send_event(
            event="task_list_received",
            to_everyone=False,
            tasks=self.tasks
        )

    def participants_changed(self, message: Dict):
        participants: List[Dict] = message["data"]["participants"]
        self.send_event("participants_changed", participants=participants)

    def save_vote(self, value: int):

        self.current_session.refresh_from_db()

        current_task = self.current_session.current_task

        if current_task is None:
            print("No current task")
            return

        _, created = current_task.votes.update_or_create(
            user=self.user, defaults={"value": value}
        )

        current_task.save()
        self.send_event("vote_cast", to_everyone=False,
                        created=created, value=value)

    def reveal_cards(self):
        if not self._is_moderator:
            return
        votes = [
            (vote.value, str(vote))
            for vote in self.current_session.current_task.votes.all()
        ]

        self.send_event("cards_revealed", to_everyone=True, votes=votes)

    def next_round(self):
        if not self._is_moderator:
            return

        self.current_session.refresh_from_db()

        current_task = self.current_session.current_task
        current_task.is_decided = True
        current_task.save()

        next_task = self.current_session.tasks.filter(is_decided=False).first()
        self.current_session.current_task = next_task
        self.current_session.save()
        self.send_current_task(to_everyone=True)

    def touch_presence(self):
        Presence.objects.touch(self.channel_name)
