# Game Microservice Template (Redis)

This is a template for creating new game microservices for the Chadscendence project using Redis transport.

## Features

- **NestJS Microservice**: Configured to use `Transport.REDIS` for inter-service communication.
- **Hybrid App**: Supports both Redis messaging and HTTP (for health checks).
- **Event-Driven**: Includes examples for Request-Response (`@MessagePattern`) and Event-based (`@EventPattern`) communication.

## Getting Started

1.  Copy this directory to a new folder in `apps/games/`.
2.  Update the `name` in `package.json`.
3.  Ensure `REDIS_HOST` and `REDIS_PORT` are set in your environment (defaults to `localhost:6379`).
4.  Run `npm install` at the root.

## Communication API

The service listens for Redis messages.

### Request-Response

- **Pattern**: `{ cmd: 'ping' }`
- **Response**: Returns a pong message with a timestamp.

### Events

- **Pattern**: `game_started`
- **Payload**: Any game data.
- **Action**: Logs the event to the console.

## REST API (Health Check)

- **GET /**: Returns "Hello World!".
- **GET /info**: Returns service information.
