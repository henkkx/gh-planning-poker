#!/bin/bash
cd backend
python3 manage.py migrate --no-input

daphne core.asgi:application -b 0.0.0.0 -p $PORT
# uvicorn core.asgi:application --host 0.0.0.0 --port $PORT