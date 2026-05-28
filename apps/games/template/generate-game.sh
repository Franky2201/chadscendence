#!/bin/bash

# Usage: ./generate-game.sh <game-id> <game-name>
# Example: ./generate-game.sh pong "Retro Pong"

GAME_ID=$1
GAME_NAME=$2

if [ -z "$GAME_ID" ] || [ -z "$GAME_NAME" ]; then
    echo "Usage: ./generate-game.sh <game-id> <game-name>"
    echo "Example: ./generate-game.sh pong \"Retro Pong\""
    exit 1
fi

# Determine the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"
TARGET_DIR="$ROOT_DIR/apps/games/$GAME_ID"

if [ -d "$TARGET_DIR" ]; then
    echo "Error: Directory $TARGET_DIR already exists."
    exit 1
fi

echo "Creating game '$GAME_NAME' ($GAME_ID)..."

# Copy template content to target directory
mkdir -p "$TARGET_DIR"
cp -r "$SCRIPT_DIR/"* "$TARGET_DIR/"
# Remove the script itself from the new game directory
rm "$TARGET_DIR/generate-game.sh"

# Cross-platform sed compatibility (macOS vs Linux)
if [[ "$OSTYPE" == "darwin"* ]]; then
  SED_CMD=(sed -i '')
else
  SED_CMD=(sed -i)
fi

# Update package.json
"${SED_CMD[@]}" "s/game-template/$GAME_ID-game/g" "$TARGET_DIR/package.json"

# Update Dockerfile
"${SED_CMD[@]}" "s/game-template/$GAME_ID-game/g" "$TARGET_DIR/Dockerfile"
"${SED_CMD[@]}" "s|apps/games/template|apps/games/$GAME_ID|g" "$TARGET_DIR/Dockerfile"

# Update registration in app.module.ts
"${SED_CMD[@]}" "s/math/$GAME_ID/g" "$TARGET_DIR/src/app.module.ts"
"${SED_CMD[@]}" "s/Math/$GAME_NAME/g" "$TARGET_DIR/src/app.module.ts"
"${SED_CMD[@]}" "s/C'est du calcul mental frangin/Un nouveau défi t'attend !/g" "$TARGET_DIR/src/app.module.ts"

echo "Done! New game created at apps/games/$GAME_ID"
echo ""
echo "Next steps:"
echo "1. Add your service to apps/games/docker-compose.yml:"
echo "   $GAME_ID-game:"
echo "     container_name: ft_$GAME_ID-game"
echo "     build:"
echo "       context: ../../"
echo "       dockerfile: apps/games/$GAME_ID/Dockerfile"
echo "     environment:"
echo "       - PORT=300X # Choose a unique port"
echo "       - REDIS_HOST=redis"
echo "2. Add a dev script to root package.json:"
echo "   \"$GAME_ID:dev\": \"npm run start:dev -w $GAME_ID-game\""
echo "3. Run 'npm install' from the project root to link the new workspace."
echo "4. Integrate in apps/backend/src/games/ and apps/frontend/src/pages/Games.tsx."
