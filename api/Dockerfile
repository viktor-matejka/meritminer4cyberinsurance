FROM python:3.10

WORKDIR /api

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update
RUN apt-get -y install libpq-dev gcc
RUN apt-get -y install python3-pydot graphviz

# install dependencies
RUN pip install --upgrade pip
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt


EXPOSE 8000
COPY . .
CMD ["python", "wsgi.py"]