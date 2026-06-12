import { Injectable } from "@nestjs/common";

export interface SoloRatingResult {
    newRating: number;
    delta: number;
}

@Injectable()
export class RatingService {
    private readonly K_FACTOR = 40;
    private readonly MAX_GAIN = 100;
    private readonly MAX_LOSS = -50;

    calculateSoloRating(
        currentRating: number,
        totalScore: number,
        expectedTotalScore: number,
    ): SoloRatingResult {
        let performanceRatio = 1.0;

        if (expectedTotalScore > 0) {
            performanceRatio = totalScore / expectedTotalScore;
        }

        let ratingDelta = Math.round((performanceRatio - 1.0) * this.K_FACTOR);
        ratingDelta = Math.max(
            this.MAX_LOSS,
            Math.min(this.MAX_GAIN, ratingDelta),
        );

        const newRating = Math.max(0, currentRating + ratingDelta);

        return {
            newRating,
            delta: ratingDelta,
        };
    }
}
