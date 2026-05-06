# Base stage for dependencies
FROM node:22-alpine AS base
WORKDIR /app
# Copy root package files
COPY package*.json ./
# Copy workspace package files
COPY apps/frontend/package*.json ./apps/frontend/
RUN npm ci

# Build stage
FROM base AS build
COPY . .
RUN npm run build -w frontend

# Final stage
FROM node:22-alpine AS final
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/frontend/dist ./apps/frontend/dist
COPY --from=build /app/apps/frontend/package.json ./apps/frontend/package.json

EXPOSE 5173
# Use 'vite preview' to serve the built files
CMD ["npm", "run", "preview", "-w", "frontend", "--", "--host", "0.0.0.0"]
