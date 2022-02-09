from typing import Dict, List, Union
from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer
from channels_presence.models import Room, Presence
from django.utils.functional import cached_property

from .constants import CODE_SESSION_ENDED, GameEvent, TaskState
from .models import PlanningPokerSession, Task


class PlanningPokerConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.event_handlers = {
            GameEvent.VOTE: self.save_vote,
            GameEvent.REVEAL_CARDS: self.reveal_cards,
            GameEvent.FINISH_ROUND: self.finish_round,
            GameEvent.FINISH_DISCUSSION: self.finish_discussion,
            GameEvent.REPLAY_ROUND: self.replay_round,
            GameEvent.PARTICIPANTS_CHANGED: self.participants_changed,
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

    @property
    def current_task(self) -> Task:
        return self.current_session.current_task

    @cached_property
    def tasks(self) -> List[str]:
        return [task.title for task in self.current_session.tasks.all()]

    @property
    def _is_moderator(self) -> bool:
        return self.user == self.current_session.moderator

    @property
    def _participants(self):
        participants = [
            {"id": p.id, "name": p.name} for p in self.current_session.voters.all()
        ]
        return participants

    def broadcast_participants(self):
        self.send_event(
            GameEvent.PARTICIPANTS_CHANGED,
            participants=self._participants
        )

    def connect(self):
        try:
            self.room_name = f"planning_poker_session_{self.current_session.id}"
        except PlanningPokerSession.DoesNotExist:
            self.room_name = "rejected"
            self.close()
            return

        Room.objects.add(self.room_name, self.channel_name, self.user)

        self.accept()
        self.send_game_info()
        self.add_user_to_session()

    def send_game_info(self):
        if not self._has_task():
            self.end_session()
            return
        self.send_role()
        self.send_task_list()
        current_state = self.current_session.current_task.state

        next_action_by = {
            TaskState.NOT_STARTED: self.wait_for_next_round,
            TaskState.VOTING: self.send_current_task,
            TaskState.DISCUSSING: self.send_vote_stats,
            TaskState.SAVING: self.wait_for_next_round,
            TaskState.FINISHED: self.wait_for_next_round,
        }

        next_action_by[current_state]()

    def add_user_to_session(self):
        self.current_session.voters.add(self.user)
        self.user.most_recent_session = self.current_session
        self.user.save()
        self.broadcast_participants()
        self.touch_presence()

    def send_vote_stats(self, to_everyone=False):
        vote_descriptions = self.current_task.get_vote_info()
        stats = self.current_task.get_stats()

        self.send_event(
            GameEvent.CARDS_REVEALED,
            to_everyone=to_everyone,
            votes=vote_descriptions,
            stats=stats,
            title=self.current_task.title,
            description=self.current_task.description,
        )

    def send_role(self):
        self.send_event(
            event=GameEvent.ROLE_UPDATED,
            to_everyone=False,
            is_moderator=self._is_moderator
        )

    def wait_for_next_round(self):
        self.send_event(
            event=GameEvent.WAIT_FOR_NEXT_ROUND,
            title=self.current_task.title,
            to_everyone=False,
        )

    def disconnect(self, close_code):
        if self.room_name == "rejected":
            return
        self.current_session.voters.remove(self.user)
        self.broadcast_participants()

    def receive_json(self, content: dict):
        kwargs = content.get("data", {})
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
        }

        send = async_to_sync(send_func)
        send(destination, payload)

    def send_current_task(self, to_everyone=True):

        current_task = self.current_task
        if current_task.state == TaskState.NOT_STARTED:
            current_task.start_round()
            current_task.save()

        self.send_event(
            event=GameEvent.NEW_TASK_TO_ESTIMATE,
            to_everyone=to_everyone,
            id=current_task.id,
            title=current_task.title,
            description=current_task.description,
        )

    def send_task_list(self):
        current_idx = self.current_session.get_current_task_idx()

        self.send_event(
            event=GameEvent.TASK_LIST_RECEIVED,
            to_everyone=False,
            tasks=self.tasks,
            current_idx=current_idx
        )

    def participants_changed(self, message: Dict):
        participants: List[Dict] = message["data"]["participants"]
        self.send_event(GameEvent.PARTICIPANTS_CHANGED,
                        participants=participants)

    def save_vote(self, value: int):

        self.current_session.refresh_from_db()

        vote, created = self.current_task.votes.update_or_create(
            user=self.user, defaults={"value": value}
        )

        self.current_task.save()
        self.send_event(
            GameEvent.VOTE_CAST,
            to_everyone=False,
            created=created,
            vote=str(vote)
        )

    def reveal_cards(self, to_everyone=True):
        if not self._is_moderator and to_everyone:
            return

        self.current_task.start_discussion()
        self.current_task.save()

        self.send_vote_stats(to_everyone=to_everyone)

    def finish_discussion(self):
        self.current_task.finish_discussion()
        self.current_task.save()
        self.send_event(
            event=GameEvent.START_SAVING,
            to_everyone=True,
        )

    def finish_round(self, should_save_round: bool, note: str, label: Union[str, None] = None):
        if not self._is_moderator:
            return

        self.current_session.refresh_from_db()

        current_task = self.current_task
        if should_save_round:
            current_task.save_round(note, label)
        else:
            current_task.skip_saving()
        current_task.save()

        self.start_next_round()

    def start_next_round(self):
        next_task = self.current_session.get_next_task()
        self.current_session.current_task = next_task
        self.current_session.save()

        if next_task:
            next_task.start_round()
            next_task.save()
            self.send_current_task(to_everyone=True)
        else:
            self.end_session()

    def replay_round(self):
        self.current_task.replay_round()
        self.current_task.save()
        self.send_event(GameEvent.REPLAY_ROUND)

    def touch_presence(self):
        Presence.objects.touch(self.channel_name)

    def _has_task(self):
        return self.current_task is not None

    def end_session(self):
        self.send_event(GameEvent.NO_TASKS_LEFT)
        self.close(CODE_SESSION_ENDED)
        self.current_session.delete()
