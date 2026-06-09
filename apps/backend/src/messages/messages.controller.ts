import {
    Controller,
    Get,
    Post,
    Patch,
    Param,
    Query,
    Body,
    UseGuards,
} from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { JwtAuthGuard } from "../common/guards/jwt.guard";
import { CreateMessageDto } from "./messages.dto";
import { GetUser } from "src/common/decorators/get-user.decorator";
import type { JwtPayload, Message, UnreadCountsResponse } from "@chad/types";

@Controller("messages")
@UseGuards(JwtAuthGuard)
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @Get("unread-counts")
    getUnreadCounts(
        @GetUser() user: JwtPayload,
    ): Promise<UnreadCountsResponse> {
        return this.messagesService.getUnreadCounts(user.sub);
    }

    @Get(":friendId")
    getConversation(
        @GetUser() user: JwtPayload,
        @Param("friendId") friendId: string,
        @Query("page") page: string,
    ): Promise<Message[]> {
        const pageNumber = page ? parseInt(page, 10) : 1;
        return this.messagesService.getConversation(
            user.sub,
            friendId,
            pageNumber,
        );
    }

    @Post(":friendId")
    sendMessage(
        @GetUser() user: JwtPayload,
        @Param("friendId") friendId: string,
        @Body() createMessageDto: CreateMessageDto,
    ): Promise<Message> {
        return this.messagesService.sendMessage(
            user.sub,
            friendId,
            createMessageDto.content,
        );
    }

    @Patch(":friendId/read")
    markAsRead(
        @GetUser() user: JwtPayload,
        @Param("friendId") friendId: string,
    ): Promise<void> {
        return this.messagesService.markAsRead(user.sub, friendId);
    }
}
