import { UserRole } from "./user";

export interface JwtPayload {
    sub: string;
    email: string;
    username: string;
    role: UserRole;
}

export interface OAuthProfile {
    provider: "42" | "github";
    providerId: string;
    username: string | null;
    email: string | null;
    avatarUrl: string | null;
}
