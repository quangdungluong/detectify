FROM python:3.10-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg libsm6 libxext6 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app
RUN pip install --no-cache-dir --upgrade pip \
    && pip install -r requirements.txt

COPY . /app
