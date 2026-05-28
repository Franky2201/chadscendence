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

    constructor(private readonly _redisService: RedisService) {}

    async onApplicationBootstrap() {
        const gameData: Game = {
            id: "game-template",
            name: "GAME_NAME",
            description: "C'est du calcul mental frangin",
            port: Number(process.env.PORT ?? 3001),
        };
        await this._redisService
            .getClient()
            .hset("games:registry", "game-template", JSON.stringify(gameData));
        this.logger.log("Game registered in Redis as 'game-template'");
    }

    async onApplicationShutdown() {
        await this._redisService
            .getClient()
            .hdel("games:registry", "game-template");
        this.logger.log("Game deregistered from Redis");
    }
}
