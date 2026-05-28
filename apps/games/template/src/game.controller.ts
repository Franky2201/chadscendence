import { Controller } from "@nestjs/common";
import { MessagePattern, Payload, EventPattern } from "@nestjs/microservices";

@Controller()
export class GameController {
    @MessagePattern({ cmd: "ping" })
    handlePing(@Payload() data: Record<string, unknown>) {
        return {
            message: "Pong from Game Template (Redis)",
            received: data,
            timestamp: new Date().toISOString(),
        };
    }

    @EventPattern("game_started")
    handleGameStarted(@Payload() data: any) {
        console.log("Game started event received:", data);
    }
}
