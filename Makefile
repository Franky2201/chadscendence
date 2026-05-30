# Makefile for ft_chadscendence

ENV_FILE := .env
COMPOSE_FILE := docker-compose.yml
COMPOSE := docker compose -f $(COMPOSE_FILE)

BACKEND_UPLOADS_PATH ?= ./apps/backend/uploads

# Colors
GREEN := \033[0;32m
RED := \033[0;31m
NO_COLOR := \033[0m

all: up

help:
	@printf "$(GREEN)Available targets:$(NO_COLOR)\n"
	@printf "  all (default)  Check prerequisites, build, and start containers\n"
	@printf "  up             Build and start containers in the background\n"
	@printf "  down           Stop and remove containers\n"
	@printf "  status         Check container status\n"
	@printf "  logs           Follow container logs\n"
	@printf "  ci             Run full local CI pipeline\n"
	@printf "  re             Full rebuild and restart\n"
	@printf "  fclean         Deep clean (removes images and volumes)\n"

prerequisites:
	@printf "$(GREEN)Checking for required tools...$(NO_COLOR)\n"
	@command -v node > /dev/null 2>&1 || (printf "$(RED)Node.js is not installed.$(NO_COLOR)\n"; exit 1)
	@command -v npm > /dev/null 2>&1 || (printf "$(RED)npm is not installed.$(NO_COLOR)\n"; exit 1)
	@command -v docker > /dev/null 2>&1 || (printf "$(RED)Docker is not installed.$(NO_COLOR)\n"; exit 1)
	@test -f $(ENV_FILE) || (cp .env.example $(ENV_FILE))
	@test -f $(COMPOSE_FILE) || (printf "$(RED)Missing $(COMPOSE_FILE) file$(NO_COLOR)\n"; exit 1)
	@mkdir -p $(BACKEND_UPLOADS_PATH)
	@printf "$(GREEN)Prerequisites met.$(NO_COLOR)\n"

build: prerequisites
	@DOCKER_BUILDKIT=1 $(COMPOSE) build

up: build
	@$(COMPOSE) up -d --remove-orphans

down: prerequisites
	@$(COMPOSE) down --remove-orphans

start: prerequisites
	@$(COMPOSE) start

stop: prerequisites
	@$(COMPOSE) stop

restart: prerequisites
	@$(COMPOSE) restart

status: prerequisites
	@$(COMPOSE) ps

logs: prerequisites
	@$(COMPOSE) logs -f

clean: prerequisites down

fclean: prerequisites
	@$(COMPOSE) down -v --rmi all --remove-orphans

sprune: fclean
	@docker system prune --volumes -f

re: prerequisites clean all

ci: prerequisites
	@printf "$(GREEN)--- Local CI Mimic ---$(NO_COLOR)\n"
	@printf "$(GREEN)Step 1: Install Dependencies$(NO_COLOR)\n"
	@npm install --no-audit --no-fund --silent || (printf "$(RED)Step 1 (Install) failed.$(NO_COLOR)\n"; exit 1)
	@printf "$(GREEN)Step 2: Lint$(NO_COLOR)\n"
	@npm run lint || (printf "$(RED)Step 2 (Lint) failed.$(NO_COLOR)\n"; exit 1)
	@printf "$(GREEN)Step 3: Test$(NO_COLOR)\n"
	@npm run test || (printf "$(RED)Step 3 (Test) failed.$(NO_COLOR)\n"; exit 1)
	@printf "$(GREEN)Step 4: Build$(NO_COLOR)\n"
	@npm run build || (printf "$(RED)Step 4 (Build) failed.$(NO_COLOR)\n"; exit 1)
	@printf "$(GREEN)Step 5: Docker Integration Test$(NO_COLOR)\n"
	@$(COMPOSE) up -d --build --wait --quiet-pull || (printf "$(RED)Step 5 (Docker Integration) failed. Logs:$(NO_COLOR)\n"; $(COMPOSE) logs; $(COMPOSE) down -v; exit 1)
	@$(COMPOSE) down -v > /dev/null 2>&1
	@printf "$(GREEN)--- Local CI Success ---$(NO_COLOR)\n"

.PHONY: all help prerequisites build up down start stop restart status logs clean fclean sprune re ci
