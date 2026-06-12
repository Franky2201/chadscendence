# Reaction Time Microservice (Redis)

This is the Reaction Time microservice for the Chadscendence project.

## Features

- **NestJS Microservice**: Configured to use `Transport.REDIS` for inter-service communication.
- **Hybrid App**: Supports both Redis messaging and HTTP (for health checks).

## Communication API

The service listens for Redis messages.

### Request-Response

#### `{ cmd: 'ping' }`

- **Response**: Returns a greeting message with a timestamp.

## REST API (Health Check)

- **GET /**: Returns "Hello World!".
- **GET /info**: Returns service information.
