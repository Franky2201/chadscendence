import api from "./api";
import type { Game } from "@chad/types";

export type { Game };

export const getGames = async (): Promise<Game[]> => {
    const response = await api.get<Game[]>("/games");
    return response.data;
};

export const sendGameCommand = async <T = unknown, R = unknown>(
    gameId: string,
    cmd: string,
    payload?: T,
): Promise<R> => {
    // Proxy command to the game microservice via the backend
    const response = await api.post<R>(`/games/${gameId}/command`, {
        cmd,
        payload,
    });
    return response.data;
};
