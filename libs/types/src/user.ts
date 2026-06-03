import { Rank } from "./rank";

export enum UserStatus {
    ONLINE = "online",
    OFFLINE = "offline"
}

export enum PermissionAction {
    BAN_USER = "BAN_USER",
    UNBAN_USER = "UNBAN_USER",
    UPDATE_USER_AVATAR = "UPDATE_USER_AVATAR",
    UPDATE_USER_USERNAME = "UPDATE_USER_USERNAME",
    UPDATE_USER_SCORE = "UPDATE_USER_SCORE",
    MANAGE_ROLES = "MANAGE_ROLES",
    ADD_RANK = "ADD_RANK",
    UPDATE_RANK = "UPDATE_RANK",
    DELETE_RANK = "DELETE_RANK",
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

export interface User {
    id: string;
    username: string;
    email: string;
    avatarUrl?: string;
    bio?: string;
    status: UserStatus;
    role?: Role;
    score: number;
    rankId?: string;
    rank?: Rank;
    intraId?: string;
    githubId?: string;
    createdAt: string | Date;
    updatedAt: string | Date;
}
