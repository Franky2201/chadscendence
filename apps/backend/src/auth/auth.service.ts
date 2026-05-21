import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../common/entities/user.entity';
import { CreateUserDto, JwtPayload, LoginUserDto } from 'src/common/dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private configService: ConfigService,
        private jwtService: JwtService
    ) { }

    async login({ authlogin }: { authlogin: LoginUserDto }) {
        const { identifier, password } = authlogin;

        const user = await this.userRepository.createQueryBuilder('user')
            .where('user.email = :identifier', { identifier })
            .orWhere('user.username = :identifier', { identifier })
            .addSelect('user.password')
            .getOne();

        if (!user || !user.password) throw new UnauthorizedException();

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new UnauthorizedException();

        return this.generateTokens(user);
    }

    async register({ authregister }: { authregister: CreateUserDto }) {
        const { email, username, password } = authregister;

        const existingEmail = await this.userRepository.findOne({ where: { email } });
        if (existingEmail) throw new ConflictException('Email already exists');

        const existingUsername = await this.userRepository.findOne({ where: { username } });
        if (existingUsername) throw new ConflictException('Username already exists');

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.userRepository.create({
            email,
            username,
            password: hashedPassword
        });

        await this.userRepository.save(user);

        return this.generateTokens(user);
    }

    async validateOAuthLogin(oauthProfile: any) {
        const { id, email, username, avatarUrl } = oauthProfile;

        if (!email) {
            throw new UnauthorizedException('Un email est requis pour se connecter via 42.');
        }

        let user = await this.userRepository.findOne({ where: { intraId: id } });
        if (user) return this.generateTokens(user);

        user = await this.userRepository.findOne({ where: { email } });
        if (user) {
            user.intraId = id;
            user.avatarUrl = user.avatarUrl || avatarUrl;
            await this.userRepository.save(user);
            return this.generateTokens(user);
        }

        user = this.userRepository.create({
            intraId: id,
            email,
            username,
            avatarUrl
        });

        try {
            await this.userRepository.save(user);
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException(`Le pseudo "${username}" est déjà réservé par un autre compte.`);
            }
            throw error;
        }

        return this.generateTokens(user);
    }

    private async generateTokens(user: User) {
        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            username: user.username,
        };

        const access_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: '15m',
        });

        return { access_token };
    }
}
