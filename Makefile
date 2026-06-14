# Makefile for ft_transcendence
ENV_FILE         := .env
COMPOSE_FILE     := docker-compose.yml
COMPOSE          := docker compose -f $(COMPOSE_FILE)
BACKEND_UPLOADS_PATH ?= ./apps/backend/uploads

export COMPOSE_BAKE := true
export DOCKER_BUILDKIT := 1
export BUILD_TARGET := final

GREEN    := \033[0;32m
RED      := \033[0;31m
NO_COLOR := \033[0m

all: up

help:
	@printf "$(GREEN)Available targets:$(NO_COLOR)\n"
	@printf "  all (default)  Start the project in development mode\n"
	@printf "  prod           Start the project in production mode (Nginx, relative paths)\n"
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
	@if command -v npm > /dev/null 2>&1; then \
		printf "$(GREEN)Syncing local dependencies...$(NO_COLOR)\n"; \
		(npm install --quiet --no-fund --no-audit && \
		 printf "$(GREEN)Building shared types library...$(NO_COLOR)\n" && \
		 npm run build -w @chad/types --quiet && \
		 printf "$(GREEN)Proactively fixing linting errors (host-side)...$(NO_COLOR)\n" && \
		 npm run lint --workspaces --quiet) || \
		 printf "$(RED)Warning: Host-side sync failed. IDE/Linting might be inaccurate but Docker services will still start.$(NO_COLOR)\n"; \
	fi

build: check
	@$(COMPOSE) build

# development target: Start services with BUILD_TARGET=development
dev: export BUILD_TARGET=development
dev: up

# Start services in detached mode with hot-reloading (Bind Volumes)
up: check
	@printf "$(GREEN)Starting services (Mode: $${BUILD_TARGET:-development})...$(NO_COLOR)\n"
	@$(COMPOSE) up -d --remove-orphans --build
	@printf "$(GREEN)Services started. Use 'make logs' to follow output or 'make down' to stop.$(NO_COLOR)\n"

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
	@printf "$(GREEN)Cleaning host-side build artifacts...$(NO_COLOR)\n"
	@rm -rf libs/types/dist apps/backend/dist apps/frontend/dist
	@printf "$(GREEN)Cleanup complete.$(NO_COLOR)\n"

fclean: clean
	@printf "$(GREEN)Deep cleaning: removing node_modules...$(NO_COLOR)\n"
	@find . -name "node_modules" -type d -prune -exec rm -rf {} +
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
