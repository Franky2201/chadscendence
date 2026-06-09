import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    UseGuards,
} from "@nestjs/common";
import { FriendsService } from "./friends.service";
import { JwtAuthGuard } from "../common/guards/jwt.guard";
import { GetUser } from "../common/decorators/get-user.decorator";
import type {
    JwtPayload,
    Friend,
    FriendRequest,
    SentRequest,
    MessageResponse,
} from "@chad/types";

@Controller("friends")
@UseGuards(JwtAuthGuard)
export class FriendsController {
    constructor(private readonly friendsService: FriendsService) {}

    @Get()
    getFriends(@GetUser() payload: JwtPayload): Promise<Friend[]> {
        return this.friendsService.getFriends(payload.sub);
    }

    @Get("requests")
    getFriendRequests(
        @GetUser() payload: JwtPayload,
    ): Promise<FriendRequest[]> {
        return this.friendsService.getPendingRequests(payload.sub);
    }

    @Get("requests/sent")
    getSentRequests(@GetUser() payload: JwtPayload): Promise<SentRequest[]> {
        return this.friendsService.getSentRequests(payload.sub);
    }

    @Post("request/:addresseeId")
    sendFriendRequest(
        @GetUser() payload: JwtPayload,
        @Param("addresseeId") addresseeId: string,
    ): Promise<MessageResponse> {
        return this.friendsService.sendFriendRequest(payload.sub, addresseeId);
    }

    @Patch("accept/:friendshipId")
    acceptFriendRequest(
        @GetUser() payload: JwtPayload,
        @Param("friendshipId") friendshipId: string,
    ): Promise<MessageResponse> {
        return this.friendsService.acceptFriendRequest(
            payload.sub,
            friendshipId,
        );
    }

    @Delete(":friendshipId")
    removeFriend(
        @GetUser() payload: JwtPayload,
        @Param("friendshipId") friendshipId: string,
    ): Promise<MessageResponse> {
        return this.friendsService.removeFriend(payload.sub, friendshipId);
    }
}
