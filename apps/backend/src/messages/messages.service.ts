import {
    Injectable,
    ForbiddenException,
    InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Message } from "./message.entity";
import { Friendship } from "../friends/friendship.entity";
import { MessagesGateway } from "./messages.gateway";
import {
    FriendshipStatus,
    Message as IMessage,
    UnreadCountsResponse,
} from "@chad/types";

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
        @InjectRepository(Friendship)
        private readonly friendshipRepository: Repository<Friendship>,
        private readonly messagesGateway: MessagesGateway,
    ) {}

    async checkCanMessage(senderId: string, receiverId: string) {
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

    async getConversation(
        userId: string,
        friendId: string,
        page: number,
    ): Promise<IMessage[]> {
        await this.checkCanMessage(userId, friendId);

        const messages = await this.messageRepository.find({
            where: [
                { sender: { id: userId }, receiver: { id: friendId } },
                { sender: { id: friendId }, receiver: { id: userId } },
            ],
            order: { createdAt: "DESC" },
            take: 50,
            skip: (page - 1) * 50,
            relations: { sender: true },
        });

        return messages.map((m) => ({
            ...m,
            sender: {
                ...m.sender,
                avatarUrl: m.sender.avatarUrl,
            },
        }));
    }

    async sendMessage(
        senderId: string,
        receiverId: string,
        content: string,
    ): Promise<IMessage> {
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

        if (!messageWithSender) {
            throw new InternalServerErrorException(
                "Erreur lors de la récupération du message après sauvegarde",
            );
        }

        const formattedMessage: IMessage = {
            ...messageWithSender,
            sender: {
                ...messageWithSender.sender,
                avatarUrl: messageWithSender.sender.avatarUrl,
            },
        };

        this.messagesGateway.notifyNewMessage(receiverId, formattedMessage);

        return formattedMessage;
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

    async getUnreadCounts(userId: string): Promise<UnreadCountsResponse> {
        type UnreadCountRow = {
            senderId: string;
            count: string;
        };

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
