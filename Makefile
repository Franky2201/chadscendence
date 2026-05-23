# Makefile for ft_chadscendence

ENV_FILE := .env
COMPOSE_FILE := docker-compose.yml
COMPOSE := docker compose -f $(COMPOSE_FILE)

BACKEND_UPLOADS_PATH ?= ./apps/backend/uploads

all: up

prerequisites:
	@test -f $(ENV_FILE) || (echo "Missing $(ENV_FILE) file"; exit 1)
	@test -f $(COMPOSE_FILE) || (echo "Missing $(COMPOSE_FILE) file"; exit 1)
	@mkdir -p $(BACKEND_UPLOADS_PATH)

build: prerequisites
	@DOCKER_BUILDKIT=1 $(COMPOSE) build

up: build
	@$(COMPOSE) up -d --remove-orphans

down: prerequisites
	@$(COMPOSE) down

start: prerequisites
	@$(COMPOSE) start

stop: prerequisites
	@$(COMPOSE) stop

restart: prerequisites
	@$(COMPOSE) restart

status:
	@$(COMPOSE) ps

logs: prerequisites
	@$(COMPOSE) logs -f

clean: down

fclean: prerequisites
	@$(COMPOSE) down -v --rmi all --remove-orphans

sprune: fclean
	@docker system prune --volumes -f

re: prerequisites clean all

.PHONY: all build up down start stop restart status logs clean fclean re
