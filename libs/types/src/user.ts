export enum UserStatus {
    ONLINE = "online",
    OFFLINE = "offline",
}

export enum UserRole {
    USER = "user",
    ADMIN = "admin",
}

export enum AccountStatus {
    ACTIVE = "active",
    BANNED = "banned",
}

export interface User {
    id: string;
    username: string;
    email: string;
    avatarUrl?: string;
    bio?: string;
    status: UserStatus;
    accountStatus: AccountStatus;
    role: UserRole;
    score: number;
    rankId?: string;
    rank?: Rank;
    intraId?: string;
    githubId?: string;
    createdAt: string | Date;
    updatedAt: string | Date;
}

import { Rank } from "./rank";
