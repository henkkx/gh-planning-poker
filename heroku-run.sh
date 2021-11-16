#!/bin/bash

cd backend
python3 manage.py migrate --no-input

service pgbouncer start
daphne core.asgi:application -b 0.0.0.0 -p $PORT
service pgbouncer stop