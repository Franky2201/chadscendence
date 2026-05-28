#!/bin/bash

# Usage: ./generate-game.sh <game-id> <game-name>
# Example: ./generate-game.sh pong "Retro Pong"

set -euo pipefail

GAME_ID=${1:-}
GAME_NAME=${2:-}
NEW_PORT="(not assigned)"

# 1. Validation check for empty arguments first
if [[ -z "$GAME_ID" || -z "$GAME_NAME" ]]; then
    echo "Usage: ./generate-game.sh <game-id> <game-name>"
    echo "Example: ./generate-game.sh pong \"Retro Pong\""
    exit 1
fi

# 2. Validation on GAME_ID format (alphanumeric with hyphens as separators only)
if [[ ! "$GAME_ID" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
    echo "Error: GAME_ID must be lowercase alphanumeric with hyphens only as separators (e.g., 'pong-game')."
    exit 1
fi

# Robust ROOT_DIR resolution
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR=$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel 2>/dev/null) \
    || { echo "Error: script must be inside the git repository."; exit 1; }
TARGET_DIR="$ROOT_DIR/apps/games/$GAME_ID"
DOCKER_COMPOSE="$ROOT_DIR/apps/games/docker-compose.yml"
ROOT_PACKAGE="$ROOT_DIR/package.json"

if [ -d "$TARGET_DIR" ]; then
    echo "Error: Directory $TARGET_DIR already exists."
    exit 1
fi

# Cleanup on error
trap 'echo "Error occurred. Cleaning up..."; rm -rf "$TARGET_DIR"' ERR

echo "Creating game '$GAME_NAME' ($GAME_ID)..."

# Copy template content to target directory
mkdir -p "$TARGET_DIR"
cp -r "$SCRIPT_DIR/"* "$TARGET_DIR/"

# Cleanup template script from target
rm -f "$TARGET_DIR/generate-game.sh"

# Cross-platform sed compatibility
if [[ "$OSTYPE" == "darwin"* ]]; then
  SED_CMD=(sed -i '')
else
  SED_CMD=(sed -i)
fi

# Escape GAME_NAME for sed
SAFE_NAME=$(printf '%s' "$GAME_NAME" | sed 's/[\/&]/\\&/g')

# 3. Process substitution instead of pipe to keep ERR trap active
echo "Applying template replacements..."
while IFS= read -r file; do
    "${SED_CMD[@]}" \
        -e "s/template-game/$GAME_ID-game/g" \
        -e "s/template-id/$GAME_ID/g" \
        -e "s/GAME_NAME/$SAFE_NAME/g" \
        -e "s/Template/$SAFE_NAME/g" \
        -e "s|apps/games/template|apps/games/$GAME_ID|g" \
        "$file"
done < <(find "$TARGET_DIR" -type f)

# 4. Automate docker-compose.yml update with specific port matching and awk for portability
if [ -f "$DOCKER_COMPOSE" ]; then
    echo "Updating apps/games/docker-compose.yml..."

    # Ensure tmp file is cleaned up even if we fail
    trap 'rm -f "$DOCKER_COMPOSE.tmp"' EXIT

    # Find the last used port specific to service definitions (ignoring REDIS_PORT)
    # Strip whitespace to ensure arithmetic works correctly
    LAST_PORT=$(grep -E "^\s+-\s+PORT=" "$DOCKER_COMPOSE" | awk -F'=' '{print $2}' | sort -n | tail -1 | tr -d '[:space:]')
    LAST_PORT=${LAST_PORT:-3000}
    NEW_PORT=$((LAST_PORT + 1))

    # Create the service block (added trailing blank line for formatting)
    SERVICE_BLOCK="    $GAME_ID-game:
        container_name: ft_$GAME_ID-game
        build:
            context: ../../
            dockerfile: apps/games/$GAME_ID/Dockerfile
            target: development
        env_file: ../../.env
        environment:
            - PORT=$NEW_PORT
            - REDIS_HOST=redis
            - REDIS_PORT=6379
        depends_on:
            redis:
                condition: service_healthy
        volumes:
            - ../../:/app
            - /app/node_modules
        networks:
            - ft_network
        restart: unless-stopped
"

    # Insert before the first 'networks:' line using awk for portability
    # If 'networks:' is missing, append it manually
    if ! grep -q "^networks:" "$DOCKER_COMPOSE"; then
        echo "Warning: 'networks:' not found in docker-compose.yml — appending service manually."
        echo "$SERVICE_BLOCK" >> "$DOCKER_COMPOSE"
    else
        SERVICE_BLOCK="$SERVICE_BLOCK" awk '
            BEGIN { block = ENVIRON["SERVICE_BLOCK"] }
            /^networks:/ && !inserted { print block; inserted=1 }
            { print }
        ' "$DOCKER_COMPOSE" > "$DOCKER_COMPOSE.tmp" && mv "$DOCKER_COMPOSE.tmp" "$DOCKER_COMPOSE"
    fi
fi

# 5. Automate root package.json update using Node.js for safe JSON manipulation
if [ -f "$ROOT_PACKAGE" ]; then
    echo "Updating root package.json scripts..."
    PACKAGE_PATH="$ROOT_PACKAGE" GAME_ID="$GAME_ID" node -e "
      const fs = require('fs');
      const pkg = JSON.parse(fs.readFileSync(process.env.PACKAGE_PATH));
      pkg.scripts[process.env.GAME_ID + ':dev'] = 'npm run start:dev -w ' + process.env.GAME_ID + '-game';
      fs.writeFileSync(process.env.PACKAGE_PATH, JSON.stringify(pkg, null, 2) + '\n');
    "
fi

echo "Done! New game created at apps/games/$GAME_ID"
echo "Port assigned: $NEW_PORT"
echo ""
echo "Next steps:"
echo "1. Run 'npm install' from the project root to link the new workspace."
echo "2. Implement your game logic in apps/games/$GAME_ID/src/."
echo "3. Add your unit tests in apps/games/$GAME_ID/test/."
echo "4. Create a UI component in apps/frontend/src/components/games/ using <GameContainer />."
echo "5. Register your component in apps/frontend/src/pages/Games.tsx."
