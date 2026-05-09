# Makefile for ft_chadscendence

-include .env

COMPOSE_FILE := docker-compose.yml
COMPOSE := docker compose -f $(COMPOSE_FILE)

SQL_DATA_PATH ?= ./data/postgres
REDIS_DATA_PATH ?= ./data/redis
BACKEND_UPLOADS_PATH ?= ./apps/backend/uploads

all: up

prerequisites:
	@mkdir -p $(SQL_DATA_PATH)
	@mkdir -p $(REDIS_DATA_PATH)
	@mkdir -p $(BACKEND_UPLOADS_PATH)

build: prerequisites $(COMPOSE_FILE)
	@$(COMPOSE) build

up: build
	@$(COMPOSE) up -d --remove-orphans

down: $(COMPOSE_FILE)
	@$(COMPOSE) down

start: $(COMPOSE_FILE)
	@$(COMPOSE) start

stop: $(COMPOSE_FILE)
	@$(COMPOSE) stop

restart: $(COMPOSE_FILE)
	@$(COMPOSE) restart

status:
	@$(COMPOSE) ps

logs: $(COMPOSE_FILE)
	@$(COMPOSE) logs -f

clean: down

fclean: $(COMPOSE_FILE)
	@$(COMPOSE) down -v --rmi all --remove-orphans

sprune: fclean
	@docker system prune --volumes -f

re: $(COMPOSE_FILE) clean all

.PHONY: all build up down start stop restart status logs clean fclean re
