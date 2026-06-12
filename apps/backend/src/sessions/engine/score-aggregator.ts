import { GameSession, GameSessionRound } from "@chad/types";

export class ScoreAggregator {
    applyRoundScore(session: GameSession, round: GameSessionRound, score: number) {
        round.score = score;
        session.totalScore = session.rounds.reduce(
            (sum, r) => sum + (Number.isFinite(r.score) ? r.score : 0),
            0
        );
    }
}
