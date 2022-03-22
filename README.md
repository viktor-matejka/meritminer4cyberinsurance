# Prototype

## Description

The prototype is based on SecRiskAI and the pm4py library.
You can start the project through the docker with the instructions below.

SecRiskAI docker extensions:

- updated web - added graphviz-react library to display graphs. And added several routes to new components that extend the possible SecRiskAI
- added db - Postgresql
- added api - Flask application with Flask-SQLAlchemy, psycopg2, flask-restx, flask-accepts, marshmallow and pm4py.

There are several files to test in the examples directory.

## First run project

### Setup .env

Create `.env` file as like `.env.example` in this directory

### Run docker-compose

```bash
docker-compose up -d
```

Rebuild containes

```bash
docker-compose up -d --build
```

### Create DB

```bash
docker-compose run api sh -c "flask db upgrade"
```

### Create first user

```bash
docker-compose run api sh -c "python manage.py seed_db"
```

### Create profiles

```bash
docker-compose run api sh -c "python manage.py seed_profiles"
```

## Endopoints

### Forontend

[http://127.0.0.1:3001/](http://127.0.0.1:3001/)

### Swagger

[http://127.0.0.1:8000/](http://127.0.0.1:8000/)

### BentoML Yatai

[http://localhost:3000/](http://localhost:3000/)

## DB

Database credentials

```bash
host: 0.0.0.0
port: 54321
database: prototype
username: admin
password: password
```

### Create migrations

```bash
docker-compose run api sh -c "flask db migrate -m '<message>'"
```

### Upgrade to a later version

```bash
docker-compose run api sh -c "flask db upgrade"
```

### If the table is exist

```bash
docker-compose run api sh -c "flask db stamp head"
```
