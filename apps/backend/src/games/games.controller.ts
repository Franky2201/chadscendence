import { Controller, Get, Post, Param, Body } from "@nestjs/common";
import { GamesService } from "./games.service";

import { IsString, IsOptional } from "class-validator";

class GameCommandDto {
    @IsString()
    cmd!: string;

    @IsOptional()
    payload?: any;
}

@Controller("games")
export class GamesController {
    constructor(private readonly gamesService: GamesService) {}

    @Get()
    async getGames() {
        return this.gamesService.getActiveGames();
    }

    @Post(":id/command")
    async sendCommand(@Param("id") id: string, @Body() body: GameCommandDto) {
        return this.gamesService.sendCommand(id, body.cmd, body.payload);
    }
}
