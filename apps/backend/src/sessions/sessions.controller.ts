import {
    Controller,
    Post,
    Param,
    Body,
    UseGuards,
    ParseIntPipe,
    Get,
} from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { JwtAuthGuard } from "../common/guards/jwt.guard";
import { GetUser } from "../common/decorators/get-user.decorator";
import type { JwtPayload } from "@chad/types";

@Controller("sessions")
@UseGuards(JwtAuthGuard)
export class SessionsController {
    constructor(private readonly sessionsService: SessionsService) {}

    @Get(":code")
    getSession(@Param("code") code: string) {
        return this.sessionsService.getSessionOrThrow(code);
    }

    @Post(":code/rounds/:roundIndex/answer")
    submitRoundAnswer(
        @GetUser() user: JwtPayload,
        @Param("code") code: string,
        @Param("roundIndex", ParseIntPipe) roundIndex: number,
        @Body() body: { answer: unknown },
    ) {
        return this.sessionsService.submitRoundAnswer(
            code,
            user.sub,
            roundIndex,
            body.answer,
        );
    }

    @Post(":code/rounds/close")
    closeCurrentRound(@Param("code") code: string) {
        return this.sessionsService.closeCurrentRoundManual(code);
    }

    @Post(":code/finish")
    finishGame(@Param("code") code: string) {
        return this.sessionsService.finishGame(code);
    }
}
