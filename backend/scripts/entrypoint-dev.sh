#!/bin/bash
echo 'waiting for postgres to start'
while !</dev/tcp/db/5432; do sleep 1; done;
echo '######################################'
echo 'POSTGRES STARTED'
echo '######################################'

python manage.py makemigrations

python manage.py migrate

python manage.py runserver 0.0.0.0:$PORT
