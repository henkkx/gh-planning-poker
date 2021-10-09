# Planning Poker with Github Integration

### Backend

- Python 3.9
- Django
- Django Rest Framework

### Frontend

- React
- Typescript
- ChakraUI

# Dev workflow

## Without Docker

### Backend

Create a virtual environment from cmd (or do it in Pycharm manually)

```shell script
cd backend

python3 -m venv ve

source ve/bin/activate

pip install -U pip

pip install -r requirements.txt
```

Run django app

```shell script
python manage.py runserver
```

making and running migrations

```shell script
python manage.py makemigrations

python manage.py migrate
```

Create superuser

```shell script
python manage.py createsuper user
```

### Frontend

Install dependencies.

```shell script
cd frontend

npm i
```

Run dev server

```shell script
npm start
```

## Cheatsheet for Developing with Docker

**Make sure Docker is running**

While in the **root directory**, build docker images and run them with docker-compose.
This might take up to few minutes.
rebuild images after installing new packages.

```shell script
docker-compose up --build
```

the app is now running!

- backend `127.0.0.1:8000`
- frontend `127.0.0.1:3000`.

If images have been built, just run:

```shell script
docker-compose up -d
```

Bringing down containers with **optional** -v flag removes **all** attached volumes and invalidates cache.

```shell script
docker-compose down
```

To run commands in active container:

```shell script
docker exec -it CONTAINER_ID bash
```
