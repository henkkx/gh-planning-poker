# Generated by Django 3.2.5 on 2022-02-11 17:23

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('poker', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='vote',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='votes', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='task',
            name='planning_poker_session',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='tasks', to='poker.planningpokersession'),
        ),
        migrations.AddField(
            model_name='planningpokersession',
            name='current_task',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='get_session', to='poker.task', verbose_name='The task currently being estimated'),
        ),
        migrations.AddField(
            model_name='planningpokersession',
            name='moderator',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='moderator_in', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='planningpokersession',
            name='voters',
            field=models.ManyToManyField(related_name='voter_in', to=settings.AUTH_USER_MODEL),
        ),
    ]
