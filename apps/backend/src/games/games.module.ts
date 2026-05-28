import { Module } from "@nestjs/common";
import { GamesController } from "./games.controller";
import { GamesService } from "./games.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: "MATH_SERVICE",
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.REDIS,
                    options: {
                        host: configService.get<string>(
                            "REDIS_HOST",
                            "localhost",
                        ),
                        port: configService.get<number>("REDIS_PORT", 6379),
                    },
                }),
            },
        ]),
    ],
    controllers: [GamesController],
    providers: [GamesService],
    exports: [GamesService],
})
export class GamesModule {}
