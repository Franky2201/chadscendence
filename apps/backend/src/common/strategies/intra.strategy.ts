import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import Strategy from "passport-42";
import type { Profile } from "passport";
import { OAuthProfile } from "../dto/auth.dto";

type IntraProfile = Profile & {
    _json?: {
        email?: string;
        login?: string;
        image?: {
            link?: string;
        };
    };
};

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy as any, "42") {
    constructor(private configService: ConfigService) {
        super({
            clientID:
                configService.get<string>("INTRA_CLIENT_ID") ||
                "MISSING_CLIENT_ID",
            clientSecret:
                configService.get<string>("INTRA_CLIENT_SECRET") ||
                "MISSING_CLIENT_SECRET",
            callbackURL:
                configService.get<string>("INTRA_CALLBACK_URL") ||
                `${configService.get<string>("BACKEND_URL", "http://localhost:3000")}/auth/42/callback`,
            scope: ["public"],
        });
    }

    validate(
        accessToken: string,
        refreshToken: string,
        profile: IntraProfile,
    ): OAuthProfile {
        return {
            provider: "42",
            providerId: String(profile.id),
            username: profile._json?.login ?? profile.username ?? null,
            email: profile._json?.email ?? profile.emails?.[0]?.value ?? null,
            avatarUrl: profile._json?.image?.link ?? null,
        };
    }
}
