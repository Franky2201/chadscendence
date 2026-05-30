# Makefile for ft_chadscendence
ENV_FILE         := .env
COMPOSE_FILE     := docker-compose.yml
COMPOSE          := docker compose -f $(COMPOSE_FILE)
BACKEND_UPLOADS_PATH ?= ./apps/backend/uploads

GREEN    := \033[0;32m
RED      := \033[0;31m
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

# Lightweight check: only verify tools and files exist. No npm install.
check:
	@command -v node   > /dev/null 2>&1 || (printf "$(RED)Node.js is not installed.$(NO_COLOR)\n"; exit 1)
	@command -v npm    > /dev/null 2>&1 || (printf "$(RED)npm is not installed.$(NO_COLOR)\n"; exit 1)
	@command -v docker > /dev/null 2>&1 || (printf "$(RED)Docker is not installed.$(NO_COLOR)\n"; exit 1)
	@test -f $(COMPOSE_FILE) || (printf "$(RED)Missing $(COMPOSE_FILE)$(NO_COLOR)\n"; exit 1)
	@test -f $(ENV_FILE) || cp .env.example $(ENV_FILE)
	@mkdir -p $(BACKEND_UPLOADS_PATH)

# Full setup: tools check + dependency install (used only when building)
prerequisites: check
	@printf "$(GREEN)Installing dependencies...$(NO_COLOR)\n"
	@npm install
	@printf "$(GREEN)Prerequisites met.$(NO_COLOR)\n"

build: prerequisites
	@printf "$(GREEN)Building shared libraries...$(NO_COLOR)\n"
	@npm run build -ws --if-present
	@DOCKER_BUILDKIT=1 $(COMPOSE) build

up: build
	@$(COMPOSE) up -d --remove-orphans

# Compose lifecycle — only needs tool check, not a full npm install
down start stop restart: check
	@$(COMPOSE) $(MAKECMDGOALS) --remove-orphans 2>/dev/null || $(COMPOSE) $(MAKECMDGOALS)

status: check
	@$(COMPOSE) ps

logs: check
	@$(COMPOSE) logs -f

clean: check
	@$(COMPOSE) down --remove-orphans

# fclean must NOT depend on prerequisites — it deletes node_modules
fclean: check
	@$(COMPOSE) down -v --rmi all --remove-orphans
	@printf "$(GREEN)Cleaning up host artifacts...$(NO_COLOR)\n"
	@rm -rf node_modules \
	        apps/backend/node_modules apps/frontend/node_modules \
	        apps/backend/dist apps/frontend/dist \
	        libs/types/dist \
	        apps/games/*/dist apps/games/*/node_modules

sprune: fclean
	@docker system prune --volumes -f

re: fclean all

ci: check
	@printf "$(GREEN)--- Local CI ---$(NO_COLOR)\n"
	@printf "$(GREEN)Step 1: Install$(NO_COLOR)\n"
	@npm install --no-audit --no-fund --silent       || (printf "$(RED)Step 1 failed.$(NO_COLOR)\n"; exit 1)
	@printf "$(GREEN)Step 2: Build$(NO_COLOR)\n"
	@npm run build -w @chad/types                    || (printf "$(RED)Step 2a failed.$(NO_COLOR)\n"; exit 1)
	@npm run build -ws --if-present                  || (printf "$(RED)Step 2b failed.$(NO_COLOR)\n"; exit 1)
	@printf "$(GREEN)Step 3: Lint$(NO_COLOR)\n"
	@npm run lint                                    || (printf "$(RED)Step 3 failed.$(NO_COLOR)\n"; exit 1)
	@printf "$(GREEN)Step 4: Test$(NO_COLOR)\n"
	@npm run test                                    || (printf "$(RED)Step 4 failed.$(NO_COLOR)\n"; exit 1)
	@printf "$(GREEN)Step 5: Docker$(NO_COLOR)\n"
	@$(COMPOSE) up -d --build --wait --quiet-pull    || \
	  (printf "$(RED)Step 5 failed. Logs:$(NO_COLOR)\n"; $(COMPOSE) logs; $(COMPOSE) down -v; exit 1)
	@$(COMPOSE) down -v > /dev/null 2>&1
	@printf "$(GREEN)--- CI passed ---$(NO_COLOR)\n"

.PHONY: all help check prerequisites build up down start stop restart status logs clean fclean sprune re ci