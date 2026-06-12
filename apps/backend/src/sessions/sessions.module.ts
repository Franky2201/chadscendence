import { Module } from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { SessionsController } from "./sessions.controller";
import { GamesModule } from "../games/games.module";
import { UsersModule } from "../users/users.module";
import { RatingModule } from "src/rating/rating.module";

@Module({
    imports: [GamesModule, UsersModule, RatingModule],
    controllers: [SessionsController],
    providers: [SessionsService],
    exports: [SessionsService],
})
export class SessionsModule {}
