# Generated by Django 3.2.5 on 2022-02-09 18:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('poker', '0002_auto_20220209_1821'),
        ('users', '0003_auto_20211105_1545'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='most_recent_session',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='poker.planningpokersession'),
        ),
    ]