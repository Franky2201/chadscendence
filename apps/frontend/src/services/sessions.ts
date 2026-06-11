import api from "./api";
import type { RoomSession } from "@chad/types";

export const startSession = async (code: string): Promise<RoomSession> => {
    const res = await api.post<RoomSession>(`/rooms/${code}/start`);
    return res.data;
};

export const getSession = async (code: string): Promise<RoomSession> => {
    const res = await api.get<RoomSession>(`/sessions/${code}`);
    return res.data;
};

export const submitRoundAnswer = async (
    code: string,
    roundIndex: number,
    answer: unknown,
) => {
    const res = await api.post(
        `/sessions/${code}/rounds/${roundIndex}/answer`,
        { answer },
    );
    return res.data;
};
