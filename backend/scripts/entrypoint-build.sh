#!/bin/bash
echo 'waiting for postgres to start'
while !</dev/tcp/db/5432; do sleep 1; done;
echo '######################################'
echo 'POSTGRES STARTED'
echo '######################################'

cd backend

python manage.py collectstatic --no-input

python manage.py makemigrations --no-input

python manage.py migrate --no-input

gunicorn core.wsgi:application -b 0.0.0.0:$PORT
