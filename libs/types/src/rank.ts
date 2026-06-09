export interface CreateRank {
    name: string;
    ratingMin: number;
    icon: string;
}

export interface UpdateRank {
    name?: string;
    ratingMin?: number;
    icon?: string;
}

export interface Rank {
    id: string;
    name: string;
    ratingMin: number;
    icon: string;
}
