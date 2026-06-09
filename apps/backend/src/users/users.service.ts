import {
    OnModuleInit,
    Injectable,
    NotFoundException,
    BadRequestException,
    UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan, Repository } from "typeorm";
import { User } from "./user.entity";
import { AccountStatus } from "@chad/types";
import { UpdateAdminUserDto, UpdateUserDto } from "./users.dto";
import { hash, compare } from "bcrypt";
import { RanksService } from "../ranks/ranks.service";
import { ConfigService } from "@nestjs/config";
import { PresenceService } from "../presence/presence.service";
import { RolesService } from "src/roles/roles.service";

@Injectable()
export class UsersService implements OnModuleInit {
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly rolesService: RolesService,
        private readonly presenceService: PresenceService,
        private readonly ranksService: RanksService,
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

        const frontendUrl =
            this.configService.get<string>("FRONTEND_URL") ||
            "http://localhost:5173";

        const adminUser = this.userRepository.create({
            email: adminEmail,
            username: adminUsername,
            password: hashedPassword,
            avatarUrl: `${frontendUrl}/public/admin.png`,
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
            where: { rating: MoreThan(user.rating) },
        });

        return { ...user, leaderboardRank: above + 1 };
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

        await this.userRepository.save({ id, ...dataToUpdate });

        return this.getUser(id);
    }

    async uploadAvatar(id: string, filename: string) {
        const backendUrl =
            this.configService.get<string>("BACKEND_URL") ||
            "http://localhost:3000";

        await this.userRepository.save({
            id,
            avatarUrl: `${backendUrl}/uploads/${filename}`,
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

    async searchUsers(query: string, currentUserId: string) {
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

    async getAllUsers() {
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
        return { accountStatus: user.accountStatus };
    }

    async adminUpdateUser(id: string, dto: UpdateAdminUserDto) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException("User not found");

        const { roleId, ...rest } = dto;

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

        return this.getUser(id);
    }

    async findById(id: string) {
        return this.userRepository.findOne({
            where: { id },
            relations: { rank: true },
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
            where: { rating: MoreThan(user.rating) },
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
}
