import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Friendship } from "./friendship.entity";
import { User } from "../users/user.entity";
import { PresenceService } from "../presence/presence.service";
import {
    Friend,
    FriendRequest,
    SentRequest,
    FriendshipStatus,
    MessageResponse,
} from "@chad/types";

@Injectable()
export class FriendsService {
    constructor(
        @InjectRepository(Friendship)
        private readonly friendshipRepository: Repository<Friendship>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly presenceService: PresenceService,
    ) {}

    async getFriends(userId: string): Promise<Friend[]> {
        const friendships = await this.friendshipRepository.find({
            where: [
                {
                    requester: { id: userId },
                    status: FriendshipStatus.ACCEPTED,
                },
                {
                    addressee: { id: userId },
                    status: FriendshipStatus.ACCEPTED,
                },
            ],
            relations: { requester: true, addressee: true },
        });

        return friendships.map((f) => {
            const friend =
                f.requester.id === userId ? f.addressee : f.requester;
            return {
                friendshipId: f.id,
                id: friend.id,
                username: friend.username,
                avatarUrl: friend.avatarUrl,
                status: this.presenceService.isUserOnline(friend.id)
                    ? "online"
                    : "offline",
            };
        });
    }

    async getPendingRequests(userId: string): Promise<FriendRequest[]> {
        const requests = await this.friendshipRepository.find({
            where: {
                addressee: { id: userId },
                status: FriendshipStatus.PENDING,
            },
            relations: { requester: true },
        });

        return requests.map((f) => ({
            friendshipId: f.id,
            requesterId: f.requester.id,
            username: f.requester.username,
            avatarUrl: f.requester.avatarUrl,
        }));
    }

    async getSentRequests(userId: string): Promise<SentRequest[]> {
        const requests = await this.friendshipRepository.find({
            where: {
                requester: { id: userId },
                status: FriendshipStatus.PENDING,
            },
            relations: { addressee: true },
        });

        return requests.map((f) => ({
            friendshipId: f.id,
            addresseeId: f.addressee.id,
            username: f.addressee.username,
            avatarUrl: f.addressee.avatarUrl,
        }));
    }

    async sendFriendRequest(
        requesterId: string,
        addresseeId: string,
    ): Promise<MessageResponse> {
        if (requesterId === addresseeId) {
            throw new BadRequestException(
                "You cannot send a friend request to yourself",
            );
        }

        const addressee = await this.userRepository.findOne({
            where: { id: addresseeId },
        });
        if (!addressee) {
            throw new NotFoundException("User not found");
        }

        const existing = await this.friendshipRepository.findOne({
            where: [
                {
                    requester: { id: requesterId },
                    addressee: { id: addresseeId },
                },
                {
                    requester: { id: addresseeId },
                    addressee: { id: requesterId },
                },
            ],
        });

        if (existing) {
            throw new BadRequestException(
                "Friendship or request already exists",
            );
        }

        const friendship = this.friendshipRepository.create({
            requester: { id: requesterId },
            addressee: { id: addresseeId },
            status: FriendshipStatus.PENDING,
        });

        await this.friendshipRepository.save(friendship);
        return { message: "Friend request sent" };
    }

    async acceptFriendRequest(
        userId: string,
        friendshipId: string,
    ): Promise<MessageResponse> {
        const friendship = await this.friendshipRepository.findOne({
            where: {
                id: friendshipId,
                addressee: { id: userId },
                status: FriendshipStatus.PENDING,
            },
            relations: { requester: true },
        });

        if (!friendship) {
            throw new NotFoundException("Friend request not found");
        }

        friendship.status = FriendshipStatus.ACCEPTED;
        await this.friendshipRepository.save(friendship);

        return { message: "Friend request accepted" };
    }

    async removeFriend(
        userId: string,
        friendshipId: string,
    ): Promise<MessageResponse> {
        const friendship = await this.friendshipRepository.findOne({
            where: [
                { id: friendshipId, requester: { id: userId } },
                { id: friendshipId, addressee: { id: userId } },
            ],
        });

        if (!friendship) {
            throw new NotFoundException("Friendship not found");
        }

        await this.friendshipRepository.remove(friendship);
        return { message: "Friend removed" };
    }
}
