import {
    ConflictException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { User } from "../users/user.entity";
import { AccountStatus, JwtPayload, OAuthProfile } from "@chad/types";
import { CreateUserDto, LoginUserDto } from "./auth.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RanksService } from "../ranks/ranks.service";
import { Role } from "../roles/role.entity";

@Injectable()
export class AuthService {
    private readonly defaultAvatar: string;

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly ranksService: RanksService,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) {
        const frontendUrl =
            this.configService.get<string>("FRONTEND_URL") ||
            `https://${this.configService.get<string>("DOMAIN_NAME") || "localhost"}`;
        this.defaultAvatar = `${frontendUrl}/public/avatar.jpg`;
    }

    async login({ authlogin }: { authlogin: LoginUserDto }) {
        const { identifier, password } = authlogin;

        const user = await this.userRepository
            .createQueryBuilder("user")
            .where("user.email = :identifier OR user.username = :identifier", {
                identifier,
            })
            .addSelect("user.password")
            .getOne();

        if (!user || !user.password) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            throw new UnauthorizedException("Invalid credentials");
        }

        return this.generateTokens(user);
    }

    async register({ authregister }: { authregister: CreateUserDto }) {
        const { email, username, password } = authregister;

        const existingEmail = await this.userRepository.findOne({
            where: { email },
        });
        if (existingEmail) throw new ConflictException("Email already exists");

        const existingUsername = await this.userRepository.findOne({
            where: { username },
        });
        if (existingUsername)
            throw new ConflictException("Username already exists");

        const hashedPassword = await bcrypt.hash(password, 10);
        const defaultRank = await this.ranksService.getRankForRating(0);
        const defaultRole = await this.roleRepository.findOne({
            where: { name: "User" },
        });

        if (!defaultRole)
            throw new InternalServerErrorException(
                "Role USER is missing in database",
            );

        const user = this.userRepository.create({
            email,
            username,
            password: hashedPassword,
            avatarUrl: this.defaultAvatar,
            rating: 0,
            rank: defaultRank,
            role: defaultRole,
        });

        await this.userRepository.save(user);

        return this.generateTokens(user);
    }

    async registerOAuth(oauthProfile: OAuthProfile) {
        const { provider, providerId, email, username, avatarUrl } =
            oauthProfile;

        if (!email) {
            throw new UnauthorizedException(
                `An email is required to login with ${provider}.`,
            );
        }

        const safeUsername: string =
            typeof username === "string"
                ? username
                : typeof email === "string" && email.includes("@")
                  ? (email.split("@")[0] ?? "user")
                  : "user";

        const safeAvatarUrl = avatarUrl ?? this.defaultAvatar;

        const providerKey = provider === "github" ? "githubId" : "intraId";

        let user = await this.userRepository.findOne({
            where: { [providerKey]: providerId },
        });
        if (user) {
            if (user.accountStatus === AccountStatus.BANNED)
                throw new ForbiddenException("Account is banned");
            return this.generateTokens(user);
        }

        user = await this.userRepository.findOne({ where: { email } });
        if (user) {
            if (user.accountStatus === AccountStatus.BANNED)
                throw new ForbiddenException("Account is banned");
            if (provider === "github") {
                user.githubId = providerId;
            } else {
                user.intraId = providerId;
            }
            user.avatarUrl = user.avatarUrl || safeAvatarUrl;
            await this.userRepository.save(user);
            return this.generateTokens(user);
        }

        const finalUsername = await this.generateUniqueUsername(safeUsername);
        const defaultRank = await this.ranksService.getRankForRating(0);
        const defaultRole = await this.roleRepository.findOne({
            where: { name: "User" },
        });

        if (!defaultRole)
            throw new InternalServerErrorException(
                "Role USER is missing in database",
            );

        user = this.userRepository.create({
            ...(provider === "github"
                ? { githubId: providerId }
                : { intraId: providerId }),
            email,
            username: finalUsername,
            avatarUrl: safeAvatarUrl,
            rating: 0,
            rank: defaultRank,
            role: defaultRole,
        });

        await this.userRepository.save(user);

        return this.generateTokens(user);
    }

    private async generateUniqueUsername(base: string) {
        let username = base;
        let i = 0;

        while (await this.userRepository.findOne({ where: { username } })) {
            i++;
            username = `${base}_${i}${Math.floor(Math.random() * 1000)}`;
        }

        return username;
    }

    private generateTokens(user: User) {
        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            username: user.username,
        };

        const access_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_SECRET"),
            expiresIn: "15m",
        });

        return { access_token };
    }
}
