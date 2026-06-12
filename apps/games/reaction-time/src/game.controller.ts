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

    @MessagePattern({ game: "reaction-time", cmd: "ping" })
    handlePing(@Payload() data: Record<string, unknown>) {
        return {
            message: "Hello from Reaction Time Game (Redis)",
            received: data,
            timestamp: new Date().toISOString(),
        };
    }

    @MessagePattern({ game: "reaction-time", cmd: "get_problem" })
    async handleGetProblem() {
        const { id, delay } = this.appService.generateProblem();
        await this.redisService
            .getClient()
            .set(`reaction-time:session:${id}`, "1", "EX", 30);
        return { id, delay };
    }

    @MessagePattern({ game: "reaction-time", cmd: "submit_answer" })
    async handleSubmitAnswer(
        @Payload()
        data: {
            id: string;
            reactionTime: number;
            tooEarly: boolean;
        },
    ) {
        const exists = await this.redisService
            .getClient()
            .get(`reaction-time:session:${data.id}`);

        if (!exists) {
            return { success: false, message: "Session expirée, recommence !" };
        }

        await this.redisService
            .getClient()
            .del(`reaction-time:session:${data.id}`);

        if (data.tooEarly) {
            return {
                success: false,
                message: "Hep hep hep faux départ! Attends le signal 🔴",
            };
        }

        if (data.reactionTime < 50 || data.reactionTime > 2000) {
            return { success: false, message: "Temps invalide" };
        }

        const { rating, message } = this.appService.getRating(
            data.reactionTime,
        );
        return {
            success: true,
            reactionTime: data.reactionTime,
            rating,
            message,
        };
    }
}
