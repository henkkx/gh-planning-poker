from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings


class User(AbstractUser):
    username = models.CharField(unique=True, db_index=True, max_length=39)
    name = models.CharField(max_length=255, default='Github User')
    access_token = models.CharField(max_length=255, default='github_token')
    avatar_url = models.URLField(null=True)

    most_recent_session = models.ForeignKey(
        "poker.PlanningPokerSession",
        on_delete=models.SET_NULL,
        null=True
    )

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['access_token']

    @property
    def is_superuser(self):
        return self.username == settings.SUPER_USERNAME

    @property
    def is_staff(self):
        return self.username == settings.SUPER_USERNAME

    class Meta:
        swappable = 'AUTH_USER_MODEL'
