# 1. Base stage for dependencies
FROM node:22-alpine AS base
WORKDIR /app

# Copy root package files
COPY package*.json ./

# Copy all workspace package.json files (needed for monorepo npm ci)
COPY apps/backend/package*.json ./apps/backend/
COPY apps/frontend/package*.json ./apps/frontend/
COPY apps/games/template/package*.json ./apps/games/template/

# Install all dependencies
RUN npm ci

# 2. Development stage
FROM base AS development
COPY . .
CMD ["npm", "run", "start:dev", "-w", "template"]

# 3. Build stage
FROM base AS build
COPY . .
RUN npm run build -w template

# Prune devDependencies
RUN npm prune --omit=dev

# 4. Final stage
FROM node:22-alpine AS final
WORKDIR /app

# Security: Create a non-root user
RUN addgroup -S nodejs && adduser -S nestjs -G nodejs
USER nestjs

# Copy artifacts from build stage
COPY --from=build --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nestjs:nodejs /app/apps/games/template/dist ./apps/games/template/dist
COPY --from=build --chown=nestjs:nodejs /app/apps/games/template/package.json ./apps/games/template/package.json

EXPOSE 3001
CMD ["node", "apps/games/template/dist/main"]
