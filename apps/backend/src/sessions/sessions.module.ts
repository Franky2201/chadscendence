import { Module } from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { SessionsController } from "./sessions.controller";
import { GamesModule } from "../games/games.module";
import { UsersModule } from "../users/users.module";
import { RatingModule } from "src/rating/rating.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GameAnalytics } from "../users/analytics.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([GameAnalytics]),
        GamesModule,
        UsersModule,
        RatingModule,
    ],
    controllers: [SessionsController],
    providers: [SessionsService],
    exports: [SessionsService],
})
export class SessionsModule {}
