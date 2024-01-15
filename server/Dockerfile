ARG PORT
ARG APPLICATION_NAME
ARG API_URL
ARG DATABASE_URL
ARG ACCESS_TOKEN_SECRET
ARG REFRESH_TOKEN_SECRET
ARG ACCESS_TOKEN_KEY
ARG SECRET_COOKIES

FROM python:3.9-slim@sha256:abae63851cda52addbf1efa19b8e6eec4a61724f0bb9ea1363d56791b5be59cb as requirements-stage

WORKDIR /usr/app

# RUN apt-get update \
#     && DEBIAN_FRONTEND=noninteractive \
#     apt-get install --no-install-recommends --assume-yes \
#     build-essential gcc git automake make pkg-config x265 libde265-dev libjpeg-dev libtool curl

# RUN git clone https://github.com/strukturag/libheif.git libheif \
#     && cd libheif \
#     && ./autogen.sh \
#     && ./configure \
#     && make -j4 \
#     && make install \
#     && ldconfig

RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=/opt/poetry python3 -
ENV PATH /opt/poetry/venv/bin/:$PATH

COPY ./pyproject.toml ./poetry.lock* /usr/app/

RUN poetry config virtualenvs.in-project true && \
    poetry install --only main --no-cache

FROM python:3.9-slim@sha256:abae63851cda52addbf1efa19b8e6eec4a61724f0bb9ea1363d56791b5be59cb

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN groupadd -g 999 python && \
    useradd -r -u 999 -g python python

RUN mkdir /usr/app && chown python:python /usr/app
WORKDIR /usr/app

COPY --chown=python:python --from=requirements-stage /usr/app/.venv /usr/app/.venv
COPY --chown=python:python ./app /usr/app/app

USER 999

ENV PATH /usr/app/.venv/bin:$PATH
CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT
