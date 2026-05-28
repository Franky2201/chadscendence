# Guide: Creating a Redis Game Microservice

This guide outlines the complete process for adding a new game to the Chadscendence platform.

## 0. Define Shared Types

Add your game-specific interfaces to the shared library to ensure type safety across the monorepo.

**File:** `libs/types/src/game.ts` (or create a new file in `libs/types/src/`)

```typescript
export interface MyGameCommandPayload { ... }
export interface MyGameResponse { ... }
```

## 1. Scaffold the Microservice

Create a new NestJS application in the `apps/games/` directory.

```bash
npx nest new apps/games/<service-name> --package-manager npm --strict --skip-git --skip-install
```

## 2. Configure Dependencies

Update the microservice's `package.json` to include microservices support and Redis.

**File:** `apps/games/<service-name>/package.json`

```json
"dependencies": {
  "@chad/types": "*",
  "@nestjs/microservices": "^11.0.1",
  "ioredis": "^5.5.0",
  ...
}
```

## 3. Microservice Infrastructure

### A. Hybrid Server Setup

Configure the microservice to listen for Redis messages and HTTP requests.

**File:** `apps/games/<service-name>/src/main.ts`

```typescript
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.REDIS,
        options: {
            host: process.env.REDIS_HOST ?? "localhost",
            port: parseInt(process.env.REDIS_PORT ?? "6379", 10),
        },
    });
    await app.startAllMicroservices();
    await app.listen(process.env.PORT ?? 3001);
}
```

### B. Self-Registration

The game must register itself in the Redis registry upon startup so the Backend can discover it.

**File:** `apps/games/<service-name>/src/app.module.ts`

```typescript
@Module({ ... })
export class AppModule implements OnApplicationBootstrap, OnApplicationShutdown {
    constructor(private readonly redisService: RedisService) {}

    async onApplicationBootstrap() {
        const gameData = { id: "template-id", name: "GAME_NAME", ... };
        await this.redisService.getClient().hset("games:registry", "template-id", JSON.stringify(gameData));
    }

    async onApplicationShutdown() {
        await this.redisService.getClient().hdel("games:registry", "template-id");
    }
}
```

## 4. Implement Game Logic

Handle commands from the API Gateway using `@MessagePattern`.

**File:** `apps/games/<service-name>/src/game.controller.ts`

```typescript
@Controller()
export class GameController {
    @MessagePattern({ cmd: "start_game" })
    handleStart(@Payload() data: any) {
        return { status: "started" };
    }
}
```

## 5. Testing

Unit tests are located in the `test/` directory.

**File:** `apps/games/<service-name>/test/game.controller.spec.ts`

```typescript
describe("GameController", () => {
    it("should handle start_game command", () => {
        // ... test logic
    });
});
```

Run tests using:

```bash
npm test -w <service-name>
```

## 6. Backend Integration (API Gateway)

### A. Register Client

Add the new microservice as a client in the main backend.

**File:** `apps/backend/src/games/games.module.ts`

```typescript
ClientsModule.registerAsync([
    {
        name: "MY_GAME_SERVICE",
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config) => ({
            transport: Transport.REDIS,
            options: {
                host: config.get("REDIS_HOST"),
                port: config.get("REDIS_PORT"),
            },
        }),
    },
]);
```

### B. Route Commands

Update the `sendCommand` method to handle the new game ID.

**File:** `apps/backend/src/games/games.service.ts`

```typescript
async sendCommand(gameId: string, cmd: string, payload: any) {
    if (gameId === "template-id") {
        return firstValueFrom(this.myGameClient.send({ cmd }, payload));
    }
    ...
}
```

## 7. Frontend Integration

### A. Create UI Component

Create a dedicated component for your game.

**File:** `apps/frontend/src/components/games/MyGameUI.tsx`

```typescript
import { sendGameCommand } from "../../services/games";
// Implement game UI and call sendGameCommand("template-id", "cmd", payload)
```

### B. Register in Games Page

Add the game to the renderer switcher.

**File:** `apps/frontend/src/pages/Games.tsx`

```typescript
const renderActiveGame = () => {
    switch (activeGameId) {
        case "template-id": return <MyGameUI />;
        ...
    }
};
```

## 8. Dockerization

### A. Dockerfile

Create a `Dockerfile` in your microservice directory (copy from `apps/games/template/Dockerfile` and update names).

### B. Docker Compose

Add your service to the games orchestration.

**File:** `apps/games/docker-compose.yml`

```yaml
template-id:
  build:
    context: ../../
    dockerfile: apps/games/template-id/Dockerfile
  environment:
    - PORT=3002
    - REDIS_HOST=redis
  ...
```

## 9. Workspace Scripts

Add a shortcut to the root `package.json`.

```json
"scripts": {
  "template-id:dev": "npm run start:dev -w template-id"
}
```
