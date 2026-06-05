# Makefile for ft_transcendence
ENV_FILE         := .env
COMPOSE_FILE     := docker-compose.yml
COMPOSE          := docker compose -f $(COMPOSE_FILE)
BACKEND_UPLOADS_PATH ?= ./apps/backend/uploads

export COMPOSE_BAKE := true
export DOCKER_BUILDKIT := 1

GREEN    := \033[0;32m
RED      := \033[0;31m
NO_COLOR := \033[0m

all: up

# Start services in detached mode with hot-reloading (Bind Volumes)
up: check
	@printf "$(GREEN)Starting services in detached mode...$(NO_COLOR)\n"
	@$(COMPOSE) up -d --remove-orphans
	@printf "$(GREEN)Services started. Use 'make logs' to follow output or 'make down' to stop.$(NO_COLOR)\n"

help:
	@printf "$(GREEN)Available targets:$(NO_COLOR)\n"
	@printf "  all (default)  Start the project\n"
	@printf "  up             Start services (detached)\n"
	@printf "  build          Build or rebuild images\n"
	@printf "  down           Stop and remove containers\n"
	@printf "  start          Start stopped containers\n"
	@printf "  stop           Stop running containers\n"
	@printf "  restart        Restart containers\n"
	@printf "  status         Check container status\n"
	@printf "  logs           Follow container logs\n"
	@printf "  re             Full clean and restart\n"
	@printf "  fclean         Deep clean (removes images and volumes)\n"
	@printf "  sprune         Deep clean and system prune\n"
	@printf "  ci             Run local CI checks (lint, test, build)\n"

check:
	@command -v docker > /dev/null 2>&1 || (printf "$(RED)Docker is not installed.$(NO_COLOR)\n"; exit 1)
	@test -f $(ENV_FILE) || cp .env.example $(ENV_FILE)
	@mkdir -p $(BACKEND_UPLOADS_PATH)

build: check
	@$(COMPOSE) build

down:
	@$(COMPOSE) down --remove-orphans

start:
	@$(COMPOSE) start

stop:
	@$(COMPOSE) stop

restart:
	@$(COMPOSE) restart

status:
	@$(COMPOSE) ps

logs:
	@$(COMPOSE) logs -f

clean: down

fclean:
	@$(COMPOSE) down -v --rmi all --remove-orphans
	@printf "$(GREEN)Docker environment cleaned (volumes and images removed).$(NO_COLOR)\n"

sprune: fclean
	@printf "$(GREEN)Pruning in progress...$(NO_COLOR)\n"
	@docker system prune --volumes -f

re: fclean all

ci: check
	@printf "$(GREEN)--- Local CI ---$(NO_COLOR)\n"
	@printf "$(GREEN)Step 1: Docker Build & Up$(NO_COLOR)\n"
	@$(COMPOSE) up -d --build --wait --quiet-pull    || \
	  (printf "$(RED)Step 1 failed. Logs:$(NO_COLOR)\n"; $(COMPOSE) logs; $(COMPOSE) down -v; exit 1)
	@printf "$(GREEN)Step 2: Linting$(NO_COLOR)\n"
	@$(COMPOSE) exec -T backend npm run lint -w backend || (printf "$(RED)Backend linting failed.$(NO_COLOR)\n"; $(COMPOSE) down -v; exit 1)
	@$(COMPOSE) exec -T frontend npm run lint -w frontend || (printf "$(RED)Frontend linting failed.$(NO_COLOR)\n"; $(COMPOSE) down -v; exit 1)
	@printf "$(GREEN)Step 3: Testing$(NO_COLOR)\n"
	@$(COMPOSE) exec -T backend npm run test -w backend || (printf "$(RED)Backend tests failed.$(NO_COLOR)\n"; $(COMPOSE) down -v; exit 1)
	@$(COMPOSE) exec -T frontend npm run test -w frontend || (printf "$(RED)Frontend tests failed.$(NO_COLOR)\n"; $(COMPOSE) down -v; exit 1)
	@printf "$(GREEN)Step 4: Building$(NO_COLOR)\n"
	@$(COMPOSE) exec -T backend npm run build -w backend || (printf "$(RED)Backend build failed.$(NO_COLOR)\n"; $(COMPOSE) down -v; exit 1)
	@$(COMPOSE) exec -T frontend npm run build -w frontend || (printf "$(RED)Frontend build failed.$(NO_COLOR)\n"; $(COMPOSE) down -v; exit 1)
	@$(COMPOSE) down -v > /dev/null 2>&1
	@printf "$(GREEN)--- CI passed ---$(NO_COLOR)\n"

.PHONY: all help check build up down start stop restart status logs clean fclean sprune re ci
