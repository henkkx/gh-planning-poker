#!/bin/bash
cd backend
python3 manage.py migrate --no-input

# gunicorn --chdir backend core.wsgi
bin/start-pgbouncer daphne core.asgi:application
