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
import { CreateRoomDto, UpdateRoomGamesDto } from "./rooms.dto";

@Controller("rooms")
@UseGuards(JwtAuthGuard)
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) { }

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

    @Delete(":code/leave")
    leaveRoom(@GetUser() user: JwtPayload, @Param("code") code: string) {
        return this.roomsService.leaveRoom(code, user.sub);
    }
}
