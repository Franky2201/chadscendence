import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { Game } from '@chad/types';

@Injectable()
export class GamesService implements OnModuleInit, OnModuleDestroy {
  private redis: Redis;

  onModuleInit() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST ?? 'localhost',
      port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    });
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }

  async getActiveGames(): Promise<Game[]> {
    const rawGames = await this.redis.hgetall('games:registry');
    return Object.values(rawGames).map((gameStr): Game => {
      const parsed: unknown = JSON.parse(gameStr);
      return parsed as Game;
    });
  }
}
