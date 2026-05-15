# 1. Base stage for dependencies
FROM node:22-alpine AS base
WORKDIR /app

# Copy root package files
COPY package*.json ./

# Copy all workspace package.json files (needed for monorepo npm ci)
COPY apps/backend/package*.json ./apps/backend/
COPY apps/frontend/package*.json ./apps/frontend/

# Install all dependencies
RUN npm ci

# 2. Development stage (Stops here for dev)
FROM base AS development
COPY . .
CMD ["npm", "run", "start:dev", "-w", "backend"]

# 3. Build stage
FROM base AS build
COPY . .
RUN npm run build -w backend

# Prune devDependencies to keep the final image small
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

EXPOSE 3000
CMD ["node", "apps/backend/dist/main"]
