from django.db import models
from users.models import User

NOT_ESTIMATED = None
NOT_DOABLE = 100
UNSURE = 99
HOURS_TO_COMPLETE_CHOICES = (
    (NOT_ESTIMATED, "not estimated"),
    (1, "1 hour"),
    (2, "2 hours"),
    (3, "3 hours"),
    (5, "5 hours"),
    (8, "8 hours"),
    (13, "13 hours"),
    (20, "20 hours"),
    (40, "40 hours"),
    (NOT_DOABLE, "the task is too large or complex, we need to reconsider it"),
    (UNSURE, "I'm unsure, we might need to clarify the requirements"),
)


class PlanningPokerSession(models.Model):

    id = models.AutoField(primary_key=True)
    # github limits repos to 100 chars and org names to 40 chars
    repo_name = models.CharField(null=True, max_length=100)
    org_name = models.CharField(null=True, max_length=40)
    current_task = models.OneToOneField(
        "Task",
        on_delete=models.SET_NULL,
        verbose_name=("The task currently being estimated"),
        related_name="get_session",
        null=True,
    )

    moderator = models.ForeignKey(
        User, on_delete=models.PROTECT, related_name="moderator_in"
    )
    voters = models.ManyToManyField(User, related_name="poker_sessions")

    class Meta:
        db_table = "planningPokerSession"


class Task(models.Model):

    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=60)
    description = models.CharField(max_length=5000, null=True, default="")
    hours = models.PositiveSmallIntegerField(
        null=True, choices=HOURS_TO_COMPLETE_CHOICES
    )
    is_decided = models.BooleanField(null=True, default=False)
    github_issue_number = models.IntegerField(null=True)
    is_imported = models.BooleanField()
    planningpokersession = models.ForeignKey(
        "PlanningPokerSession",
        null=True,
        on_delete=models.CASCADE,
        related_name="tasks",
    )

    def __str__(self):
        return f"{self.title}: {self.hours if self.is_decided else 'not yet decided'}"

    class Meta:
        db_table = "task"


class Vote(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="votes")

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="votes")

    value = models.PositiveSmallIntegerField(choices=HOURS_TO_COMPLETE_CHOICES)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["task", "user"], name="cannot cast a vote twice on same task"
            )
        ]

    def __str__(self) -> str:
        return f"{self.user.name} voted {self.get_value_display()}"
