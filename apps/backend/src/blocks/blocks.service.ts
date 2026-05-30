import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Block } from "src/common/entities/block.entity";
import { Friendship } from "src/common/entities/friendship.entity";

@Injectable()
export class BlocksService {
    constructor(
        @InjectRepository(Block)
        private readonly blockRepository: Repository<Block>,
        @InjectRepository(Friendship)
        private readonly friendshipRepository: Repository<Friendship>,
    ) {}

    async blockUser(blockerId: string, blockedId: string) {
        if (blockerId === blockedId) {
            throw new BadRequestException("You cannot block yourself");
        }

        const existingBlock = await this.blockRepository.findOne({
            where: { blocker: { id: blockerId }, blocked: { id: blockedId } },
        });

        if (existingBlock) {
            return { message: "User already blocked" };
        }

        const friendships = await this.friendshipRepository.find({
            where: [
                { requester: { id: blockerId }, addressee: { id: blockedId } },
                { requester: { id: blockedId }, addressee: { id: blockerId } },
            ],
        });

        if (friendships.length > 0) {
            await this.friendshipRepository.remove(friendships);
        }

        const block = this.blockRepository.create({
            blocker: { id: blockerId },
            blocked: { id: blockedId },
        });

        await this.blockRepository.save(block);

        return { message: "User blocked successfully" };
    }

    async unblockUser(blockerId: string, blockedId: string) {
        const block = await this.blockRepository.findOne({
            where: { blocker: { id: blockerId }, blocked: { id: blockedId } },
        });

        if (block) {
            await this.blockRepository.remove(block);
        }

        return { message: "User unblocked successfully" };
    }

    async getBlockedUsers(userId: string) {
        const blocks = await this.blockRepository.find({
            where: { blocker: { id: userId } },
            relations: { blocked: true },
        });

        return blocks.map((b) => ({
            id: b.blocked.id,
            username: b.blocked.username,
            avatarUrl: b.blocked.avatarUrl,
        }));
    }
}
