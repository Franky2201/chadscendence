import api from "./api";
import type { GameSession, CreateGameSessionDto } from "@chad/types";

export const createSession = async (
    data: CreateGameSessionDto,
): Promise<GameSession> => {
    const res = await api.post<GameSession>("/sessions", data);
    return res.data;
};

export const getSession = async (id: string): Promise<GameSession> => {
    const res = await api.get<GameSession>(`/sessions/${id}`);
    return res.data;
};

export const startRound = async (
    id: string,
    roundIndex: number,
): Promise<GameSession> => {
    const res = await api.post<GameSession>(
        `/sessions/${id}/rounds/${roundIndex}/start`,
    );
    return res.data;
};

export const submitRoundAnswer = async (
    id: string,
    roundIndex: number,
    answer: unknown,
) => {
    const res = await api.post(`/sessions/${id}/rounds/${roundIndex}/answer`, {
        answer,
    });
    return res.data;
};

export const finishGame = async (id: string) => {
    const res = await api.post<{ session: GameSession; isRanked: boolean }>(
        `/sessions/${id}/finish`,
    );
    return res.data;
};
