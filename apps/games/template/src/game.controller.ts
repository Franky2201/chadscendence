import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AppService } from "./app.service";
import { RedisService } from "./redis.service";

@Controller()
export class GameController {
    constructor(
        private readonly appService: AppService,
        private readonly redisService: RedisService,
    ) {}

    @MessagePattern({ cmd: "ping" })
    handlePing(@Payload() data: Record<string, unknown>) {
        return {
            message: "Hello from Game Template (Redis)",
            received: data,
            timestamp: new Date().toISOString(),
        };
    }
}
