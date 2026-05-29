import {
    Injectable,
    OnModuleInit,
    OnModuleDestroy,
    Inject,
} from "@nestjs/common";
import Redis from "ioredis";
import { Game } from "@chad/types";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GamesService implements OnModuleInit, OnModuleDestroy {
    private redis: Redis;

    constructor(
        @Inject("GAMES_CLIENT") private readonly gamesClient: ClientProxy,
        private readonly configService: ConfigService,
    ) {}

    onModuleInit() {
        this.redis = new Redis({
            host: this.configService.get<string>("REDIS_HOST", "localhost"),
            port: this.configService.get<number>("REDIS_PORT", 6379),
        });
    }

    async onModuleDestroy() {
        await this.redis.quit();
    }

    async getActiveGames(): Promise<Game[]> {
        const keys = await this.redis.keys("games:active:*");
        if (keys.length === 0) return [];

        const rawGames = await this.redis.mget(...keys);
        return rawGames
            .filter((gameStr): gameStr is string => gameStr !== null)
            .map((gameStr): Game => {
                const parsed: unknown = JSON.parse(gameStr);
                return parsed as Game;
            });
    }

    async sendCommand<T = unknown, R = unknown>(
        gameId: string,
        cmd: string,
        payload?: T,
    ): Promise<R> {
        return firstValueFrom(
            this.gamesClient.send<R, T>(
                { game: gameId, cmd },
                payload ?? ({} as T),
            ),
        );
    }
}
