import {
    OnModuleInit,
    Injectable,
    NotFoundException,
    BadRequestException,
    UnauthorizedException,
    ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan, LessThan, Repository } from "typeorm";
import { User } from "./user.entity";
import { AccountStatus, UserListItem, UserSearchResult } from "@chad/types";
import { UpdateAdminUserDto, UpdateUserDto } from "./users.dto";
import { hash, compare } from "bcrypt";
import { RanksService } from "../ranks/ranks.service";
import { ConfigService } from "@nestjs/config";
import { PresenceService } from "../presence/presence.service";
import { RolesService } from "src/roles/roles.service";
import { PresenceGateway } from "../presence/presence.gateway";
import { GameAnalytics } from "src/users/analytics.entity";

@Injectable()
export class UsersService implements OnModuleInit {
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly rolesService: RolesService,
        private readonly presenceService: PresenceService,
        private readonly ranksService: RanksService,
        private readonly presenceGateway: PresenceGateway,
        @InjectRepository(GameAnalytics)
        private readonly analyticsRepository: Repository<GameAnalytics>,
    ) { }

    async onModuleInit() {
        await this.seedAdmin();
    }

    private async seedAdmin() {
        const adminEmail = this.configService.get<string>("ADMIN_EMAIL");
        const adminUsername = this.configService.get<string>("ADMIN_USERNAME");
        const adminPassword = this.configService.get<string>("ADMIN_PASSWORD");

        if (!adminEmail || !adminUsername || !adminPassword) {
            throw new Error("Missing admin credentials");
        }

        const { adminRole } = await this.rolesService.seedRoles();

        const admin = await this.userRepository.findOne({
            where: { email: adminEmail },
        });

        if (admin) return;

        const hashedPassword = await hash(adminPassword, 10);
        const defaultRank = await this.ranksService.getRankForRating(5000);
        const frontendUrl = this.configService.get<string>("FRONTEND_URL");

        const adminUser = this.userRepository.create({
            email: adminEmail,
            username: adminUsername,
            password: hashedPassword,
            avatarUrl: `${frontendUrl}/admin.png`,
            rating: 5000,
            rank: defaultRank,
            role: adminRole,
        });

        await this.userRepository.save(adminUser);
    }

    async getUser(id: string) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: { rank: true, role: { permissions: true } },
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const above = await this.userRepository.count({
            where: [
                { rating: MoreThan(user.rating) },
                { rating: user.rating, username: LessThan(user.username) }
            ]
        });

        const analytics = await this.analyticsRepository.find({
            where: { userId: user.id },
            order: { playedAt: "DESC" },
        });

        return {
            ...user,
            leaderboardRank: above + 1,
            rank: user.rank!,
            role: user.role,
            analytics,
        };
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        const { password, oldPassword, ...rest } = updateUserDto;
        const dataToUpdate: Partial<User> = { ...rest };

        if ("bio" in updateUserDto) {
            dataToUpdate.bio = updateUserDto.bio;
        }

        if (password) {
            const userWithPassword = await this.userRepository
                .createQueryBuilder("user")
                .where("user.id = :id", { id })
                .addSelect("user.password")
                .getOne();

            if (!userWithPassword)
                throw new NotFoundException("User not found");

            if (!userWithPassword.password)
                throw new BadRequestException(
                    "Les comptes OAuth ne peuvent pas définir de mot de passe ici.",
                );

            if (!oldPassword)
                throw new BadRequestException(
                    "L'ancien mot de passe est requis pour en définir un nouveau.",
                );

            const isValid = await compare(
                oldPassword,
                userWithPassword.password,
            );
            if (!isValid)
                throw new UnauthorizedException(
                    "L'ancien mot de passe est incorrect.",
                );

            dataToUpdate.password = await hash(password, 10);
        }

        try {
            await this.userRepository.save({ id, ...dataToUpdate });
        } catch (error) {
            const err = error as { code?: string; detail?: string };
            if (err.code === "23505") {
                if (err.detail?.includes("username")) {
                    throw new ConflictException(
                        "This username is already taken.",
                    );
                }
                if (err.detail?.includes("email")) {
                    throw new ConflictException(
                        "This email address is already taken.",
                    );
                }
            }
            throw error;
        }

        return this.getUser(id);
    }

    async uploadAvatar(id: string, filename: string) {
        await this.userRepository.save({
            id,
            avatarUrl: `/uploads/${filename}`,
        });
        return this.getUser(id);
    }

    async deleteUser(id: string) {
        const user = await this.userRepository.findOne({ where: { id } });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        await this.userRepository.remove(user);

        return { message: "User deleted successfully." };
    }

    async getGlobalLeaderboard(count: number) {
        const users = await this.userRepository.find({
            select: { id: true, username: true, avatarUrl: true, rating: true },
            order: { rating: "DESC", username: "ASC" },
            take: count,
        });

        return users.map((u) => ({
            id: u.id,
            username: u.username,
            avatarUrl: u.avatarUrl,
            rating: u.rating,
        }));
    }

    async searchUsers(
        query: string,
        currentUserId: string,
    ): Promise<UserSearchResult[]> {
        const users = await this.userRepository
            .createQueryBuilder("user")
            .where("user.username ILIKE :query", { query: `%${query}%` })
            .andWhere("user.id != :currentUserId", { currentUserId })
            .select(["user.id", "user.username", "user.avatarUrl"])
            .take(10)
            .getMany();

        return users.map((u) => ({
            id: u.id,
            username: u.username,
            avatarUrl: u.avatarUrl,
            status: this.presenceService.isUserOnline(u.id)
                ? "online"
                : "offline",
        }));
    }

    async getAllUsers(): Promise<UserListItem[]> {
        const users = await this.userRepository.find({
            select: {
                id: true,
                username: true,
                avatarUrl: true,
                bio: true,
                rating: true,
                updatedAt: true,
                accountStatus: true,
            },
            relations: { role: true, rank: true },
            order: { username: "ASC" },
        });

        return users.map((u) => ({
            id: u.id,
            username: u.username,
            avatarUrl: u.avatarUrl,
            bio: u.bio,
            rating: u.rating,
            updatedAt: u.updatedAt,
            accountStatus: u.accountStatus,
            role: u.role,
            rank: u.rank,
            status: this.presenceService.isUserOnline(u.id)
                ? "online"
                : "offline",
        }));
    }

    async banUser(id: string) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException("User not found");

        user.accountStatus =
            user.accountStatus === AccountStatus.BANNED
                ? AccountStatus.ACTIVE
                : AccountStatus.BANNED;

        await this.userRepository.save(user);

        if (user.accountStatus === AccountStatus.BANNED) {
            this.presenceGateway.notifyUserBanned(user.id);
        }

        return { accountStatus: user.accountStatus };
    }

    async adminUpdateUser(id: string, dto: UpdateAdminUserDto) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException("User not found");

        const { roleId, rating, ...rest } = dto;

        const role = roleId
            ? await this.rolesService.findOne(roleId)
            : undefined;

        if (roleId && !role) {
            throw new NotFoundException("Role not found");
        }

        const updatedUser = {
            ...user,
            ...rest,
            ...(role ? { role } : {}),
        };

        await this.userRepository.save(updatedUser);
        if (rating) {
            await this.updateRating(id, rating);
        }

        return this.getUser(id);
    }

    async findById(id: string) {
        return this.userRepository.findOne({
            where: { id },
            relations: {
                rank: true,
                role: {
                    permissions: true,
                },
            },
        });
    }

    async getPublicProfileByUsername(username: string) {
        const user = await this.userRepository.findOne({
            where: { username },
            relations: { rank: true, role: true },
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const above = await this.userRepository.count({
            where: [
                { rating: MoreThan(user.rating) },
                { rating: user.rating, username: LessThan(user.username) }
            ]
        });

        return {
            id: user.id,
            username: user.username,
            avatarUrl: user.avatarUrl,
            bio: user.bio,
            rating: user.rating,
            rank: user.rank,
            role: user.role,
            leaderboardRank: above + 1,
        };
    }

    async updateRating(userId: string, newRating: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: { rank: true },
        });

        if (!user) {
            throw new NotFoundException("Utilisateur introuvable");
        }

        const newRank = await this.ranksService.getRankForRating(newRating);

        user.rating = newRating;
        user.rank = newRank;

        return this.userRepository.save(user);
    }
}
