import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-github2";
import { ConfigService } from "@nestjs/config";
import type { OAuthProfile } from "@chad/types";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
    constructor(configService: ConfigService) {
        const clientID = configService.get<string>("GITHUB_CLIENT_ID");
        const clientSecret = configService.get<string>("GITHUB_CLIENT_SECRET");
        const callbackURL = configService.get<string>("GITHUB_CALLBACK_URL");

        if (!clientID || !clientSecret || !callbackURL) {
            throw new Error(
                "Missing GitHub OAuth configuration (ID, Secret, or Callback URL)",
            );
        }

        super({
            clientID,
            clientSecret,
            callbackURL,
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
