import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AppService } from "./app.service";
import { RedisService } from "./redis.service";
import { randomUUID } from "node:crypto";

@Controller()
export class GameController {
    constructor(
        private readonly appService: AppService,
        private readonly redisService: RedisService,
    ) {}

    @MessagePattern({ game: "math", cmd: "get_problem" })
    async handleGetProblem() {
        const { problem, answer } = this.appService.generateProblem();
        const id = randomUUID();

        // Store answer in Redis for 60 seconds
        await this.redisService
            .getClient()
            .set(`math:answer:${id}`, answer, "EX", 60);

        return {
            id,
            problem,
        };
    }

    @MessagePattern({ game: "math", cmd: "submit_answer" })
    async handleSubmitAnswer(@Payload() data: { id: string; answer: number }) {
        const storedAnswer = await this.redisService
            .getClient()
            .get(`math:answer:${data.id}`);

        if (storedAnswer === null) {
            return {
                success: false,
                message: "Problem expired or not found",
            };
        }

        const isCorrect = parseInt(storedAnswer, 10) === data.answer;

        if (isCorrect) {
            await this.redisService.getClient().del(`math:answer:${data.id}`);
        }

        return {
            success: isCorrect,
            correctAnswer: isCorrect ? undefined : parseInt(storedAnswer, 10),
        };
    }

    @MessagePattern({ game: "math", cmd: "ping" })
    handlePing(@Payload() data: Record<string, unknown>) {
        return {
            message: "Hello from Math Game (Redis)",
            received: data,
            timestamp: new Date().toISOString(),
        };
    }
}
