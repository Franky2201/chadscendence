# 1. Base stage for dependencies
FROM node:22-alpine AS base
WORKDIR /app

# Copy root package files
COPY package*.json ./

# Copy necessary workspace package.json files
COPY apps/backend/package*.json ./apps/backend/
COPY libs/types/package*.json ./libs/types/

# Prune other workspaces from root package.json to satisfy npm ci
RUN node -e "const p = require('./package.json'); p.workspaces = p.workspaces.filter(w => w === 'apps/backend' || w.startsWith('libs/')); require('fs').writeFileSync('./package.json', JSON.stringify(p))"

# Install dependencies
RUN npm ci

# 2. Development stage (Stops here for dev)
FROM base AS development
COPY . .
CMD ["npm", "run", "start:dev", "-w", "backend"]

# 3. Build stage
FROM base AS build
COPY . .
# Build both the types library and the backend
RUN npm run build -w @chad/types
RUN npm run build -w backend

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
COPY --from=build --chown=nestjs:nodejs /app/apps/backend/dist ./apps/backend/dist
COPY --from=build --chown=nestjs:nodejs /app/apps/backend/package.json ./apps/backend/package.json
# Materialize the workspace dependency by copying the types library
COPY --from=build --chown=nestjs:nodejs /app/libs/types ./libs/types

EXPOSE 3000
CMD ["node", "apps/backend/dist/main"]
