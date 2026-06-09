import { Rank } from "./rank";

export enum UserStatus {
    ONLINE = "online",
    OFFLINE = "offline"
}

export enum PermissionAction {
    BAN_USER = 'BAN_USER',
    MANAGE_USERS = 'MANAGE_USERS',
    MANAGE_ROLES = 'MANAGE_ROLES',
    MANAGE_RANKS = 'MANAGE_RANKS',
}

export interface Permission {
    id: string;
    action: PermissionAction;
}

export interface Role {
    id: string;
    name: string;
    permissions: Permission[];
    userCount?: number;
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
    role: Role;
    score: number;
    rankId?: string;
    rank?: Rank;
    intraId?: string;
    githubId?: string;
    createdAt: string | Date;
    updatedAt: string | Date;
}
