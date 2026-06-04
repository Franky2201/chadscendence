# 1. Base stage for dependencies
FROM node:22-alpine AS base
WORKDIR /app

# Copy root package files
COPY package*.json ./

# Copy necessary workspace package.json files
COPY apps/games/math/package*.json ./apps/games/math/
COPY libs/types/package*.json ./libs/types/

# Prune other workspaces from root package.json to satisfy npm ci
RUN node -e "const p = require('./package.json'); p.workspaces = ['apps/games/math', ...p.workspaces.filter(w => w.startsWith('libs/'))]; require('fs').writeFileSync('./package.json', JSON.stringify(p))"

# Install dependencies
# If npm ci fails (e.g. lockfile out of sync), fall back to npm install to allow the build to proceed
RUN npm ci || npm install

# 2. Development stage
FROM base AS development
COPY . .
RUN npm install -g @nestjs/cli
# Ensure types are built within the container for the dev environment
RUN npm run build -w @chad/types
CMD ["npm", "run", "start:dev", "-w", "math"]

# 3. Build stage
FROM base AS build
COPY . .
# Build both the types library and the game
RUN npm run build -w @chad/types
RUN npm run build -w math

# Prune devDependencies
RUN npm prune --omit=dev

# 4. Final stage
FROM node:22-alpine AS final
WORKDIR /app

# Security: Create a non-root user
RUN addgroup -S nodejs && adduser -S nestjs -G nodejs
USER nestjs

# Copy artifacts from build stage with correct ownership
COPY --from=build --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nestjs:nodejs /app/apps/games/math/dist ./apps/games/math/dist
COPY --from=build --chown=nestjs:nodejs /app/apps/games/math/package.json ./apps/games/math/package.json
# Materialize the workspace dependency: only copy compiled artifacts and package metadata
COPY --from=build --chown=nestjs:nodejs /app/libs/types/package.json ./libs/types/package.json
COPY --from=build --chown=nestjs:nodejs /app/libs/types/dist ./libs/types/dist

EXPOSE 3001
CMD ["node", "apps/games/math/dist/main"]
