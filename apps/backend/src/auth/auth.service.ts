import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { User } from "../common/entities/user.entity";
import {
    CreateUserDto,
    OAuthProfile,
    JwtPayload,
    LoginUserDto,
} from "src/common/dto/auth.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RanksService } from "src/ranks/ranks.service";

const DEFAULT_AVATAR = "http://localhost:5173/public/avatar.jpg";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly ranksService: RanksService,
    ) {}

    async login({ authlogin }: { authlogin: LoginUserDto }) {
        const { email, password } = authlogin;

        const user = await this.userRepository
            .createQueryBuilder("user")
            .where("user.email = :email", { email })
            .addSelect("user.password")
            .getOne();

        if (!user || !user.password)
            throw new UnauthorizedException("Account not found");

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new UnauthorizedException("Invalid password");

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
        const defaultRank = await this.ranksService.getRankForScore(0);

        const user = this.userRepository.create({
            email,
            username,
            password: hashedPassword,
            avatarUrl: DEFAULT_AVATAR,
            score: 0,
            rankId: defaultRank.id,
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

        const safeUsername = username ?? email.split("@")[0] ?? "user";
        const safeAvatarUrl = avatarUrl ?? undefined;

        const providerKey = provider === "github" ? "githubId" : "intraId";

        let user = await this.userRepository.findOne({
            where: { [providerKey]: providerId },
        });
        if (user) return this.generateTokens(user);

        user = await this.userRepository.findOne({ where: { email } });
        if (user) {
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
        const defaultRank = await this.ranksService.getRankForScore(0);

        user = this.userRepository.create({
            ...(provider === "github"
                ? { githubId: providerId }
                : { intraId: providerId }),
            email,
            username: finalUsername,
            avatarUrl: safeAvatarUrl,
            score: 0,
            rankId: defaultRank.id,
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
            role: user.role,
        };

        const access_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_SECRET"),
            expiresIn: "15m",
        });

        return { access_token };
    }
}
