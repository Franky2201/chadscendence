# 1. Base stage for dependencies
FROM node:22-alpine AS base
WORKDIR /app

# Install openssl for HTTPS
RUN apk add --no-cache openssl

# Copy root package files
COPY package*.json ./

# Copy necessary workspace package.json files
COPY apps/backend/package*.json ./apps/backend/
COPY libs/types/package*.json ./libs/types/

# Prune other workspaces from root package.json to satisfy npm ci
RUN node -e "const p = require('./package.json'); p.workspaces = ['apps/backend', ...p.workspaces.filter(w => w.startsWith('libs/'))]; require('fs').writeFileSync('./package.json', JSON.stringify(p))"

# Install dependencies
RUN npm ci

# 2. Development stage (Stops here for dev)
FROM base AS development
ARG DOMAIN_NAME
RUN if [ -z "$DOMAIN_NAME" ]; then echo "DOMAIN_NAME build arg is required"; exit 1; fi

COPY . .
# Ensure types are built within the container for the dev environment
RUN npm run build -w @chad/types

# Generate self-signed certs for dev
RUN chmod +x ./apps/backend/scripts/tls_setup.sh && ./apps/backend/scripts/tls_setup.sh

CMD ["npm", "run", "start:dev", "-w", "backend"]

# 3. Build stage
FROM base AS build
ARG DOMAIN_NAME
RUN if [ -z "$DOMAIN_NAME" ]; then echo "DOMAIN_NAME build arg is required"; exit 1; fi

COPY . .
# Build both the types library and the backend
RUN npm run build -w @chad/types
RUN npm run build -w backend

# Generate certificates for production
RUN chmod +x ./apps/backend/scripts/tls_setup.sh && ./apps/backend/scripts/tls_setup.sh

# Prune devDependencies
RUN npm prune --omit=dev

# 4. Final stage
FROM node:22-alpine AS final
WORKDIR /app

# Security: Create a non-root user with explicit UID/GID 1001
RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nestjs -G nodejs
# Ensure the user can read the certificates
RUN mkdir -p /etc/backend/tls && chown -R nestjs:nodejs /etc/backend/tls

USER nestjs

# Copy artifacts from build stage with correct ownership
COPY --from=build --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nestjs:nodejs /app/apps/backend/dist ./apps/backend/dist
COPY --from=build --chown=nestjs:nodejs /app/apps/backend/package.json ./apps/backend/package.json
# Materialize the workspace dependency: only copy compiled artifacts and package metadata
COPY --from=build --chown=nestjs:nodejs /app/libs/types/package.json ./libs/types/package.json
COPY --from=build --chown=nestjs:nodejs /app/libs/types/dist ./libs/types/dist

# Copy certificates from build stage
COPY --from=build --chown=nestjs:nodejs /etc/backend/tls /etc/backend/tls

EXPOSE 3000
CMD ["node", "apps/backend/dist/src/main"]
