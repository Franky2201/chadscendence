import {
    NotFoundException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Rank } from "../common/entities/rank.entity";
import { OnModuleInit } from "@nestjs/common";
import { CreateRankDto, UpdateRankDto } from "../common/dto/ranks.dto";

@Injectable()
export class RanksService implements OnModuleInit {
    constructor(
        @InjectRepository(Rank)
        private readonly rankRepository: Repository<Rank>,
    ) { }

    async onModuleInit() {
        await this.seedRanks();
    }

    private async seedRanks() {
        const count = await this.rankRepository.count();
        if (count > 0) return;

        const defaultRanks = [
            { name: "Wood", ratingMin: 0, icon: "🪵" },
            { name: "Bronze", ratingMin: 100, icon: "🥉" },
            { name: "Silver", ratingMin: 500, icon: "🥈" },
            { name: "Gold", ratingMin: 1000, icon: "🥇" },
            { name: "Platinum", ratingMin: 2500, icon: "💎" },
            { name: "Chad", ratingMin: 5000, icon: "🗿" },
        ];

        await this.rankRepository.save(defaultRanks);
        console.log("Ranks table seeded successfully!");
    }

    async getRankForRating(rating: number): Promise<Rank> {
        const rank = await this.rankRepository
            .createQueryBuilder("rank")
            .where("rank.ratingMin <= :rating", { rating })
            .orderBy("rank.ratingMin", "DESC")
            .getOne();

        if (!rank) {
            throw new InternalServerErrorException(
                "Critical: No applicable rank found in database. Is the table seeded?",
            );
        }

        return rank;
    }

    async getRanks() {
        return this.rankRepository.find({
            order: { ratingMin: "ASC" },
        });
    }

    async getRank(id: string) {
        const rank = await this.rankRepository.findOne({ where: { id } });

        if (!rank) {
            throw new NotFoundException("Rank not found");
        }

        return rank;
    }

    async createRank(body: CreateRankDto) {
        const newRank = this.rankRepository.create(body);
        return this.rankRepository.save(newRank);
    }

    async updateRank(id: string, body: UpdateRankDto) {
        const rank = await this.getRank(id);
        Object.assign(rank, body);
        return this.rankRepository.save(rank);
    }

    async deleteRank(id: string) {
        const rank = await this.getRank(id);
        await this.rankRepository.remove(rank);
        return { message: "Rank deleted successfully" };
    }
}
