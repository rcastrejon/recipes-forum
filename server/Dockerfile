ARG PORT
ARG APPLICATION_NAME
ARG API_URL
ARG DATABASE_URL
ARG ACCESS_TOKEN_SECRET
FROM python:3.9 as requirements-stage

WORKDIR /app

RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=/opt/poetry python3 -
ENV PATH /opt/poetry/venv/bin/:$PATH

COPY ./pyproject.toml ./poetry.lock* /app/

RUN python3 -m venv --copies /app/venv
RUN . /app/venv/bin/activate && \
    poetry install --only main --no-cache

FROM python:3.9-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY --from=requirements-stage /app/venv /app/venv
ENV PATH /app/venv/bin:$PATH

COPY ./app /app/app
CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT
