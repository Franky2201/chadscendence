# Automated Testing Suite for Chadscendence

This document outlines all automated tests that can be run from the command line to verify the integrity of the Chadscendence project in both development and production environments.

## 1. Development Mode Tests (`make`)

In development mode, we focus on code quality, hot reloading, and rapid feedback loops.

### 1.1 Infrastructure & Build
- `make check`: Verifies Docker installation, environment files, and local dependencies.
- `make build`: Performs a fresh build of all Docker images in development mode.
- `make up`: Starts all services with bind volumes for hot-reloading.
- `make ci`: Runs a full local CI cycle including linting, unit tests, and production build verification.

### 1.2 Code Quality & Unit Testing
- **Backend**:
  - `npm run lint -w backend`: Checks for ESLint errors in the backend service.
  - `npm run test -w backend`: Runs NestJS unit tests using Jest.
  - `npm run test:e2e -w backend`: Runs end-to-end API tests.
- **Frontend**:
  - `npm run lint -w frontend`: Checks for ESLint errors in the React application.
  - `npm run test -w frontend`: Runs component and hook tests using Vitest.
- **Shared Types**:
  - `npm run build -w @chad/types`: Verifies TypeScript compilation of the shared library.

### 1.3 Hot Reloading Verification
- **Backend**: Update a string in `apps/backend/src/app.service.ts` and verify the container logs show a recompile.
- **Frontend**: Update a component in `apps/frontend/src/pages/Home.tsx` and verify the browser updates instantly (via Vite HMR).

---

## 2. Production Mode Tests (`make prod`)

Production mode uses optimized images and follows strict relative pathing via Nginx.

### 2.1 Deployment Integrity
- `make prod`: Builds and starts optimized images using the `final` build target.
- `make status`: Confirms all containers are healthy and running.
- **Nginx Routing**: Verify that both frontend assets and API requests are correctly proxied.

### 2.2 Endpoint Validation
Using `curl` to verify core API health from the host:
- `curl -f http://localhost/api/health`: (Assuming health check endpoint exists)
- `curl -I http://localhost/`: Verify Nginx serves the index.html with a 200 OK.
- `curl -I http://localhost/uploads/admin.png`: Verify static asset serving.

---

## 3. Comprehensive System Tests (Headed/Headless)

### 3.1 Browser Automation (via Node.js Script)
Since dedicated libraries like Playwright aren't pre-installed, we use a custom health-check script to simulate basic user flows:
- **Auth Flow**: Register -> Login -> Logout.
- **Admin Access**: Login as admin -> Verify `/admin` doesn't redirect.
- **Game Session**: Start a solo game -> Submit a result -> Verify analytics update.

### 3.2 Real-time Communication
- **WebSockets**: Connect to `ws://localhost/api` and verify connection event.
- **Presence**: Login in one window, verify status update in another.

---

## 4. Maintenance & Cleanup
- `make down`: Gracefully stops and removes all containers.
- `make fclean`: Deep cleans the environment including images and volumes.
- `make sprune`: Executes a full Docker system prune for a clean state.
