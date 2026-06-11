export interface RatingPlayer {
    username: string;
    rating: number;
    score: number;
}

export interface RatingResult {
    username: string;
    newRating: number;
    delta: number;
}
