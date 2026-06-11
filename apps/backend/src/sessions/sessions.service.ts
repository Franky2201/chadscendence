import {
    Injectable,
    BadRequestException,
    ForbiddenException,
} from "@nestjs/common";
import { RoomsGateway } from "../rooms/rooms.gateway";
import { GamesService } from "../games/games.service";
import { GameAdapterRegistry } from "./engine/game-adapter.registry";
import { ScoreAggregator } from "./engine/score-aggregator";
import type { RoomSession, Room, Game, RoomSessionRound } from "@chad/types";
import { UsersService } from "src/users/users.service";
import { RatingService } from "src/rating/rating.service";

@Injectable()
export class SessionsService {
    private readonly sessions = new Map<string, RoomSession>();
    private readonly sessionTimers = new Map<string, NodeJS.Timeout>();

    private readonly roundDurationMs = 20_000;
    private readonly interRoundPauseMs = 5_000;
    private readonly gameAdapterRegistry = new GameAdapterRegistry();
    private readonly scoreAggregator = new ScoreAggregator();

    constructor(
        private readonly roomsGateway: RoomsGateway,
        private readonly gamesService: GamesService,
        private readonly usersService: UsersService,
        private readonly ratingService: RatingService,
    ) {}

    startGame(room: Room, selectedGames: Game[]): RoomSession {
        const normalizedCode = room.code;
        const now = new Date().toISOString();

        const session: RoomSession = {
            roomCode: room.code,
            status: "running",
            startedAt: now,
            currentRoundIndex: 0,
            games: selectedGames,
            rounds: selectedGames.map((game, index) => ({
                index,
                game,
                scores: {},
                prompt: null,
            })),
            players: room.players.map((player) => ({
                id: player.id,
                username: player.username,
                totalScore: 0,
                scoresByRound: [],
            })),
        };

        this.sessions.set(normalizedCode, session);
        this.roomsGateway.broadcastSessionUpdate(
            normalizedCode,
            this.cloneSession(session),
        );
        this.scheduleCurrentRound(normalizedCode);

        return this.cloneSession(session);
    }

    private scheduleCurrentRound(normalizedCode: string) {
        const session = this.sessions.get(normalizedCode);
        if (!session || session.status !== "running") return;

        const round = session.rounds[session.currentRoundIndex];
        if (!round) return;

        this.clearSessionTimer(normalizedCode);
        round.prompt = null;

        void this.loadRoundPrompt(session, round).then(() => {
            round.endsAt = new Date(
                Date.now() + this.roundDurationMs,
            ).toISOString();

            const safePrompt = round.prompt ?? {
                kind: "text" as const,
                prompt: "Get ready!",
            };

            this.roomsGateway.broadcastRoundStarted(
                normalizedCode,
                safePrompt,
                round.endsAt,
            );

            const timeout = setTimeout(() => {
                this.closeCurrentRoundByCode(normalizedCode);
            }, this.roundDurationMs);

            this.sessionTimers.set(normalizedCode, timeout);
        });
    }

    private async loadRoundPrompt(
        session: RoomSession,
        round: RoomSessionRound,
    ) {
        try {
            const adapter = this.gameAdapterRegistry.getAdapter(round.game.id);
            const problem = await this.gamesService.sendCommand<void, unknown>(
                round.game.id,
                adapter.getProblemCommand,
            );
            round.prompt = adapter.normalizePrompt(problem);
        } catch {
            round.prompt = { kind: "text", prompt: "Error loading prompt" };
        }

        if (
            session.status !== "running" ||
            session.rounds[session.currentRoundIndex]?.index !== round.index
        )
            return;
    }

    private closeCurrentRoundByCode(normalizedCode: string) {
        const session = this.sessions.get(normalizedCode);
        if (!session || session.status !== "running") return;

        const round = session.rounds[session.currentRoundIndex];
        if (!round || round.closedAt) return;

        this.clearSessionTimer(normalizedCode);
        round.closedAt = new Date().toISOString();

        this.scoreAggregator.applyRound(session.players, round);
        this.roomsGateway.broadcastRoundEnded(
            normalizedCode,
            this.cloneSession(session),
        );

        if (session.currentRoundIndex >= session.rounds.length - 1) {
            session.status = "finished";
            session.endedAt = new Date().toISOString();
            return;
        }

        setTimeout(() => {
            session.currentRoundIndex += 1;
            this.scheduleCurrentRound(normalizedCode);
        }, this.interRoundPauseMs);
    }

    private clearSessionTimer(normalizedCode: string) {
        const timer = this.sessionTimers.get(normalizedCode);
        if (timer) {
            clearTimeout(timer);
            this.sessionTimers.delete(normalizedCode);
        }
    }

    getSessionOrThrow(code: string): RoomSession {
        const session = this.sessions.get(code.trim().toUpperCase());
        if (!session) throw new BadRequestException("Aucune partie active.");
        return session;
    }

    cloneSession(session: RoomSession): RoomSession {
        return {
            ...session,
            games: Array.from(session.games),
            rounds: session.rounds.map((r) => ({
                ...r,
                scores: { ...r.scores },
                prompt: r.prompt ? { ...r.prompt } : null,
            })),
            players: session.players.map((p) => ({
                ...p,
                scoresByRound: Array.from(p.scoresByRound),
            })),
        };
    }

    async submitRoundAnswer(
        code: string,
        userId: string,
        roundIndex: number,
        answer: unknown,
    ) {
        const session = this.getSessionOrThrow(code);

        if (session.status !== "running")
            throw new BadRequestException("La partie est terminée.");
        if (roundIndex !== session.currentRoundIndex)
            throw new BadRequestException(
                "Vous ne pouvez soumettre que pour le round actuel.",
            );

        const player = session.players.find(
            (p: { id: string }) => p.id === userId,
        );
        if (!player)
            throw new ForbiddenException(
                "Vous ne participez pas à cette partie.",
            );

        const round = session.rounds[roundIndex];
        if (round.closedAt)
            throw new BadRequestException("Le round est déjà clôturé.");
        if (round.scores[userId] !== undefined)
            throw new BadRequestException("Réponse déjà soumise.");

        const adapter = this.gameAdapterRegistry.getAdapter(round.game.id);
        const prompt = round.prompt ?? { kind: "action", prompt: "Play" };
        const payload = adapter.buildSubmitPayload(answer, prompt);

        const result = await this.gamesService.sendCommand<unknown, unknown>(
            round.game.id,
            adapter.submitAnswerCommand,
            payload,
        );

        const score = adapter.extractScore(result);
        round.scores[userId] = score;

        const hasAllAnswers = session.players.every(
            (p: { id: string }) => round.scores[p.id] !== undefined,
        );
        if (hasAllAnswers) {
            this.closeCurrentRoundByCode(session.roomCode);
        }

        return { roundScore: score, result };
    }

    closeCurrentRoundManual(code: string) {
        const session = this.getSessionOrThrow(code);
        this.closeCurrentRoundByCode(session.roomCode);
        return { success: true };
    }

    async finishGame(code: string) {
        const session = this.getSessionOrThrow(code);

        if (session.status !== "finished") {
            throw new BadRequestException(
                "Terminez tous les rounds avant de finaliser.",
            );
        }

        if (session.scorePersistedAt) {
            return {
                session: this.cloneSession(session),
                persistedPlayers: [],
            };
        }

        const isMultiplayer = session.players.length > 1;
        // 👇 On importe le type User ou on utilise un type générique au lieu de any[]
        let persistedPlayers: unknown[] = [];

        if (isMultiplayer) {
            const currentUsers = await Promise.all(
                session.players.map((p) => this.usersService.findById(p.id)),
            );

            const ratingPlayersInput = session.players.map(
                (sessionPlayer, index) => {
                    const dbUser = currentUsers[index];

                    // 🔒 FIX 1 : On gère le cas 'null' avec une valeur par défaut (ex: 1000 Elo)
                    const currentRating = dbUser?.rating ?? 1000;

                    return {
                        id: sessionPlayer.id,
                        username: sessionPlayer.username,
                        rating: currentRating,
                        score: sessionPlayer.totalScore,
                    };
                },
            );

            const totalRounds = session.games.length;

            const ratingResults = this.ratingService.calculateRatings(
                ratingPlayersInput,
                totalRounds,
            );

            persistedPlayers = await Promise.all(
                ratingResults.map((result, index) => {
                    const playerId = ratingPlayersInput[index].id;
                    return this.usersService.updateRating(
                        playerId,
                        result.newRating,
                    );
                }),
            );

            // 🔒 FIX 2 : On supprime les 'any' en utilisant une intersection de types locale
            session.players.forEach((p, index) => {
                // On indique à TypeScript qu'on "étend" l'objet temporairement
                const enrichedPlayer = p as typeof p & {
                    ratingDelta: number;
                    newRating: number;
                };
                enrichedPlayer.ratingDelta = ratingResults[index].delta;
                enrichedPlayer.newRating = ratingResults[index].newRating;
            });
        }

        // On marque la partie comme comptabilisée pour éviter les requêtes multiples
        session.scorePersistedAt = new Date().toISOString();

        return {
            session: this.cloneSession(session),
            persistedPlayers,
            isRanked: isMultiplayer,
        };
    }
}
