import {
    Module,
    OnApplicationBootstrap,
    OnApplicationShutdown,
    Logger,
} from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { GameController } from "./game.controller";
import { RedisService } from "./redis.service";
import { Game } from "@chad/types";

@Module({
    imports: [],
    controllers: [AppController, GameController],
    providers: [AppService, RedisService],
})
export class AppModule
    implements OnApplicationBootstrap, OnApplicationShutdown
{
    private readonly logger = new Logger(AppModule.name);
    private heartbeatInterval?: NodeJS.Timeout;
    private gameId = "__GAME_ID__";

    constructor(private readonly _redisService: RedisService) {}

    async onApplicationBootstrap() {
        const gameData: Game = {
            id: this.gameId,
            name: "__GAME_NAME__",
            description: "Game automatically generated",
            port: Number(process.env.PORT ?? 3000),
        };

        const register = async () => {
            await this._redisService
                .getClient()
                .set(
                    `games:active:${this.gameId}`,
                    JSON.stringify(gameData),
                    "EX",
                    15,
                );
        };

        // Initial registration
        await register();

        // Heartbeat every 5 seconds
        this.heartbeatInterval = setInterval(() => {
            void register();
        }, 5000);

        this.logger.log(
            `Game registered in Redis with heartbeat (15s TTL): ${this.gameId}`,
        );
    }

    async onApplicationShutdown() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        await this._redisService.getClient().del(`games:active:${this.gameId}`);
        this.logger.log(`Game deregistered from Redis: ${this.gameId}`);
    }
}
