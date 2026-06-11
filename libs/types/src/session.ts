import { Game } from "./game";

export type SessionInputKind = "number" | "action" | "text";

export interface SessionRoundPrompt {
	kind: SessionInputKind;
	prompt: string;
	roundToken?: string;
	actionLabel?: string;
	actionValue?: string;
}

export interface RoomSessionPlayer {
	id: string;
	username: string;
	totalScore: number;
	scoresByRound: number[];
}

export interface RoomSessionRound {
	index: number;
	game: Game;
	scores: Record<string, number>;
	prompt: SessionRoundPrompt | null;
	closedAt?: string | Date;
	endsAt?: string | Date;
}

export interface RoomSession {
	roomCode: string;
	status: "running" | "finished";
	startedAt: string | Date;
	endedAt?: string | Date;
	currentRoundIndex: number;
	games: Game[];
	rounds: RoomSessionRound[];
	players: RoomSessionPlayer[];
	scorePersistedAt?: string | Date;
}