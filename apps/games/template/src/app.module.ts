import {
    Module,
    OnApplicationBootstrap,
    OnApplicationShutdown,
    Logger,
} from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { GameController } from "./game.controller";
import Redis from "ioredis";
import { Game } from "@chad/types";

@Module({
    imports: [],
    controllers: [AppController, GameController],
    providers: [AppService],
})
export class AppModule
    implements OnApplicationBootstrap, OnApplicationShutdown
{
    private readonly logger = new Logger(AppModule.name);
    private redis: Redis;

    constructor() {
        this.redis = new Redis({
            host: process.env.REDIS_HOST ?? "localhost",
            port: parseInt(process.env.REDIS_PORT ?? "6379", 10),
        });
    }

    async onApplicationBootstrap() {
        const gameData: Game = {
            id: "template",
            name: "Math",
            description: "C'est du calcul mental frangin",
            port: Number(process.env.PORT ?? 3001),
        };
        await this.redis.hset(
            "games:registry",
            "template",
            JSON.stringify(gameData),
        );
        this.logger.log("Game registered in Redis");
    }

    async onApplicationShutdown() {
        await this.redis.hdel("games:registry", "template");
        this.logger.log("Game deregistered from Redis");
        await this.redis.quit();
    }
}
