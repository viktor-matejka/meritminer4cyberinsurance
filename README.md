# MeritMiner4CI - Process Mining for Cyber Insurance Risk Assessment

## Description

The prototype is mainly based on SecRiskAI (https://github.com/Sulasdeli/SecRiskAI) and the pm4py library (https://github.com/pm4py).
You can start the project through the docker with the instructions below.

The prototype does not consider all configuration, filtering and complexities of production process mining product.  Rather, it demonstrates the most fundamental methods of process mining in the form a of cyber risk assessment application with underwriting functionality providing for rating of confidence factors.

There are many metrics methods that could be added, and the prototype  by no means aims to cover all the aspects. It focuses solely on the demonstration of the basic flow. At the same time, it's structure allows for extension with additional functionality in the future, especially as concerns the depth of analyses as it covers all three layers of the architecture below- the \textit{user layer}, the \textit{business layer} and the \textit{data layer}. The following chapter is structured according to these layers.


## How to run the project

### Setup .env

Create `.env` file usign the `.env.example` in the GitHub repository

### Run docker-compose

```bash
docker-compose up -d
```
OPTIONAL: Rebuild containers

```bash
docker-compose up -d --build
```

### Create database

```bash
docker-compose run api sh -c "flask db upgrade"
```

### Create first user for the database

```bash
docker-compose run api sh -c "python manage.py seed_db"
```

### Prefill database with example profiles with attribute valuef aligned with SecRiskAI

```bash
docker-compose run api sh -c "python manage.py seed_profiles"
```

### Now you should be able to access the user layer here

[http://127.0.0.1:3001/](http://127.0.0.1:3001/)


### Swagger containing documentation of the API

[http://127.0.0.1:8000/](http://127.0.0.1:8000/)




### BentoML Yatai from SecRiskAI

[http://localhost:3000/](http://localhost:3000/)


## Database credentials


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


## References


Berti, A., Van Zelst, S. J., & van der Aalst, W. (2019). Process mining for python (PM4Py): bridging the gap between process-and data science. arXiv preprint arXiv:1905.06169.

Sula, E. SecRiskAI: A Machine Learning-based Tool for Cybersecurity Risk Assessment.
