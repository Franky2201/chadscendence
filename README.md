# Transcendence: Mini-Game Hub Project Plan

**Tech Stack:** React (TypeScript, Vite, Tailwind), NestJS (Node.js/TypeScript), PostgreSQL, Docker.
**Architecture:** Monolithic Core (API Gateway/Auth/State) with gRPC Game Microservices and Event-Driven WebSockets (Socket.io).
**Goal:** Exceed the 14-point mandatory minimum.

---

### Feature 1: Core Infrastructure & WebSocket Handshake
*Focus: Establishing the Docker environment and secure, stateless WS connections.*

| Status | ID | Task Name | Technical Strategy | Est. Time | Risk | Peer Review? |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | **1.1** | Containerize Core DB & Backend | Create Docker Compose setting up PostgreSQL and an empty NestJS container. | 2 hrs | Low | Yes |
| [ ] | **1.2** | Implement JWT Authentication | Configure `@nestjs/passport` and `passport-jwt` to handle registration, login, and issue JWTs. | 4 hrs | Medium | Yes |
| [ ] | **1.3** | Frontend Auth Flow | Build React form (Vite/Tailwind) to capture credentials, send to API, and store the JWT. | 3 hrs | Low | No |
| [ ] | **1.4** | NestJS WebSocket Gateway | Setup `@WebSocketGateway()`. Implement `WsException` filters and middleware to validate JWTs on connection. | 3 hrs | Medium | Yes |
| [ ] | **1.5** | Frontend WS Connection | Connect React client using `socket.io-client` with the JWT in the auth payload and emit a "hello" event. | 2 hrs | Low | No |
| [ ] | **1.6** | Message Broker Setup | Deploy Redis via Docker. Configure `@nestjs/microservices` with the Redis transporter for inter-service messaging. | 3 hrs | Medium | Yes |

---

### Feature 2: The Jam Lobby & Matchmaking
*Focus: Concurrent session management and sequential matchmaking queue.*

| Status | ID | Task Name | Technical Strategy | Est. Time | Risk | Peer Review? |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | **2.1** | Define Lobby Interfaces | Create `JamLobby` and `Player` Types/Interfaces. Use an in-memory `Map<string, JamLobby>` or Redis cache for state. | 2 hrs | Low | Yes |
| [ ] | **2.2** | Matchmaking Service | Implement `joinJam(User)` utilizing Redis Pub/Sub or bullmq to ensure sequential processing of the queue. | 3 hrs | Medium | Yes |
| [ ] | **2.3** | WS Lobby Gateway | Create `@SubscribeMessage('join_request')`. Use Socket.io rooms to broadcast updated player lists to specific lobbies. | 3 hrs | Low | Yes |
| [ ] | **2.4** | Countdown & Handoff | Add logic to check if lobby is full. Trigger RxJS `interval` for a 3-sec countdown broadcast, send start signal via gRPC. | 3 hrs | Medium | Yes |
| [ ] | **2.5** | Frontend Lobby UI | Build React view to "Join Jam", render real-time avatar list, and display countdown animation. | 4 hrs | Low | No |

---

### Feature 3: The Game Microservice & Real-Time Sync
*Focus: Fast gRPC communication and async timing logic for stateless game containers.*

| Status | ID | Task Name | Technical Strategy | Est. Time | Risk | Peer Review? |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | **3.1** | Define Protobuf Schemas | Write `.proto` files defining gRPC services (`StartGame`, `SubmitAnswer`, `GameFeedback`). Generate TS interfaces using `ts-proto`. | 2 hrs | Low | Yes |
| [ ] | **3.2** | Microservice gRPC Server | Set up target NestJS microservice using `Transport.GRPC` to implement the interface and handle validation. | 3 hrs | Medium | Yes |
| [ ] | **3.3** | Core gRPC Client | Configure `@Client({ transport: Transport.GRPC })` in the monolithic core to communicate with the game microservice. | 2 hrs | Low | Yes |
| [ ] | **3.4** | Core Game Timer Logic | **[SPIKE]** Research & implement async timing (`@nestjs/schedule` or RxJS timers) to manage game tick rates and answer windows. | 4 hrs | High | Yes |
| [ ] | **3.5** | Real-Time Answer Routing | Wire WS Gateway to pass answers to gRPC client service, await validation, and emit feedback back to the Socket.io room. | 3 hrs | Medium | Yes |
| [ ] | **3.6** | Final Score & DB Persistence | Aggregate final state on timer end, calculate results, and save using TypeORM/Prisma repositories. | 3 hrs | Low | Yes |

---

### Feature 4: User Profiles & Friends System
*Focus: Relational data integrity, secure querying, and RESTful CRUD operations.*

| Status | ID | Task Name | Technical Strategy | Est. Time | Risk | Peer Review? |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | **4.1** | Define Entity Schemas | Create TypeORM `@Entity` schemas for `User` and `Friendship`. Map enums for status and handle avatar paths. | 2 hrs | Low | Yes |
| [ ] | **4.2** | Profile REST API | Implement `@Controller('users')` with GET/PUT methods for fetching stats and updating profile/avatar data. | 3 hrs | Low | No |
| [ ] | **4.3** | Friendship Service Logic | Write core logic for requests, accepting, blocking (using TypeORM QueryBuilder to filter blocked relations). | 3 hrs | Medium | Yes |
| [ ] | **4.4** | Friendship REST API | Expose `@Controller('friends')` to list friends, view pending requests, and patch status changes. | 2 hrs | Low | Yes |
| [ ] | **4.5** | Frontend Profile View | Build React UI to display user info, game stats, and file upload input (multipart/form-data) for the avatar. | 3 hrs | Low | No |
| [ ] | **4.6** | Frontend Social Actions | Implement friends list UI; add buttons to send/accept requests or block users. | 4 hrs | Medium | No |

---

### Feature 5: Real-Time Live Chat
*Focus: Multi-session WebSocket dispatching and persistent message storage.*

| Status | ID | Task Name | Technical Strategy | Est. Time | Risk | Peer Review? |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | **5.1** | Define Chat Entities | Create TypeORM entities for `Conversation`, `Participant`, and `Message` (fixed schema). | 2 hrs | Low | Yes |
| [ ] | **5.2** | Message REST API | Implement `@Get` endpoints to fetch conversation lists and paginate historical messages. | 2 hrs | Low | No |
| [ ] | **5.3** | WS Multi-Tab Sync | Integrate `@socket.io/redis-adapter` so multi-tab broadcasting is handled automatically across instances. | 2 hrs | Medium | Yes |
| [ ] | **5.4** | Message Persistence | Gateway `@SubscribeMessage('chat')` saves payload to DB via TypeORM service, then emits. | 3 hrs | Medium | Yes |
| [ ] | **5.5** | Real-Time Dispatcher | Have users join a Socket room equal to their `user_id`. Emit messages directly to `server.to(recipient_id)`. | 3 hrs | High | Yes |
| [ ] | **5.6** | Frontend Chat UI | Build React interface for chat box, rendering history via REST and appending live payload via Socket events. | 4 hrs | Low | No |

---

### Feature 6: Gamification & Stats (Core Integration)
*Focus: Event-driven updates within the monolith to prevent race conditions.*

| Status | ID | Task Name | Technical Strategy | Est. Time | Risk | Peer Review? |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | **6.1** | Define Stats & Achievements | Create entities for `UserStats` (XP, level) and `Achievement` linked to the core `User` entity. | 2 hrs | Low | Yes |
| [ ] | **6.2** | Event-Driven Logic | Use `@nestjs/event-emitter` to listen for 'match.ended' events. Calculate XP, trigger level-ups, unlock achievements async. | 3 hrs | Medium | Yes |
| [ ] | **6.3** | Stats API Endpoints | Implement REST GET endpoints for `/leaderboard` and `/users/:id/stats`. | 2 hrs | Low | No |
| [ ] | **6.4** | Frontend Gamification UI | Build React components for XP progress bars, badge gallery, and a sortable global leaderboard. | 4 hrs | Low | No |

---

### Feature 7: Advanced Authentication (OAuth & 2FA)
*Focus: Multi-step login flows and stateful pre-authentication tokens.*

| Status | ID | Task Name | Technical Strategy | Est. Time | Risk | Peer Review? |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | **7.1** | OAuth2 Client Integration | Configure `passport-42` strategy for the Intra OAuth2 flow (handling callbacks and user hydration). | 3 hrs | Medium | Yes |
| [ ] | **7.2** | 2FA Secret Generation | Implement service using `otplib` to generate secure TOTP secret, save to DB, and `qrcode` to generate URI. | 3 hrs | Low | No |
| [ ] | **7.3** | The Partial Auth State | Intercept login. If 2FA enabled, issue a temporary JWT with `{ isTwoFactorAuthenticated: false }`. Guard main routes against this state. | 3 hrs | High | Yes |
| [ ] | **7.4** | TOTP Verification API | Build endpoint accepting 6-digit code. Validate via `otplib`. If valid, issue full access JWT. | 3 hrs | Medium | Yes |
| [ ] | **7.5** | Frontend OAuth & 2FA UI | Add "Login with 42" button, 2FA code entry screen, and profile section to setup 2FA via QR code. | 4 hrs | Low | No |
