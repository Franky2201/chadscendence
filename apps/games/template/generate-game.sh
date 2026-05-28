#!/bin/bash

# Usage: ./generate-game.sh <game-id> <game-name>
# Example: ./generate-game.sh pong "Retro Pong"

GAME_ID=$1
GAME_NAME=$2

# 6. Validation on GAME_ID format
if [[ ! "$GAME_ID" =~ ^[a-z0-9-]+$ ]]; then
    echo "Error: GAME_ID must be lowercase alphanumeric with hyphens only (e.g., 'pong-game')."
    exit 1
fi

if [ -z "$GAME_NAME" ]; then
    echo "Usage: ./generate-game.sh <game-id> <game-name>"
    echo "Example: ./generate-game.sh pong \"Retro Pong\""
    exit 1
fi

# 8. Robust ROOT_DIR resolution
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

# 7. Cleanup on error
trap 'echo "Error occurred. Cleaning up..."; rm -rf "$TARGET_DIR"' ERR

echo "Creating game '$GAME_NAME' ($GAME_ID)..."

# Copy template content to target directory
mkdir -p "$TARGET_DIR"
cp -r "$SCRIPT_DIR/"* "$TARGET_DIR/"

# 5. rm -f for silent success
rm -f "$TARGET_DIR/generate-game.sh"

# Cross-platform sed compatibility
if [[ "$OSTYPE" == "darwin"* ]]; then
  SED_CMD=(sed -i '')
else
  SED_CMD=(sed -i)
fi

# 4. Escape GAME_NAME for sed
SAFE_NAME=$(printf '%s' "$GAME_NAME" | sed 's/[\/&]/\\&/g')

# 9. Merge replacements into a single pass
echo "Applying template replacements..."
find "$TARGET_DIR" -type f | while IFS= read -r file; do
    # Skip binary files or other exclusions if necessary, but for a template it's usually safe
    "${SED_CMD[@]}" \
        -e "s/template-game/$GAME_ID-game/g" \
        -e "s/template-id/$GAME_ID/g" \
        -e "s/GAME_NAME/$SAFE_NAME/g" \
        -e "s|apps/games/template|apps/games/$GAME_ID|g" \
        "$file"
done

# 10. Automate docker-compose.yml update
if [ -f "$DOCKER_COMPOSE" ]; then
    echo "Updating apps/games/docker-compose.yml..."

    # Find the last used port and increment it
    LAST_PORT=$(grep "PORT=" "$DOCKER_COMPOSE" | awk -F'=' '{print $2}' | sort -n | tail -1)
    NEW_PORT=$((LAST_PORT + 1))

    # Create the service block
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
    # Insert before 'networks:' line
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "/networks:/i\\
$SERVICE_BLOCK
" "$DOCKER_COMPOSE"
    else
        sed -i "/networks:/i $SERVICE_BLOCK" "$DOCKER_COMPOSE"
    fi
fi

# Automate root package.json update
if [ -f "$ROOT_PACKAGE" ]; then
    echo "Updating root package.json scripts..."
    # Insert the new dev script after 'frontend:dev'
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "/\"frontend:dev\":/a\\
        \"$GAME_ID:dev\": \"npm run start:dev -w $GAME_ID-game\",
" "$ROOT_PACKAGE"
    else
        sed -i "/\"frontend:dev\":/a \        \"$GAME_ID:dev\": \"npm run start:dev -w $GAME_ID-game\"," "$ROOT_PACKAGE"
    fi
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
