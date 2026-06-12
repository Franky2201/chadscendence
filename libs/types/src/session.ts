import { Game } from "./game";

export type SessionInputKind = "number" | "action" | "text";

export interface SessionRoundPrompt {
	kind: SessionInputKind;
	prompt: string;
	roundToken?: string;
	actionLabel?: string;
	actionValue?: string;
}

export interface GameSessionRound {
	index: number;
	game: Game;
	score: number;
	prompt: SessionRoundPrompt | null;
	startedAt?: string | Date;
	endsAt?: string | Date;
	closedAt?: string | Date;
}

export interface GameSession {
	id: string;
	userId: string;
	status: "running" | "finished";
	startedAt: string | Date;
	endedAt?: string | Date;
	currentRoundIndex: number;
	totalScore: number;
	ratingDelta?: number;
	games: Game[];
	rounds: GameSessionRound[];
}

export interface CreateGameSessionDto {
	selectedGames: string[];
	repetitions: number;
}
