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
            message: "Hello from Template Game (Redis)",
            received: data,
            timestamp: new Date().toISOString(),
        };
    }

    @MessagePattern({ cmd: "get_problem" })
    handleGetProblem() {
        return {
            question: "CLICK THE BUTTON",
        };
    }

    @MessagePattern({ cmd: "submit_answer" })
    handleSubmitAnswer(@Payload() data: Record<string, unknown>) {
        return {
            success: true,
            message: "Hello from your game microservice!",
            received: data,
        };
    }
}
