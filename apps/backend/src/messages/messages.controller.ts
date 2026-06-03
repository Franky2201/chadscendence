import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    UseGuards,
    Patch,
} from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { JwtAuthGuard } from "../common/guards/jwt.guard";
import { CreateMessageDto } from "../common/dto/messages.dto";
import { GetUser } from "src/common/decorators/get-user.decorator";
import * as types from "@chad/types";

@Controller("messages")
@UseGuards(JwtAuthGuard)
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @Get(":friendId")
    getConversation(
        @GetUser() user: types.JwtPayload,
        @Param("friendId") friendId: string,
        @Query("page") page: string,
    ) {
        const pageNumber = page ? parseInt(page, 10) : 1;
        return this.messagesService.getConversation(
            user.sub,
            friendId,
            pageNumber,
        );
    }

    @Post(":friendId")
    sendMessage(
        @GetUser() user: types.JwtPayload,
        @Param("friendId") friendId: string,
        @Body() createMessageDto: CreateMessageDto,
    ) {
        return this.messagesService.sendMessage(
            user.sub,
            friendId,
            createMessageDto.content,
        );
    }

    @Patch(":friendId/read")
    markAsRead(
        @GetUser() user: types.JwtPayload,
        @Param("friendId") friendId: string,
    ) {
        return this.messagesService.markAsRead(user.sub, friendId);
    }
}
