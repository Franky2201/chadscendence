import { Injectable, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Message } from "../common/entities/message.entity";
import {
    Friendship,
    FriendshipStatus,
} from "../common/entities/friendship.entity";
import { Block } from "../common/entities/block.entity";
import { MessagesGateway } from "./messages.gateway";

type UnreadCountRow = {
    senderId: string;
    count: string;
};

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
        @InjectRepository(Friendship)
        private readonly friendshipRepository: Repository<Friendship>,
        @InjectRepository(Block)
        private readonly blockRepository: Repository<Block>,
        private readonly messagesGateway: MessagesGateway,
    ) {}

    async checkCanMessage(senderId: string, receiverId: string) {
        const block = await this.blockRepository.findOne({
            where: [
                { blocker: { id: senderId }, blocked: { id: receiverId } },
                { blocker: { id: receiverId }, blocked: { id: senderId } },
            ],
        });

        if (block) {
            throw new ForbiddenException();
        }

        const friendship = await this.friendshipRepository.findOne({
            where: [
                {
                    requester: { id: senderId },
                    addressee: { id: receiverId },
                    status: FriendshipStatus.ACCEPTED,
                },
                {
                    requester: { id: receiverId },
                    addressee: { id: senderId },
                    status: FriendshipStatus.ACCEPTED,
                },
            ],
        });

        if (!friendship) {
            throw new ForbiddenException();
        }
    }

    async getConversation(userId: string, friendId: string, page: number) {
        await this.checkCanMessage(userId, friendId);

        return this.messageRepository.find({
            where: [
                { sender: { id: userId }, receiver: { id: friendId } },
                { sender: { id: friendId }, receiver: { id: userId } },
            ],
            order: { createdAt: "DESC" },
            take: 50,
            skip: (page - 1) * 50,
            relations: { sender: true },
        });
    }

    async sendMessage(senderId: string, receiverId: string, content: string) {
        await this.checkCanMessage(senderId, receiverId);

        const message = this.messageRepository.create({
            sender: { id: senderId },
            receiver: { id: receiverId },
            content,
        });

        const savedMessage = await this.messageRepository.save(message);

        const messageWithSender = await this.messageRepository.findOne({
            where: { id: savedMessage.id },
            relations: { sender: true },
        });

        if (messageWithSender) {
            this.messagesGateway.notifyNewMessage(
                receiverId,
                messageWithSender,
            );
        }

        return messageWithSender;
    }

    async markAsRead(userId: string, friendId: string) {
        await this.messageRepository.update(
            {
                sender: { id: friendId },
                receiver: { id: userId },
                isRead: false,
            },
            { isRead: true },
        );
    }

    async getUnreadCounts(userId: string): Promise<Record<string, number>> {
        const result = await this.messageRepository
            .createQueryBuilder("message")
            .select("message.sender_id", "senderId")
            .addSelect("COUNT(message.id)", "count")
            .where("message.receiver_id = :userId", { userId })
            .andWhere("message.is_read = :isRead", { isRead: false })
            .groupBy("message.sender_id")
            .getRawMany<UnreadCountRow>();

        const counts: Record<string, number> = {};

        for (const row of result) {
            counts[row.senderId] = Number(row.count);
        }

        return counts;
    }
}
