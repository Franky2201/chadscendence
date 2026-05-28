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

    constructor(private readonly redisService: RedisService) {}

    async onApplicationBootstrap() {
        const gameData: Game = {
            id: "math",
            name: "Math",
            description: "C'est du calcul mental frangin",
            port: Number(process.env.PORT ?? 3001),
        };
        await this.redisService
            .getClient()
            .hset("games:registry", "math", JSON.stringify(gameData));
        this.logger.log("Game registered in Redis as 'math'");
    }

    async onApplicationShutdown() {
        await this.redisService.getClient().hdel("games:registry", "math");
        this.logger.log("Game deregistered from Redis");
    }
}
