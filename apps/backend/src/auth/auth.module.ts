import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "../common/strategies/jwt.strategy";
import { IntraStrategy } from "../common/strategies/intra.strategy";
import { GithubStrategy } from "../common/strategies/github.strategy";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../common/entities/user.entity";
import { RanksModule } from "../ranks/ranks.module";
import { UsersModule } from "../users/users.module";
import { Role } from "src/common/entities/role.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Role, User]),
        PassportModule,
        RanksModule,
        UsersModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret:
                    configService.get<string>("JWT_SECRET") ||
                    "super-secret-key-a-changer-en-prod",
                signOptions: { expiresIn: "1d" },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, IntraStrategy, GithubStrategy],
})
export class AuthModule { }
