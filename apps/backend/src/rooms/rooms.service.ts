import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import type { JwtPayload } from "../common/dto/auth.dto";

export interface RoomPlayer {
    id: string;
    username: string;
    host: boolean;
    status: "online" | "pending";
}

export interface Room {
    code: string;
    hostId: string;
    selectedGames: string[];
    players: RoomPlayer[];
    createdAt: string;
    updatedAt: string;
}

@Injectable()
export class RoomsService {
    private readonly rooms = new Map<string, Room>();

    createRoom(user: JwtPayload, selectedGames: string[] = []) {
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

    getRoom(code: string) {
        return this.cloneRoom(this.getRoomOrThrow(code));
    }

    joinRoom(code: string, user: JwtPayload) {
        const room = this.getRoomOrThrow(code);
        const existingPlayer = room.players.find((player) => player.id === user.sub);

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

    updateSelectedGames(
        code: string,
        userId: string,
        selectedGames: string[],
    ) {
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
}
