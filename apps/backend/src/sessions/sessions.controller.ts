import {
    Controller,
    Get,
    Post,
    Param,
    Body,
    UseGuards,
    ParseIntPipe,
} from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { CreateSessionDto } from "./sessions.dto";
import { JwtAuthGuard } from "../common/guards/jwt.guard";
import { GetUser } from "../common/decorators/get-user.decorator";
import type { JwtPayload } from "@chad/types";

@Controller("sessions")
@UseGuards(JwtAuthGuard)
export class SessionsController {
    constructor(private readonly sessionsService: SessionsService) {}

    @Post()
    createSession(@GetUser() user: JwtPayload, @Body() body: CreateSessionDto) {
        return this.sessionsService.createSession(
            user.sub,
            body.selectedGames,
            body.repetitions,
        );
    }

    @Get(":id")
    getSession(@Param("id") id: string, @GetUser() user: JwtPayload) {
        return this.sessionsService.getSessionOrThrow(id, user.sub);
    }

    @Post(":id/rounds/:roundIndex/start")
    startRound(
        @Param("id") id: string,
        @Param("roundIndex", ParseIntPipe) roundIndex: number,
        @GetUser() user: JwtPayload,
    ) {
        return this.sessionsService.startRound(id, user.sub, roundIndex);
    }

    @Post(":id/rounds/:roundIndex/answer")
    submitRoundAnswer(
        @Param("id") id: string,
        @Param("roundIndex", ParseIntPipe) roundIndex: number,
        @GetUser() user: JwtPayload,
        @Body() body: { answer: unknown },
    ) {
        return this.sessionsService.submitRoundAnswer(
            id,
            user.sub,
            roundIndex,
            body.answer,
        );
    }

    @Post(":id/rounds/:roundIndex/close")
    closeRound(
        @Param("id") id: string,
        @Param("roundIndex", ParseIntPipe) roundIndex: number,
        @GetUser() user: JwtPayload,
    ) {
        return this.sessionsService.closeRound(id, user.sub, roundIndex);
    }

    @Post(":id/finish")
    finishGame(@Param("id") id: string, @GetUser() user: JwtPayload) {
        return this.sessionsService.finishGame(id, user.sub);
    }
}
