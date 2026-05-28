import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-github2";
import { ConfigService } from "@nestjs/config";
import { OAuthProfile } from "../dto/auth.dto";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
    constructor(configService: ConfigService) {
        super({
            clientID:
                configService.get<string>("GITHUB_CLIENT_ID") ||
                "MISSING_CLIENT_ID",
            clientSecret:
                configService.get<string>("GITHUB_CLIENT_SECRET") ||
                "MISSING_CLIENT_SECRET",
            callbackURL:
                configService.get<string>("GITHUB_CALLBACK_URL") ||
                "http://localhost:3000/auth/github/callback",
            scope: ["user:email"],
        });
    }

    validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
    ): OAuthProfile {
        return {
            provider: "github",
            providerId: profile.id,
            username: profile.username ?? null,
            email: profile.emails?.[0]?.value ?? null,
            avatarUrl: profile.photos?.[0]?.value ?? null,
        };
    }
}
