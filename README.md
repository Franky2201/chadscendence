# ft_transcendence: Mini-Game Hub Project Plan

**Tech Stack:** React (TypeScript, Vite, Tailwind), NestJS (Monorepo via pnpm workspaces), PostgreSQL (TypeORM), Redis (Native Lists & Pub/Sub), Docker.
**Architecture:** Smart API Gateway (Core) with Native Redis Game Microservices and Event-Driven Websockets.
**Goal:** Exceed the 14-point mandatory minimum.

---

### Feature 1: Core Infrastructure & WebSocket Handshake
*Focus: Establishing the Docker environment and secure, stateless WS connections.*

| ID | Task Name | Technical Strategy | Est. Time | Risk | Peer Review? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1.1** | Containerize Core DB & Backend | Create Docker Compose setting up PostgreSQL, Redis, and the NestJS Core app. | 2 hrs | Low | Yes |
| **1.2** | Implement JWT Authentication | Configure `@nestjs/jwt` and `@nestjs/passport` to handle registration, login, and token issuance. | 4 hrs | Medium | Yes |
| **1.3** | Frontend Auth Flow | Build React form using raw functional components and Tailwind to capture credentials and store the JWT. | 3 hrs | Low | No |
| **1.4** | NestJS WebSocket Config | Setup WS Gateway. Implement "Auth-First-Message" pattern (3-second connection timeout for JWT validation). | 3 hrs | Medium | Yes |
| **1.5** | Frontend WS Connection | Connect React client to the WS endpoint using the stored JWT and echo a connection message. | 2 hrs | Low | No |

---

### Feature 2: The Jam Lobby & Matchmaking
*Focus: Lightning-fast session management using native Redis Hashes and Lists.*

| ID | Task Name | Technical Strategy | Est. Time | Risk | Peer Review? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **2.1** | Define Lobby DTOs | Create shared `JamLobby` interfaces in the `libs` folder for strict typing across frontend and backend. | 2 hrs | Low | Yes |
| **2.2** | Native Matchmaking Queue | Implement `joinJam(User)` using raw Redis `RPUSH` and `LPOP` commands to manage sequential player queues. | 3 hrs | Medium | Yes |
| **2.3** | Active Lobby Storage | Store active waiting rooms as Redis Hashes (`HSET`) with a strict TTL to prevent memory leaks. | 3 hrs | Medium | Yes |
| **2.4** | Countdown & Handoff | When full, broadcast 3-second countdown over WS, then emit a `MatchStartEvent` to the Game Microservice. | 3 hrs | Medium | Yes |
| **2.5** | Frontend Lobby UI | Build a Tailwind React view to "Join Jam", render real-time avatar list, and display countdown animation. | 4 hrs | Low | No |

---

### Feature 3: The Game Microservice & Real-Time Sync
*Focus: Fast internal communication and native event loop timing.*

| ID | Task Name | Technical Strategy | Est. Time | Risk | Peer Review? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **3.1** | Setup Redis Transporter | Configure the Game microservice `main.ts` to use `Transport.REDIS` instead of HTTP/gRPC. | 2 hrs | Low | Yes |
| **3.2** | Core Game Gateway | Configure NestJS Core to route incoming WS answers directly to the Game microservice via `ClientProxy`. | 2 hrs | Low | Yes |
| **3.3** | Game State Management | Implement Node.js `setTimeout` and `clearTimeout` to handle answer time windows and in-memory game loops natively. | 4 hrs | High | Yes |
| **3.4** | Real-Time Answer Routing | Wire Core WS Gateway to receive microservice validation events and broadcast feedback to clients. | 3 hrs | Medium | Yes |
| **3.5** | Final Score & DB Persistence | Microservice emits `GameFinishedEvent`. Core listens, calculates final match results, and updates Postgres via TypeORM. | 3 hrs | Low | Yes |

---

### Feature 4: User Profiles & Friends System
*Focus: Relational data integrity and static file management.*

| ID | Task Name | Technical Strategy | Est. Time | Risk | Peer Review? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **4.1** | Define Entity Schemas | Create `User` and `Friendship` (Join Table) entities using TypeORM decorators. Set `avatarPath` as a standard string. | 2 hrs | Low | Yes |
| **4.2** | Profile REST API | Implement GET endpoints for stats and a POST endpoint using NestJS `FileInterceptor` to save avatar uploads to the local file system. | 3 hrs | Low | No |
| **4.3** | Friendship Service Logic | Write core logic for requests, accepting, and blocking (with DB-level query filters for blocked users). | 3 hrs | Medium | Yes |
| **4.4** | Friendship REST API | Expose endpoints to list friends, view pending requests, and trigger status changes. | 2 hrs | Low | Yes |
| **4.5** | Frontend Profile View | Build Tailwind UI to display user info, stats, and the file upload input. Fetch avatars from the static Core backend route. | 3 hrs | Low | No |
| **4.6** | Frontend Social Actions | Implement friends list UI; add buttons to send/accept requests or block users. | 4 hrs | Medium | No |

---

### Feature 5: Real-Time Live Chat
*Focus: Multi-session WebSocket dispatching and cross-container Redis Pub/Sub.*

| ID | Task Name | Technical Strategy | Est. Time | Risk | Peer Review? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **5.1** | Define Chat Entities | Create TypeORM entities for `Conversation`, `Participant`, and `Message` (fixed schema). | 2 hrs | Low | Yes |
| **5.2** | Message REST API | Implement HTTP GET endpoints to fetch conversation lists and historical messages. | 2 hrs | Low | No |
| **5.3** | WS Session Registry | Create a Map (`Map<number, Set<Socket>>`) in the Core WS Gateway linking a `userId` to active tabs. | 2 hrs | Medium | Yes |
| **5.4** | Redis Pub/Sub Chat Routing | Publish new messages to Redis, allowing the Core to pick them up and route to active sessions instantly. | 3 hrs | Medium | Yes |
| **5.5** | Real-Time Dispatcher | Check Session Registry. Push message payload down all open WebSockets for the specific user. | 3 hrs | High | Yes |
| **5.6** | Frontend Chat UI | Build Tailwind chat interface, rendering history via REST and appending new messages via WS. | 4 hrs | Low | No |

---

### Feature 6: Gamification & Stats (Core Integration)
*Focus: Event-driven updates within the monolith to prevent race conditions.*

| ID | Task Name | Technical Strategy | Est. Time | Risk | Peer Review? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **6.1** | Define Stats & Achievements | Create TypeORM entities for `UserStats` (XP, level) and `Achievement` linked to the core `User` table. | 2 hrs | Low | Yes |
| **6.2** | Gamification Service Logic | Write service to process `GameFinishedEvent` sequentially, calculate XP, trigger level-ups. | 3 hrs | Medium | Yes |
| **6.3** | Stats API Endpoints | Implement REST GET endpoints using native TypeORM `.query()` strings for complex leaderboard aggregations. | 2 hrs | Low | No |
| **6.4** | Frontend Gamification UI | Build Tailwind components for XP progress bars, badge gallery, and a sortable global leaderboard. | 4 hrs | Low | No |

---

### Feature 7: Advanced Authentication (OAuth & 2FA)
*Focus: Multi-step login flows and stateful pre-authentication tokens.*

| ID | Task Name | Technical Strategy | Est. Time | Risk | Peer Review? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **7.1** | OAuth2 Client Integration | Configure `@nestjs/passport` for the 42 Intra OAuth2 flow (client ID, secret, redirect URI). | 3 hrs | Medium | Yes |
| **7.2** | 2FA Secret Generation | Implement service to generate secure TOTP secret (e.g., using `otplib`), save to DB, and generate QR code URI. | 3 hrs | Low | No |
| **7.3** | The Partial Auth State | Intercept login, check 2FA flag, issue short-lived "pre-auth" token restricting access strictly to `/verify-2fa`. | 3 hrs | High | Yes |
| **7.4** | TOTP Verification API | Build endpoint accepting 6-digit code + pre-auth token, validate against DB, issue final auth JWT. | 3 hrs | Medium | Yes |
| **7.5** | Frontend OAuth & 2FA UI | Add Tailwind "Login with 42" button, 2FA code entry screen, and profile section to setup 2FA. | 4 hrs | Low | No |

---

### Feature 8: NestJS Monorepo & Deployment Infrastructure
*Focus: Strict workspace boundaries, persistent volumes, and a single-command evaluator setup.*

| ID | Task Name | Technical Strategy | Est. Time | Risk | Peer Review? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **8.1** | Monorepo Initialization | Scaffold the monorepo utilizing `pnpm workspaces`. Create `core`, `game`, and `libs` directories. | 2 hrs | Low | No |
| **8.2** | Shared Event Contracts | Define strict TypeScript interfaces in `libs` for the native NestJS Redis transporter payloads. | 2 hrs | Low | Yes |
| **8.3** | Multi-Stage Dockerfile | Write a root Dockerfile utilizing `ARG APP_NAME` to build/run independent containers. Map a persistent Docker Volume for the `uploads/` directory. | 3 hrs | High | Yes |
| **8.4** | Master Makefile | Create the root `Makefile` orchestrating `docker compose up --build -d` and `clean` commands. | 2 hrs | Low | No |
