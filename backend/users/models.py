from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings


class User(AbstractUser):
    username = None

    email = models.EmailField(unique=True, db_index=True)

    name = models.CharField(max_length=255, default='Github User')
    access_token = models.CharField(max_length=255, default='github_token')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['access_token']

    @property
    def is_superuser(self):
        return self.email == settings.SUPER_USER_EMAIL

    @property
    def is_staff(self):
        return self.email == settings.SUPER_USER_EMAIL

    class Meta:
        swappable = 'AUTH_USER_MODEL'