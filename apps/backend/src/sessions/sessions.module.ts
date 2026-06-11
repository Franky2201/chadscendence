import { Module } from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { SessionsController } from "./sessions.controller";
import { GamesModule } from "../games/games.module";
import { UsersModule } from "../users/users.module";
import { RoomsGateway } from "../rooms/rooms.gateway";

@Module({
    imports: [GamesModule, UsersModule],
    controllers: [SessionsController],
    providers: [SessionsService, RoomsGateway],
    exports: [SessionsService],
})
export class SessionsModule {}
