import type { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "src/common/dto/auth.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
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

    validate(payload: JwtPayload) {
        return payload;
    }
}
