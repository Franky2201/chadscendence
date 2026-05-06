# Base stage for dependencies
FROM node:22-alpine AS base
WORKDIR /app
# Copy root package files
COPY package*.json ./
# Copy workspace package files
COPY apps/backend/package*.json ./apps/backend/
# In a real monorepo with libs, you'd copy libs/*/package.json too
# For now, we just have backend
RUN npm ci

# Build stage
FROM base AS build
COPY . .
RUN npm run build -w backend

# Final stage
FROM node:22-alpine AS final
WORKDIR /app
# Use production dependencies only if possible, but for NestJS dist, we need the node_modules
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/backend/dist ./apps/backend/dist
COPY --from=build /app/apps/backend/package.json ./apps/backend/package.json

EXPOSE 3000
CMD ["node", "apps/backend/dist/main"]
