# ft_chadscendence: Mini-Game Hub Project Plan

**Tech Stack:** React (TypeScript, Vite, Tailwind), NestJS (Monorepo via npm workspaces), PostgreSQL (TypeORM), Redis (Native Lists & Pub/Sub), Docker.
**Architecture:** Smart API Gateway (`backend`) with Native Redis Game Microservices (`apps/games/*`) and Event-Driven Websockets.

**Directory Structure:**

- `apps/backend`: Core API Gateway, Auth, Chat, and DB Persistence.
- `apps/frontend`: React Single Page Application.
- `apps/games/`: Individual microservices for game logic (e.g., `pong`).
- `libs/`: Shared TypeScript contracts and utilities.

---

### Phase 0: Foundation & Infrastructure (The Base)

_Goal: Establish the monorepo and containerized environment._

| ID      | Status | Task Name           | Technical Strategy                                                                                                  |
| :------ | :----- | :------------------ | :------------------------------------------------------------------------------------------------------------------ |
| **0.1** | [x]    | Monorepo Setup      | Initialize `npm workspaces`. Move current code to `apps/backend` and `apps/frontend`.                               |
| **0.2** | [x]    | Workspace Structure | Create `libs/` and `apps/games/` directories.                                                                       |
| **0.3** | [x]    | Dockerization       | Root `docker-compose.yml` (Postgres, Redis). **Mandatory: Persistent Docker Volume for `backend/uploads` avatars.** |
| **0.4** | [x]    | Root Makefile       | Single command `make up` to build and start the entire stack.                                                       |

---

### Feature 1: Core Infrastructure & WebSocket Handshake

_Focus: Secure, stateless WS connections._

| ID      | Status | Task Name          | Technical Strategy                                                                                          |
| :------ | :----- | :----------------- | :---------------------------------------------------------------------------------------------------------- |
| **1.1** | [ ]    | JWT Authentication | NestJS Core (`backend`) handles registration/login via `@nestjs/jwt`.                                       |
| **1.2** | [ ]    | Frontend Auth      | React login/register forms; persist JWT in local storage.                                                   |
| **1.3** | [ ]    | WS Gateway         | Setup `backend` WS Gateway with "Auth-First-Message" (3s timeout) and **`handleDisconnect` forfeit logic.** |
| **1.4** | [ ]    | WS Handshake       | Connect `frontend` to WS using JWT; implement heartbeat/echo.                                               |

---

### Feature 2: The Jam Lobby & Matchmaking

_Focus: Session management using native Redis._

| ID      | Status | Task Name            | Technical Strategy                                                                      |
| :------ | :----- | :------------------- | :-------------------------------------------------------------------------------------- |
| **2.1** | [ ]    | Shared Contracts     | Define `JamLobby` and `GameState` interfaces in `libs/`.                                |
| **2.2** | [ ]    | Matchmaking Queue    | `backend` implements `joinJam` using Redis `RPUSH` and `LPOP`.                          |
| **2.3** | [ ]    | Active Lobby Storage | Store waiting rooms in Redis Hashes (`HSET`) with TTL.                                  |
| **2.4** | [ ]    | Countdown & Handoff  | Broadcast countdown via WS; emit `MatchStartEvent` to the target game in `apps/games/`. |
| **2.5** | [ ]    | Lobby UI             | Tailwind view in `frontend` for real-time player lists and countdowns.                  |

---

### Feature 3: Game Microservices & Sync

_Focus: Distributed logic and high-speed updates._

| ID      | Status | Task Name          | Technical Strategy                                                                      |
| :------ | :----- | :----------------- | :-------------------------------------------------------------------------------------- |
| **3.1** | [ ]    | Redis Microservice | Setup `apps/games/pong` using NestJS `Transport.REDIS`.                                 |
| **3.2** | [ ]    | Action Routing     | `backend` routes WS player moves and **Disconnection Events** to the game microservice. |
| **3.3** | [ ]    | Game Loop          | Implement authoritative loop in the game microservice (e.g., 60Hz physics).             |
| **3.4** | [ ]    | State Broadcast    | Game microservice emits state; `backend` broadcasts to relevant WS clients.             |
| **3.5** | [ ]    | Persistence        | Game emits `GameFinishedEvent`. `backend` saves results to Postgres.                    |

---

### Feature 4: User Profiles & Friends

| ID      | Status | Task Name      | Technical Strategy                                                                                   |
| :------ | :----- | :------------- | :--------------------------------------------------------------------------------------------------- |
| **4.1** | [ ]    | Entity Schemas | TypeORM `User` and `Friendship` (join table) in `backend`.                                           |
| **4.2** | [ ]    | Profile API    | REST endpoints for stats and `FileInterceptor` for avatar uploads (saving to the persistent volume). |
| **4.3** | [ ]    | Social Logic   | Friendship service for requests, blocks, and status updates.                                         |
| **4.4** | [ ]    | Profile UI     | `frontend` components for stats, file upload, and social management.                                 |

---

### Feature 5: Real-Time Live Chat

| ID      | Status | Task Name     | Technical Strategy                                                             |
| :------ | :----- | :------------ | :----------------------------------------------------------------------------- |
| **5.1** | [ ]    | Chat Entities | TypeORM `Conversation`, `Participant`, and `Message`.                          |
| **5.2** | [ ]    | WS Registry   | Map `userId` to active `Socket` instances in `backend`.                        |
| **5.3** | [ ]    | Redis Pub/Sub | Use Redis to route messages between different `backend` instances (if scaled). |
| **5.4** | [ ]    | Chat UI       | Real-time chat interface in `frontend` (history via REST, updates via WS).     |

---

### Feature 6: Gamification & Stats

| ID      | Status | Task Name          | Technical Strategy                                                   |
| :------ | :----- | :----------------- | :------------------------------------------------------------------- |
| **6.1** | [ ]    | Stats Logic        | Sequential processing of `GameFinishedEvent` to calculate XP/Levels. |
| **6.2** | [ ]    | Achievements       | Trigger-based badge system (e.g., "First Win", "10 Games Played").   |
| **6.3** | [ ]    | Global Leaderboard | Optimized TypeORM queries for rank aggregation.                      |

---

### Feature 7: Advanced Auth (42 OAuth & 2FA)

| ID      | Status | Task Name          | Technical Strategy                                                  |
| :------ | :----- | :----------------- | :------------------------------------------------------------------ |
| **7.1** | [ ]    | 42 Intra OAuth     | Passport strategy for 42 authentication.                            |

|**OPTIONAL**|
| **7.2** | [ ]    | 2FA Implementation | TOTP via `otplib`; storage of secrets in DB.                        |
| **7.3** | [ ]    | 2FA Auth Flow      | "Pre-auth" token state; 2FA verification endpoint before final JWT. |
