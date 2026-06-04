import { Rank } from "./rank";

export enum UserStatus {
    ONLINE = "online",
    OFFLINE = "offline"
}

export enum PermissionAction {
    BAN_USER = 'BAN_USER',
    UNBAN_USER = 'UNBAN_USER',
    EDIT_USER_AVATAR = 'EDIT_USER_AVATAR',
    EDIT_USER_USERNAME = 'EDIT_USER_USERNAME',
    EDIT_USER_BIO = 'EDIT_USER_BIO',
    EDIT_USER_SCORE = 'EDIT_USER_SCORE',
    MANAGE_ROLES = 'MANAGE_ROLES',
    CREATE_RANK = 'CREATE_RANK',
    EDIT_RANK = 'EDIT_RANK',
    DELETE_RANK = 'DELETE_RANK',
}

export interface Permission {
    id: string;
    action: PermissionAction;
}

export interface Role {
    id: string;
    name: string;
    permissions: Permission[];
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
    role?: Role;
    score: number;
    rankId?: string;
    rank?: Rank;
    intraId?: string;
    githubId?: string;
    createdAt: string | Date;
    updatedAt: string | Date;
}
