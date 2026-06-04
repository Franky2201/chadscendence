# Makefile for ft_transcendence
ENV_FILE         := .env
COMPOSE_FILE     := docker-compose.yml
COMPOSE          := docker compose -f $(COMPOSE_FILE)
BACKEND_UPLOADS_PATH ?= ./apps/backend/uploads

GREEN    := \033[0;32m
RED      := \033[0;31m
NO_COLOR := \033[0m

all: dev #replace with `prod` for final evaluation

# Development mode with hot-reloading (Docker Compose Watch)
# Usage: make dev [service=name]
dev: check
	@printf "$(GREEN)Starting in development mode (hot-reloading enabled)...$(NO_COLOR)\n"
	@$(COMPOSE) up --watch $(service)

# Production mode for evaluation (Final build stage)
# Usage: make prod [service=name]
prod: check
	@printf "$(GREEN)Starting in production mode (evaluation)...$(NO_COLOR)\n"
	@$(COMPOSE) up -d --build --remove-orphans $(service)

help:
	@printf "$(GREEN)Available targets:$(NO_COLOR)\n"
	@printf "  all (default)  Start in default mode\n"
	@printf "  dev            Start in development mode (hot-reloading). Use 'service=name' for single service.\n"
	@printf "  prod           Start in production mode (evaluation). Use 'service=name' for single service.\n"
	@printf "  down           Stop and remove containers\n"
	@printf "  status         Check container status\n"
	@printf "  logs           Follow container logs\n"
	@printf "  re             Full rebuild and restart (dev)\n"
	@printf "  fclean         Deep clean (removes images and volumes)\n"

check:
	@command -v docker > /dev/null 2>&1 || (printf "$(RED)Docker is not installed.$(NO_COLOR)\n"; exit 1)
	@test -f $(ENV_FILE) || cp .env.example $(ENV_FILE)
	@mkdir -p $(BACKEND_UPLOADS_PATH)

# Usage: make build [service=name]
build: check
	@DOCKER_BUILDKIT=1 $(COMPOSE) build $(service)

up: dev

down start stop restart:
	@$(COMPOSE) $(MAKECMDGOALS) --remove-orphans 2>/dev/null || $(COMPOSE) $(MAKECMDGOALS)

status:
	@$(COMPOSE) ps

logs:
	@$(COMPOSE) logs -f

clean:
	@$(COMPOSE) down --remove-orphans

fclean:
	@$(COMPOSE) down -v --rmi all --remove-orphans
	@printf "$(GREEN)Docker environment cleaned (volumes and images removed).$(NO_COLOR)\n"

sprune: fclean
	@docker system prune --volumes -f

re: fclean all

ci: check
	@printf "$(GREEN)--- Local CI ---$(NO_COLOR)\n"
	@printf "$(GREEN)Step 1: Docker Build & Up$(NO_COLOR)\n"
	@$(COMPOSE) up -d --build --wait --quiet-pull    || \
	  (printf "$(RED)Step 1 failed. Logs:$(NO_COLOR)\n"; $(COMPOSE) logs; $(COMPOSE) down -v; exit 1)
	@$(COMPOSE) down -v > /dev/null 2>&1
	@printf "$(GREEN)--- CI passed ---$(NO_COLOR)\n"

.PHONY: all dev prod help check build up down start stop restart status logs clean fclean sprune re ci
