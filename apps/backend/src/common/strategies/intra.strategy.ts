import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import Strategy = require('passport-42');
import type { Profile } from 'passport';
import { AuthService } from 'src/auth/auth.service';

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
export class IntraStrategy extends PassportStrategy(Strategy as any, '42') {
    constructor(
        private authService: AuthService,
        private configService: ConfigService
    ) {
        super({
            clientID: configService.get<string>('INTRA_CLIENT_ID'),
            clientSecret: configService.get<string>('INTRA_CLIENT_SECRET'),
            callbackURL: configService.get<string>('INTRA_CALLBACK_URL'),
            scope: ['public'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: IntraProfile) {
        const oauthProfile = {
            id: String(profile.id),
            username: profile._json?.login ?? profile.username ?? null,
            email: profile._json?.email ?? profile.emails?.[0]?.value ?? null,
            avatarUrl: profile._json?.image?.link ?? null,
        };

        return oauthProfile;
    }
}
