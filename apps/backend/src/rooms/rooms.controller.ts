import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt.guard";
import { GetUser } from "../common/decorators/get-user.decorator";
import type { JwtPayload } from "../auth/auth.dto";
import { RoomsService } from "./rooms.service";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomGamesDto } from "./dto/update-room-games.dto";
import { LaunchRoomDto } from "./dto/launch-room.dto";

@Controller("rooms")
@UseGuards(JwtAuthGuard)
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) {}

    @Post()
    createRoom(
        @GetUser() user: JwtPayload,
        @Body() createRoomDto: CreateRoomDto,
    ) {
        return this.roomsService.createRoom(
            user,
            createRoomDto.selectedGames ?? [],
        );
    }

    @Get(":code")
    getRoom(@Param("code") code: string) {
        // this.roomsService.pruneInactivePlayers(code);
        return this.roomsService.getRoom(code);
    }

    @Post(":code/join")
    joinRoom(@GetUser() user: JwtPayload, @Param("code") code: string) {
        return this.roomsService.joinRoom(code, user);
    }

    @Patch(":code/games")
    updateSelectedGames(
        @GetUser() user: JwtPayload,
        @Param("code") code: string,
        @Body() updateRoomGamesDto: UpdateRoomGamesDto,
    ) {
        return this.roomsService.updateSelectedGames(
            code,
            user.sub,
            updateRoomGamesDto.selectedGames,
        );
    }

    @Post(":code/launch")
    launchRoom(
        @GetUser() user: JwtPayload,
        @Param("code") code: string,
        @Body() launchRoomDto: LaunchRoomDto,
    ) {
        return this.roomsService.launchRoom(
            code,
            user.sub,
            launchRoomDto.selectedGames,
            launchRoomDto.repetitions,
        );
    }

    @Post(":code/reset")
    resetRoom(@GetUser() user: JwtPayload, @Param("code") code: string) {
        return this.roomsService.resetRoom(code, user.sub);
    }

    @Delete(":code/leave")
    leaveRoom(@GetUser() user: JwtPayload, @Param("code") code: string) {
        return this.roomsService.leaveRoom(code, user.sub);
    }

    // @Post(":code/heartbeat")
    // heartBeat(@GetUser() user: JwtPayload, @Param("code") code: string) {
    //     return this.roomsService.heartbeat(code, user.sub)
    // }
}
