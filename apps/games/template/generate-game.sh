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

# Derive COMPONENT_NAME (PascalCase) for React components and filenames
# "retro-pong" -> "RetroPong"
COMPONENT_NAME=$(echo "$GAME_ID" | awk -F'-' '{
    result=""
    for(i=1; i<=NF; i++) result = result toupper(substr($i,1,1)) substr($i,2)
    print result
}')

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

# Cleanup non-game files from target
rm -f "$TARGET_DIR/generate-game.sh"
rm -f "$TARGET_DIR/UI.template.tsx"

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
        -e "s/template/$GAME_ID/g" \
        -e "s/template-id/$GAME_ID/g" \
        -e "s/GAME_NAME/$SAFE_NAME/g" \
        -e "s/Template/$COMPONENT_NAME/g" \
        -e "s|apps/games/template|apps/games/$GAME_ID|g" \
        "$file"
done < <(find "$TARGET_DIR" -type f)

# 4. Automate docker-compose.yml update with specific port matching and awk for portability
if [ -f "$DOCKER_COMPOSE" ]; then
    echo "Updating apps/games/docker-compose.yml..."

    # Ensure tmp file is cleaned up even if we fail
    trap 'rm -f "$DOCKER_COMPOSE.tmp"' EXIT

    # Find the last used port specific to service definitions (ignoring REDIS_PORT)
    LAST_PORT=$(grep -E "^\s+-\s+PORT=" "$DOCKER_COMPOSE" | awk -F'=' '{print $2}' | sort -n | tail -1 | tr -d '[:space:]')
    LAST_PORT=${LAST_PORT:-3000}
    NEW_PORT=$((LAST_PORT + 1))

    # Create the service block
    SERVICE_BLOCK="    $GAME_ID:
        container_name: ft_$GAME_ID
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

    # Insert before the first 'networks:' line using awk
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

# 5. Automate root package.json update
if [ -f "$ROOT_PACKAGE" ]; then
    echo "Updating root package.json scripts..."
    PACKAGE_PATH="$ROOT_PACKAGE" GAME_ID="$GAME_ID" node -e "
      const fs = require('fs');
      const pkg = JSON.parse(fs.readFileSync(process.env.PACKAGE_PATH));
      pkg.scripts[process.env.GAME_ID + ':dev'] = 'npm run start:dev -w ' + process.env.GAME_ID;
      fs.writeFileSync(process.env.PACKAGE_PATH, JSON.stringify(pkg, null, 2) + '\n');
    "
fi

# 6. Create UI Component in Frontend
FRONTEND_COMP_DIR="$ROOT_DIR/apps/frontend/src/components/games"
UI_COMPONENT_PATH="$FRONTEND_COMP_DIR/${COMPONENT_NAME}UI.tsx"
UI_TEMPLATE_SRC="$SCRIPT_DIR/UI.template.tsx"

if [ -f "$UI_TEMPLATE_SRC" ]; then
    echo "Creating UI component at $UI_COMPONENT_PATH..."
    cp "$UI_TEMPLATE_SRC" "$UI_COMPONENT_PATH"
    "${SED_CMD[@]}" \
        -e "s/template-id/$GAME_ID/g" \
        -e "s/Template/$COMPONENT_NAME/g" \
        "$UI_COMPONENT_PATH"
fi

# 7. Register Component in Games.tsx
GAMES_PAGE="$ROOT_DIR/apps/frontend/src/pages/Games.tsx"
if [ -f "$GAMES_PAGE" ]; then
    echo "Registering game in $GAMES_PAGE..."
    # Add import (using node for safer multi-line/insertion logic)
    GAME_ID="$GAME_ID" COMPONENT_NAME="$COMPONENT_NAME" GAMES_PAGE="$GAMES_PAGE" node -e "
      const fs = require('fs');
      let content = fs.readFileSync(process.env.GAMES_PAGE, 'utf8');

      // Add import if not exists
      const importLine = \`import \${process.env.COMPONENT_NAME}UI from \"../components/games/\${process.env.COMPONENT_NAME}UI\";\n\`;
      if (!content.includes(importLine)) {
          // Find last import to preserve 'use client' or header safety
          const lastImportIndex = content.lastIndexOf('\nimport ');
          if (lastImportIndex !== -1) {
              const insertAt = content.indexOf('\n', lastImportIndex + 1) + 1;
              content = content.slice(0, insertAt) + importLine + content.slice(insertAt);
          } else {
              content = importLine + content;
          }
      }

      // Add switch case
      const switchMarker = 'switch (activeGameId) {';
      const switchIndex = content.indexOf(switchMarker);
      if (switchIndex === -1) {
          console.error('Could not find switch (activeGameId) in Games.tsx — skipping case registration.');
          process.exit(1);
      }

      const caseBlock = \`            case \"\${process.env.GAME_ID}\":\n                return <\${process.env.COMPONENT_NAME}UI />;\n\`;

      if (!content.includes(\`case \"\${process.env.GAME_ID}\":\`)) {
          const index = switchIndex + switchMarker.length;
          content = content.slice(0, index) + '\n' + caseBlock + content.slice(index);
      }

      fs.writeFileSync(process.env.GAMES_PAGE, content);
    "
fi

# 8. Run npm install
echo "Running npm install..."
(cd "$ROOT_DIR" && npm install)

# 9. Register game in Backend (GamesModule & GamesService)
# Backend is now generic and uses GAMES_CLIENT for all games.
# No manual registration needed in GamesModule or GamesService.


echo "Done! New game created and registered."
echo "Port assigned: $NEW_PORT"
echo ""
echo "Next steps:"
echo "1. Run 'make up' to see the new game service in the frontend."
echo "2. Implement your game logic in apps/games/$GAME_ID/src/."
echo "3. Add your unit tests in apps/games/$GAME_ID/test/."
echo "4. Customize your UI in ${UI_COMPONENT_PATH:-apps/frontend/src/components/games/}"
