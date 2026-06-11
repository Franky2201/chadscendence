import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import Strategy from "passport-42";
import type { Profile } from "passport";
import type { OAuthProfile } from "@chad/types";

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
        const clientID = configService.get<string>("INTRA_CLIENT_ID");
        const clientSecret = configService.get<string>("INTRA_CLIENT_SECRET");
        const callbackURL = configService.get<string>("INTRA_CALLBACK_URL");

        if (
            !clientID ||
            !clientSecret ||
            !callbackURL ||
            clientID === "your_intra_client_id" ||
            clientSecret === "your_intra_client_secret"
        ) {
            throw new Error(
                "Intra OAuth is not configured. Please provide real credentials in the .env file.",
            );
        }

        super({
            clientID,
            clientSecret,
            callbackURL,
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
