import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RanksModule } from "./ranks/ranks.module";
import { GamesModule } from "./games/games.module";
import { FriendsModule } from "./friends/friends.module";
import { PresenceModule } from "./presence/presence.module";
import { MessagesModule } from "./messages/messages.module";
import { RoomsModule } from "./rooms/rooms.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: "postgres",
            host: process.env.POSTGRES_HOST || "db",
            port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            autoLoadEntities: true,
            synchronize: true,
            dropSchema: true, // disable if you don't want to lose your data
            retryAttempts: 10,
            retryDelay: 3000,
        }),
        UsersModule,
        AuthModule,
        PresenceModule,
        RanksModule,
        GamesModule,
        FriendsModule,
        MessagesModule,
        RoomsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
