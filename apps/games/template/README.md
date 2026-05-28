# GAME_NAME Game Microservice (Redis)

This is the GAME_NAME Game microservice for the Chadscendence project. It handles random game-template problem generation and validation.

## Features

- **NestJS Microservice**: Configured to use `Transport.REDIS` for inter-service communication.
- **Stateless Validation**: Uses Redis to store answers temporarily for secure validation.
- **Hybrid App**: Supports both Redis messaging and HTTP (for health checks).

## Communication API

The service listens for Redis messages.

### Request-Response

#### `{ cmd: 'ping' }`

- **Response**: Returns a greeting message with a timestamp.

#### `{ cmd: 'get_problem' }`

- **Response**: `{ id: string, problem: string }`
- **Logic**: Generates a random game-template problem and stores the answer in Redis for 60 seconds.

#### `{ cmd: 'submit_answer' }`

- **Payload**: `{ id: string, answer: number }`
- **Response**: `{ success: boolean, correctAnswer?: number }`
- **Logic**: Validates the provided answer against the stored Redis value.

## REST API (Health Check)

- **GET /**: Returns "Hello World!".
- **GET /info**: Returns service information.
