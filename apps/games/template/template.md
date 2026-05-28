# Guide: Creating a Redis Game Microservice

This guide outlines the steps to create a Redis-based microservice within the Chadscendence project.

## 1. Scaffold the Application

```bash
npx nest new apps/games/<service-name> --package-manager npm --strict --skip-git --skip-install
```

## 2. Configure Dependencies

**File:** `apps/games/<service-name>/package.json`

- **Add Dependencies:**
    ```json
    "dependencies": {
      ...
      "@nestjs/microservices": "^11.0.1",
      "ioredis": "^5.5.0"
    }
    ```

## 3. Configure the Microservice (Main Entry)

Set up the app as a hybrid application that listens for Redis messages and HTTP requests.

**File:** `apps/games/<service-name>/src/main.ts`

```typescript
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

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
void bootstrap();
```

## 4. Implement Controllers (Message Handling)

Use `@MessagePattern` for request-response and `@EventPattern` for fire-and-forget events.

**File:** `apps/games/<service-name>/src/game.controller.ts`

```typescript
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload, EventPattern } from "@nestjs/microservices";

@Controller()
export class GameController {
    @MessagePattern({ cmd: "ping" })
    handlePing(@Payload() data: any) {
        return { message: "pong", data };
    }

    @EventPattern("game_event")
    handleEvent(@Payload() data: any) {
        console.log("Received event:", data);
    }
}
```

## 5. Register in Workspace

1. Update root `package.json` "workspaces" if not already covered by `apps/games/*`.
2. Add a dev script to root `package.json`: `"<service-name>:dev": "npm run start:dev -w <service-name>"`.
3. Run `npm install` at root.
