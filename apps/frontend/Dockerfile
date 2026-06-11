# 1. Base stage
FROM node:22-alpine AS base
WORKDIR /app

# Copy root package files
COPY package*.json ./

# Copy only the necessary workspace package.json files
COPY apps/frontend/package*.json ./apps/frontend/
COPY libs/types/package*.json ./libs/types/

# Prune other workspaces from root package.json to satisfy npm ci
RUN node -e "const p = require('./package.json'); p.workspaces = ['apps/frontend', ...p.workspaces.filter(w => w.startsWith('libs/'))]; require('fs').writeFileSync('./package.json', JSON.stringify(p))"

# Install dependencies
RUN npm ci

# 2. Development stage
FROM base AS development
COPY . .
# Ensure types are built within the container for the dev environment
RUN npm run build -w @chad/types
CMD ["npm", "run", "dev", "-w", "frontend", "--", "--host", "0.0.0.0"]

# 3. Build stage
FROM base AS build

# Install openssl to generate self-signed certificate
RUN apk add --no-cache openssl
COPY . .

# Build @chad/types so its artifacts are available for the frontend build
RUN npm run build -w @chad/types

# Create directory for SSL certificates and generate a self-signed one
ARG DOMAIN_NAME
RUN if [ -z "$DOMAIN_NAME" ]; then echo "DOMAIN_NAME build arg is required"; exit 1; fi
RUN chmod +x ./apps/frontend/nginx/tls_setup.sh && \
	./apps/frontend/nginx/tls_setup.sh

RUN npm run build -w frontend

# 4. Final stage
FROM nginx:stable-alpine AS final

# Copy build artifacts and generated certificates
COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html
COPY --from=build /etc/nginx/tls /etc/nginx/tls
COPY apps/frontend/nginx/nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80 443 8080 8443
CMD ["nginx", "-g", "daemon off;"]
