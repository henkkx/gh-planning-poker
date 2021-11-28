#!/bin/bash
echo 'waiting for postgres to start'
while !</dev/tcp/db/5432; do sleep 1; done;
echo '######################################'
echo 'POSTGRES STARTED'
echo '######################################'

cd backend

python manage.py collectstatic --no-input

python manage.py migrate --no-input

daphne core.asgi:application -b 0.0.0.0 -p $PORT
# uvicorn core.asgi:application --host 0.0.0.0 --port $PORT
