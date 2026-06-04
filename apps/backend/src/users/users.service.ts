import {
    OnModuleInit,
    Injectable,
    NotFoundException,
    BadRequestException,
    UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan, Repository } from "typeorm";
import { User } from "../common/entities/user.entity";
import { UpdateUserDto } from "../common/dto/users.dto";
import { hash, compare } from "bcrypt";
import { RanksService } from "../ranks/ranks.service";
import { ConfigService } from "@nestjs/config";
import { Block } from "../common/entities/block.entity";
import { PresenceService } from "../presence/presence.service";
import { Role } from "src/common/entities/role.entity";
import { Permission } from "src/common/entities/permission.entity";
import { PermissionAction } from "@chad/types";

@Injectable()
export class UsersService implements OnModuleInit {
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Block)
        private readonly blockRepository: Repository<Block>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
        private readonly presenceService: PresenceService,
        private readonly ranksService: RanksService,
    ) {}

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

        const allPermissions: Permission[] = [];
        for (const action of Object.values(PermissionAction)) {
            let permission = await this.permissionRepository.findOne({
                where: { action },
            });
            if (!permission) {
                permission = this.permissionRepository.create({ action });
                await this.permissionRepository.save(permission);
            }
            allPermissions.push(permission);
        }

        let userRole = await this.roleRepository.findOne({
            where: { name: "User" },
        });
        if (!userRole) {
            userRole = this.roleRepository.create({
                name: "User",
                permissions: [],
            });
            await this.roleRepository.save(userRole);
        }

        let adminRole = await this.roleRepository.findOne({
            where: { name: "Admin" },
        });
        if (!adminRole) {
            adminRole = this.roleRepository.create({
                name: "Admin",
                permissions: allPermissions,
            });
            await this.roleRepository.save(adminRole);
        } else {
            adminRole.permissions = allPermissions;
            await this.roleRepository.save(adminRole);
        }

        const admin = await this.userRepository.findOne({
            where: { email: adminEmail },
        });

        if (admin) return;

        const hashedPassword = await hash(adminPassword, 10);
        const defaultRank = await this.ranksService.getRankForScore(5000);

        const adminUser = this.userRepository.create({
            email: adminEmail,
            username: adminUsername,
            password: hashedPassword,
            avatarUrl: "http://localhost:5173/public/admin.png",
            score: 5000,
            rankId: defaultRank.id,
            role: adminRole,
        });

        await this.userRepository.save(adminUser);
        console.log("Roles and Admin user seeded successfully!");
    }

    async getUser(id: string) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: { rank: true, role: { permissions: true } },
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        return user;
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
        await this.userRepository.save({
            id,
            avatarUrl: `http://localhost:3000/uploads/${filename}`,
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

    async getUserLeaderboardRank(userId: string): Promise<number> {
        const user = await this.getUser(userId);
        const above = await this.userRepository.count({
            where: { score: MoreThan(user.score) },
        });
        return above + 1;
    }

    async getGlobalLeaderboard(count: number) {
        const users = await this.userRepository.find({
            select: { id: true, username: true, avatarUrl: true, score: true },
            order: { score: "DESC", username: "ASC" },
            take: count,
        });

        return users.map((u) => ({
            id: u.id,
            username: u.username,
            avatarUrl: u.avatarUrl,
            score: u.score,
        }));
    }

    async searchUsers(query: string, currentUserId: string) {
        const blockedRelations = await this.blockRepository.find({
            where: [
                { blocker: { id: currentUserId } },
                { blocked: { id: currentUserId } },
            ],
            relations: { blocker: true, blocked: true },
        });

        const excludedIds = blockedRelations.map((b) =>
            b.blocker.id === currentUserId ? b.blocked.id : b.blocker.id,
        );
        excludedIds.push(currentUserId);

        let queryBuilder = this.userRepository
            .createQueryBuilder("user")
            .where("user.username ILIKE :query", { query: `%${query}%` });

        if (excludedIds.length > 0) {
            queryBuilder = queryBuilder.andWhere(
                "user.id NOT IN (:...excludedIds)",
                {
                    excludedIds,
                },
            );
        }

        const users = await queryBuilder
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

    async findById(id: string) {
        return this.userRepository.findOne({
            where: { id },
            relations: { rank: true },
        });
    }

    async findByEmail(email: string) {
        return this.userRepository.findOne({
            where: { email },
            relations: { rank: true },
        });
    }

    async findByUsername(username: string) {
        return this.userRepository.findOne({
            where: { username },
            relations: { rank: true },
        });
    }

    async findByEmailOrUsername(email: string, username: string) {
        return this.userRepository.findOne({
            where: [{ email }, { username }],
            relations: { rank: true },
        });
    }
}
