import type { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "../dto/auth.dto";
import { UsersService } from "../../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    const cookies = request?.cookies as
                        | Record<string, string>
                        | undefined;
                    const token = cookies?.access_token;

                    if (!token) {
                        return null;
                    }
                    return token;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey:
                configService.get<string>("JWT_SECRET") ||
                "super-secret-key-a-changer-en-prod",
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.usersService.findById(payload.sub);
        if (!user) {
            throw new UnauthorizedException("User not found");
        }
        return payload;
    }
}
