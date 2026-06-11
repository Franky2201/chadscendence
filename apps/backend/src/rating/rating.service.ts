import { Injectable } from "@nestjs/common";
import { RatingPlayer, RatingResult } from "./rating.types";

@Injectable()
export class RatingService {
    private winEstimation(ratingA: number, ratingB: number): number {
        const result = 1 / (1 + Math.pow(10, -(ratingA - ratingB) / 600));

        return Math.max(0, Math.min(1, result));
    }

    private scoreDiff(scoreA: number, scoreB: number): number {
        return 0.5 * Math.tanh((scoreA - scoreB) / 15) + 0.5;
    }

    calculateRatings(players: RatingPlayer[], rounds: number): RatingResult[] {
        const n = players.length;

        const deltas = new Array<number>(n).fill(0);

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (i === j) continue;

                const estimation = this.winEstimation(
                    players[i].rating,
                    players[j].rating,
                );

                const scoreDiff = this.scoreDiff(
                    players[i].score,
                    players[j].score,
                );

                const ratingDelta =
                    ((0.9 * rounds) / (n - 1)) * (scoreDiff - estimation);

                deltas[i] += ratingDelta;
            }
        }

        return players.map((player, index) => ({
            username: player.username,
            newRating: Math.max(0, player.rating + deltas[index]),
            delta: deltas[index],
        }));
    }
}
