export interface JwtPayload {
    sub: string;
    email: string;
    username: string;
}

export interface OAuthProfile {
    provider: "42" | "github";
    providerId: string;
    username: string | null;
    email: string | null;
    avatarUrl: string | null;
}

export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
}

export interface LoginPayload {
    identifier: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message?: string;
}
