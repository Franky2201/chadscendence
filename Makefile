# Makefile for ft_transcendence

DOCKER_COMPOSE = docker compose
COMPOSE_FILE = docker-compose.yml

.PHONY: all up down build clean re

all: up

up:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) up --build

down:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) down

build:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) build

clean:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) down -v --remove-orphans
	rm -rf data/postgres data/redis apps/backend/uploads

re: clean all
