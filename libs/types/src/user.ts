import { Rank } from "./rank";
import { Role } from "./role";

export enum UserStatus {
    ONLINE = "online",
    OFFLINE = "offline"
}

export enum AccountStatus {
    ACTIVE = "active",
    BANNED = "banned",
}

export interface RoundDetail {
    gameId: string;
    score: number;
}

export interface GameAnalytics {
    id: string;
    userId: string;
    totalScore: number;
    ratingDelta: number;
    newRating: number;
    roundsDetails: RoundDetail[];
    playedAt: string | Date;
}

export interface User {
    id: string;
    username: string;
    email: string;
    avatarUrl: string;
    bio?: string | null;
    status: UserStatus;
    accountStatus: AccountStatus;
    role: Role;
    rating: number;
    rank: Rank;
    leaderboardRank: number;
    intraId?: string;
    githubId?: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    analytics: GameAnalytics[];
}

export interface UpdateMePayload {
    username?: string;
    oldPassword?: string;
    password?: string;
    avatarUrl?: string;
    bio?: string | null;
}

export interface AdminUpdateDataPayload {
    username?: string;
    avatarUrl?: string;
    bio?: string | null;
    rating?: number;
    roleId?: string;
}

export type LeaderboardItem = {
    id: string | number;
    username: string;
    avatarUrl: string;
    rating: number;
};

export interface UserSearchResult {
    id: string;
    username: string;
    avatarUrl: string;
    status: "online" | "offline";
}

export interface PublicUserProfile {
    id: string;
    username: string;
    avatarUrl: string;
    bio?: string | null;
    rating: number;
    rank: Rank;
    role: Role;
    leaderboardRank: number;
}

export interface UserListItem {
    id: string;
    username: string;
    avatarUrl: string;
    bio?: string | null;
    rating: number;
    updatedAt: string | Date;
    status: "online" | "offline";
    accountStatus: AccountStatus;
    role: Role;
    rank: Rank;
}

export interface BasicMessageResponse {
    message: string;
}

export interface BanResponse {
    accountStatus: AccountStatus;
}
