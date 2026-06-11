import { RoomSessionPlayer, RoomSessionRound } from "@chad/types";

export class ScoreAggregator {
    applyRound(players: RoomSessionPlayer[], round: RoomSessionRound) {
        for (const player of players) {
            const roundScore = round.scores[player.id] ?? 0;
            player.scoresByRound[round.index] = roundScore;

            player.totalScore = player.scoresByRound.reduce(
                (sum, value) => sum + (Number.isFinite(value) ? value : 0),
                0,
            );
        }
    }
}
