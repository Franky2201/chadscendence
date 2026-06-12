import {
    Injectable,
    BadRequestException,
    ForbiddenException,
    NotFoundException,
} from "@nestjs/common";
import { GamesService } from "../games/games.service";
import { UsersService } from "../users/users.service";
import { GameAdapterRegistry } from "./engine/game-adapter.registry";
import { ScoreAggregator } from "./engine/score-aggregator";
import type { GameSession, GameSessionRound, Game } from "@chad/types";
import { RatingService } from "src/rating/rating.service";

@Injectable()
export class SessionsService {
    private readonly sessions = new Map<string, GameSession>();
    private readonly gameAdapterRegistry = new GameAdapterRegistry();
    private readonly scoreAggregator = new ScoreAggregator();
    private readonly EXPECTED_SCORES: Record<string, number> = {
        math: 10,
        clicker: 50,
        reaction: 5,
    };

    constructor(
        private readonly gamesService: GamesService,
        private readonly usersService: UsersService,
        private readonly ratingService: RatingService,
    ) {}

    async createSession(
        userId: string,
        selectedGameIds: string[],
        repetitions: number,
    ): Promise<GameSession> {
        const activeGames = await this.gamesService.getActiveGames();
        const gameCatalog = new Map(activeGames.map((g) => [g.id, g]));

        const selectedGames = selectedGameIds
            .map((id) => gameCatalog.get(id))
            .filter((g): g is Game => Boolean(g));

        if (selectedGames.length === 0) {
            throw new BadRequestException("Aucun jeu valide sélectionné.");
        }

        const sessionId = Math.random()
            .toString(36)
            .substring(2, 10)
            .toUpperCase();
        const rounds: GameSessionRound[] = [];

        let roundIndex = 0;
        for (let r = 0; r < repetitions; r++) {
            for (const game of selectedGames) {
                rounds.push({
                    index: roundIndex++,
                    game,
                    score: 0,
                    prompt: null,
                });
            }
        }

        const session: GameSession = {
            id: sessionId,
            userId,
            status: "running",
            startedAt: new Date().toISOString(),
            currentRoundIndex: 0,
            totalScore: 0,
            games: selectedGames,
            rounds,
        };

        this.sessions.set(sessionId, session);
        return this.cloneSession(session);
    }

    async startRound(id: string, userId: string, roundIndex: number) {
        const session = this.getSessionOrThrow(id, userId);

        if (session.status !== "running")
            throw new BadRequestException("La partie est terminée.");
        if (roundIndex !== session.currentRoundIndex)
            throw new BadRequestException("Ce n'est pas le round actuel.");

        const round = session.rounds[roundIndex];
        const gameId = String((round.game as unknown as { id: string }).id);

        try {
            const adapter = this.gameAdapterRegistry.getAdapter(gameId);
            const problem = await this.gamesService.sendCommand<void, unknown>(
                gameId,
                adapter.getProblemCommand,
            );
            round.prompt = adapter.normalizePrompt(problem);
        } catch {
            round.prompt = { kind: "text", prompt: "Play" };
        }

        round.startedAt = new Date().toISOString();
        return this.cloneSession(session);
    }

    async submitRoundAnswer(
        id: string,
        userId: string,
        roundIndex: number,
        answer: unknown,
    ) {
        const session = this.getSessionOrThrow(id, userId);

        if (session.status !== "running")
            throw new BadRequestException("La partie est terminée.");
        if (roundIndex !== session.currentRoundIndex)
            throw new BadRequestException("Mauvais index de round.");

        const round = session.rounds[roundIndex];
        if (round.closedAt)
            throw new BadRequestException("Ce round est déjà clôturé.");

        const gameId = String((round.game as unknown as { id: string }).id);

        const adapter = this.gameAdapterRegistry.getAdapter(gameId);
        const prompt = round.prompt ?? { kind: "action", prompt: "Play" };
        const payload = adapter.buildSubmitPayload(answer, prompt);

        const result = await this.gamesService.sendCommand<unknown, unknown>(
            gameId,
            adapter.submitAnswerCommand,
            payload,
        );

        const scoreObtained = adapter.extractScore(result);
        this.scoreAggregator.applyRoundScore(session, round, scoreObtained);

        return {
            addedScore: scoreObtained,
            totalRoundScore: round.score,
            result,
        };
    }

    closeRound(id: string, userId: string, roundIndex: number) {
        const session = this.getSessionOrThrow(id, userId);

        if (session.status !== "running")
            throw new BadRequestException("La partie est terminée.");
        if (roundIndex !== session.currentRoundIndex)
            return this.cloneSession(session);

        const round = session.rounds[roundIndex];
        round.closedAt = new Date().toISOString();

        if (session.currentRoundIndex < session.rounds.length - 1) {
            session.currentRoundIndex++;
        }

        return this.cloneSession(session);
    }

    async finishGame(id: string, userId: string) {
        const session = this.getSessionOrThrow(id, userId);

        if (session.status === "finished") return this.cloneSession(session);

        const currentRound = session.rounds[session.currentRoundIndex];
        if (!currentRound.closedAt)
            currentRound.closedAt = new Date().toISOString();

        session.status = "finished";
        session.endedAt = new Date().toISOString();

        let expectedTotalScore = 0;
        for (const r of session.rounds) {
            const gameId = String((r.game as unknown as { id: string }).id);
            const par = this.EXPECTED_SCORES[gameId] || 10;
            expectedTotalScore += par;
        }

        const dbUser = await this.usersService.findById(userId);
        const currentRating = dbUser?.rating ?? 1000;

        const { newRating, delta } = this.ratingService.calculateSoloRating(
            currentRating,
            session.totalScore,
            expectedTotalScore,
        );

        session.ratingDelta = delta;

        await this.usersService.updateRating(userId, newRating);

        return this.cloneSession(session);
    }

    getSessionOrThrow(id: string, userId: string): GameSession {
        const session = this.sessions.get(id.trim().toUpperCase());
        if (!session) throw new NotFoundException("Partie introuvable.");
        if (session.userId !== userId)
            throw new ForbiddenException(
                "Cette partie ne vous appartient pas.",
            );
        return session;
    }

    private cloneSession(session: GameSession): GameSession {
        return {
            ...session,
            games: session.games.map(
                (g: {
                    id: string;
                    name: string;
                    description: string;
                    port: number;
                }): Game => ({
                    id: g.id,
                    name: g.name,
                    description: g.description,
                    port: g.port,
                }),
            ),
            rounds: session.rounds.map((r) => ({
                ...r,
                prompt: r.prompt ? { ...r.prompt } : null,
            })),
        };
    }
}
