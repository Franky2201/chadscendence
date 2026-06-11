import { Module } from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import { RoomsController } from "./rooms.controller";
import { SessionsModule } from "../sessions/sessions.module";
import { GamesModule } from "../games/games.module";

@Module({
    imports: [SessionsModule, GamesModule],
    controllers: [RoomsController],
    providers: [RoomsService],
    exports: [RoomsService],
})
export class RoomsModule {}
