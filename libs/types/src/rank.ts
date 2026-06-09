export interface Rank {
    id: string;
    name: string;
    ratingMin: number;
    icon: string;
}

export interface CreateRankPayload {
    name: string;
    ratingMin: number;
    icon: string;
}

export interface UpdateRankPayload {
    name?: string;
    ratingMin?: number;
    icon?: string;
}
