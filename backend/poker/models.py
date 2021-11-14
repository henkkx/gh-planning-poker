from django.db import models

NOT_ESTIMATED = None
NOT_DOABLE = 100
UNSURE = 99
HOURS_TO_COMPLETE_CHOICES = (
    (NOT_ESTIMATED, "not estimated"),
    (1, '1 hour'),
    (2, '2 hours'),
    (3, '3 hours'),
    (5, '5 hours'),
    (8, '8 hours'),
    (13, '13 hours'),
    (20, '20 hours'),
    (40, '40 hours'),
    (NOT_DOABLE,  "the task is too large or complex, we need to reconsider it"),
    (UNSURE, "I'm unsure, we might need to clarify the requirements")
)


class PlanningPokerSession(models.Model):

    id = models.AutoField(primary_key=True)
    current_task = models.OneToOneField(
        'Task',
        on_delete=models.SET_NULL,
        verbose_name=('The task currently being estimated'),
        related_name='get_session',
        null=True
    )

    class Meta:
        db_table = "planningPokerSession"


class Task(models.Model):

    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=60)
    description = models.CharField(
        max_length=5000, null=True, blank=True, default=""
    )
    hours = models.PositiveSmallIntegerField(
        null=True,
        choices=HOURS_TO_COMPLETE_CHOICES
    )
    is_decided = models.BooleanField(null=True, blank=True, default=False)
    github_issue_number = models.IntegerField(null=True, blank=True)
    is_imported = models.BooleanField()
    planningpokersession = models.ForeignKey(
        'PlanningPokerSession',
        null=True,
        on_delete=models.CASCADE,
        related_name='tasks')

    class Meta:
        db_table = "task"
