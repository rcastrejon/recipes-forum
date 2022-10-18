ARG PORT
ARG APPLICATION_NAME
ARG API_URL
ARG DATABASE_URL
ARG ACCESS_TOKEN_SECRET
FROM python:3.9 as requirements-stage

WORKDIR /tmp

RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=/opt/poetry python3 -
ENV PATH="/opt/poetry/venv/bin/:${PATH}"

COPY ./pyproject.toml ./poetry.lock* /tmp/

RUN poetry export -f requirements.txt --output requirements.txt --without-hashes

FROM python:3.9

WORKDIR /app

COPY --from=requirements-stage /tmp/requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY ./app /app/app

CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT
