import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import type { JwtPayload } from "@chad/types";
import type { RoomSession, Room } from "@chad/types";
import { RoomsGateway } from "./rooms.gateway";

@Injectable()
export class RoomsService {
    private readonly rooms = new Map<string, Room>();
    private readonly sessions = new Map<string, RoomSession>();
    private readonly sessionTimers = new Map<string, NodeJS.Timeout>();

    constructor(private readonly roomsGateway: RoomsGateway) { }

    createRoom(user: JwtPayload, selectedGames: string[] = []): Room {
        const code = this.generateUniqueCode();
        const now = new Date().toISOString();

        const room: Room = {
            code,
            hostId: user.sub,
            selectedGames: this.normalizeGames(selectedGames),
            players: [
                {
                    id: user.sub,
                    username: user.username,
                    host: true,
                    status: "online",
                },
            ],
            createdAt: now,
            updatedAt: now,
        };

        this.rooms.set(code, room);
        return this.cloneRoom(room);
    }

    getRoom(code: string): Room {
        return this.cloneRoom(this.getRoomOrThrow(code));
    }

    joinRoom(code: string, user: JwtPayload): Room {
        const room = this.getRoomOrThrow(code);
        const existingPlayer = room.players.find(
            (player) => player.id === user.sub,
        );

        if (existingPlayer) {
            existingPlayer.username = user.username;
            existingPlayer.host = room.hostId === user.sub;
            existingPlayer.status = "online";
        } else {
            room.players.push({
                id: user.sub,
                username: user.username,
                host: room.hostId === user.sub,
                status: "online",
            });
        }

        room.updatedAt = new Date().toISOString();
        return this.cloneRoom(room);
    }

    updateSelectedGames(code: string, userId: string, selectedGames: string[]): Room {
        const room = this.getRoomOrThrow(code);

        if (room.hostId !== userId) {
            throw new ForbiddenException(
                "Seul l'hôte peut modifier les mini-jeux de la salle.",
            );
        }

        room.selectedGames = this.normalizeGames(selectedGames);
        room.updatedAt = new Date().toISOString();

        return this.cloneRoom(room);
    }

    leaveRoom(code: string, userId: string) {
        const room = this.getRoomOrThrow(code);
        const playerIndex = room.players.findIndex(
            (player) => player.id === userId,
        );

        if (playerIndex === -1) {
            return { message: "Room left" };
        }

        const [removedPlayer] = room.players.splice(playerIndex, 1);

        if (room.players.length === 0) {
            this.rooms.delete(code);
            return { message: "Room left" };
        }

        if (removedPlayer.host) {
            room.hostId = room.players[0].id;
            room.players = room.players.map((player, index) => ({
                ...player,
                host: index === 0,
            }));
        }

        room.updatedAt = new Date().toISOString();
        return { message: "Room left" };
    }

    private getRoomOrThrow(code: string) {
        const normalizedCode = this.normalizeCode(code);
        const room = this.rooms.get(normalizedCode);

        if (!room) {
            throw new NotFoundException("Room introuvable.");
        }

        return room;
    }

    private normalizeCode(code: string) {
        return code.trim().toUpperCase();
    }

    private normalizeGames(selectedGames: string[]) {
        return [...new Set(selectedGames.map((game) => game.trim()))].filter(
            (game) => game.length > 0,
        );
    }

    private generateUniqueCode() {
        let code = "";

        do {
            code = Math.random().toString(36).substring(2, 8).toUpperCase();
        } while (this.rooms.has(code));

        return code;
    }

    private cloneRoom(room: Room): Room {
        return {
            ...room,
            selectedGames: [...room.selectedGames],
            players: room.players.map((player) => ({ ...player })),
        };
    }

    getSession(code: string): RoomSession {
        return this.cloneSession(this.getSessionOrThrow(code));
    }

    private getSessionOrThrow(code: string) {
        const normalizedCode = this.normalizeCode(code);
        const session = this.sessions.get(normalizedCode);

        if (!session) {
            throw new NotFoundException("Aucune partie active pour cette salle.");
        }

        return session;
    }

    private cloneSession(session: RoomSession): RoomSession {
        return {
            ...session,
            games: [...session.games],
            rounds: session.rounds.map((round) => ({
                ...round,
                prompt: round.prompt ? { ...round.prompt } : null,
                scores: { ...round.scores },
            })),
            players: session.players.map((player) => ({
                ...player,
                scoresByRound: [...player.scoresByRound],
            })),
        };
    }
}
