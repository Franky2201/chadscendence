#!/bin/bash

# Usage: ./generate-game.sh <game-id>
# Example: ./generate-game.sh retro-pong

set -euo pipefail

GAME_ID=${1:-}
NEW_PORT="(not assigned)"

# 1. Validation check for empty arguments first
if [[ -z "$GAME_ID" ]]; then
    echo "Usage: ./generate-game.sh <game-id>"
    echo "Example: ./generate-game.sh retro-pong"
    exit 1
fi

# Check for required tools
if ! command -v docker > /dev/null 2>&1 && ! command -v node > /dev/null 2>&1; then
    echo "Error: Either 'docker' or 'node' is required to run this script."
    exit 1
fi

if ! command -v node > /dev/null 2>&1; then
    echo "Warning: 'node' not found on host. Falling back to Docker for node-based operations."
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

# Derive GAME_NAME (Title Case) from GAME_ID
# "retro-pong" -> "Retro Pong"
GAME_NAME=$(echo "$GAME_ID" | awk -F'-' '{
    result=""
    for(i=1; i<=NF; i++) {
        sep = (i==1) ? "" : " "
        result = result sep toupper(substr($i,1,1)) substr($i,2)
    }
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
        -e "s/__GAME_ID__/$GAME_ID/g" \
        -e "s/__GAME_NAME__/$SAFE_NAME/g" \
        -e "s/__COMPONENT_NAME__/$COMPONENT_NAME/g" \
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
            - ../../apps/games/$GAME_ID/src:/app/apps/games/$GAME_ID/src
            - ../../libs/types/src:/app/libs/types/src
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
    UPDATE_PKG_CMD="
      const fs = require('fs');
      const pkgPath = process.env.PKG_PATH;
      const gameId = process.env.GAME_ID;
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      pkg.scripts[gameId + ':dev'] = 'npm run start:dev -w ' + gameId;
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    "
    if command -v node > /dev/null 2>&1; then
        PKG_PATH="$ROOT_PACKAGE" GAME_ID="$GAME_ID" node -e "$UPDATE_PKG_CMD"
    else
        docker run --rm -u "$(id -u):$(id -g)" -v "$ROOT_DIR:/app" -e PKG_PATH="/app/package.json" -e GAME_ID="$GAME_ID" -w /app node:22-alpine node -e "$UPDATE_PKG_CMD"
    fi
fi

# 6. Create UI Component in Frontend
FRONTEND_COMP_DIR="$ROOT_DIR/apps/frontend/src/components/games"
UI_COMPONENT_PATH="$FRONTEND_COMP_DIR/${COMPONENT_NAME}UI.tsx"
UI_TEMPLATE_SRC="$SCRIPT_DIR/UI.template.tsx"

if [ -f "$UI_TEMPLATE_SRC" ]; then
    echo "Creating UI component at $UI_COMPONENT_PATH..."
    cp "$UI_TEMPLATE_SRC" "$UI_COMPONENT_PATH"
    "${SED_CMD[@]}" \
        -e "s/__GAME_ID__/$GAME_ID/g" \
        -e "s/__COMPONENT_NAME__/$COMPONENT_NAME/g" \
        -e "s/template-id/$GAME_ID/g" \
        -e "s/Template/$COMPONENT_NAME/g" \
        "$UI_COMPONENT_PATH"
    # Ensure file is readable and owned by the user if created via docker later
    chmod 644 "$UI_COMPONENT_PATH"
fi

# 7. Register Component in Games.tsx
GAMES_PAGE="$ROOT_DIR/apps/frontend/src/pages/Games.tsx"
if [ -f "$GAMES_PAGE" ]; then
    echo "Registering game in $GAMES_PAGE..."
    # Add import (using node for safer multi-line/insertion logic)
    REG_SCRIPT="
      const fs = require('fs');
      const gamesPagePath = process.env.GAMES_PAGE;
      const gameId = process.env.GAME_ID;
      const componentName = process.env.COMPONENT_NAME;
      let content = fs.readFileSync(gamesPagePath, 'utf8');

      // Add import if not exists
      const importLine = \`import \${componentName}UI from \"../components/games/\${componentName}UI\";\n\`;
      if (!content.includes(importLine)) {
          const lastImportMatch = content.match(/\\nimport\\s+.*\\n/g);
          if (lastImportMatch) {
              const lastImportIndex = content.lastIndexOf(lastImportMatch[lastImportMatch.length - 1]);
              const insertAt = content.indexOf('\\n', lastImportIndex + 1) + 1;
              content = content.slice(0, insertAt) + importLine + content.slice(insertAt);
          } else {
              content = importLine + content;
          }
      }

      // Add switch case with robust regex
      const switchMarker = /const\\s+renderActiveGame\\s*=\\s*\\(\\)\\s*=>\\s*\\{/;
      const switchMatch = content.match(switchMarker);
      if (!switchMatch) {
          console.error('Error: Could not find renderActiveGame function in Games.tsx');
          process.exit(1);
      }

      const switchBodyMarker = /switch\\s*\\(\\s*activeGameId\\s*\\)\\s*\\{/;
      const restOfContent = content.slice(switchMatch.index);
      const bodyMatch = restOfContent.match(switchBodyMarker);
      if (!bodyMatch) {
          console.error('Error: Could not find switch (activeGameId) block in Games.tsx');
          process.exit(1);
      }

      const bodyIndex = switchMatch.index + bodyMatch.index + bodyMatch[0].length;
      const caseBlock = \`\\n            case \"\${gameId}\":\\n                return <\${componentName}UI />;\`;

      if (!content.includes(\`case \"\${gameId}\":\`)) {
          content = content.slice(0, bodyIndex) + caseBlock + content.slice(bodyIndex);
          console.log(\`Successfully registered case \"\${gameId}\"\`);
      } else {
          console.log(\`Case \"\${gameId}\" already exists, skipping.\`);
      }

      fs.writeFileSync(gamesPagePath, content);
    "
    if command -v node > /dev/null 2>&1; then
        GAMES_PAGE="$GAMES_PAGE" GAME_ID="$GAME_ID" COMPONENT_NAME="$COMPONENT_NAME" node -e "$REG_SCRIPT"
    else
        docker run --rm -u "$(id -u):$(id -g)" -v "$ROOT_DIR:/app" \
            -e GAMES_PAGE="/app/apps/frontend/src/pages/Games.tsx" \
            -e GAME_ID="$GAME_ID" \
            -e COMPONENT_NAME="$COMPONENT_NAME" \
            -w /app node:22-alpine node -e "$REG_SCRIPT"
    fi
fi

echo "Game logic and frontend registration complete."

# 8. Register game in Backend (GamesModule & GamesService)
# Backend is now generic and uses GAMES_CLIENT for all games.
# No manual registration needed in GamesModule or GamesService.


echo "Done! New game created and registered."
echo "Port assigned: $NEW_PORT"

# 9. Update package-lock.json to include the new workspace
if [ -f "$ROOT_PACKAGE" ]; then
    echo "Updating package-lock.json..."
    if command -v docker > /dev/null 2>&1; then
        echo "Using a temporary Docker container to update lockfile (ensures compatibility)..."
        # We use node:22-alpine to match the microservices' environment
        docker run --rm -u "$(id -u):$(id -g)" -v "$ROOT_DIR:/app" -w /app node:22-alpine npm install --package-lock-only
        echo "Lockfile updated successfully."
    elif command -v npm > /dev/null 2>&1; then
        echo "Docker not found, falling back to host npm..."
        (cd "$ROOT_DIR" && npm install --package-lock-only)
        echo "Lockfile updated successfully."
    else
        echo "Warning: Neither 'docker' nor 'npm' found. You must update the lockfile manually."
    fi
fi

echo ""
echo "Next steps:"
echo "1. Run 'make' to see the new game service in the frontend."
echo "   Docker will automatically detect, build, and start your new game."
echo "2. Check the frontend at https://${DOMAIN_NAME:-localhost}:5173/games"
echo "3. Implement your game logic in apps/games/$GAME_ID/src/"
echo "4. Define your shared types in libs/types/src/game.ts"
echo "5. Customize your UI in ${UI_COMPONENT_PATH:-apps/frontend/src/components/games/}"
