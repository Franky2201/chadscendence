import api from "./api";
import type { Rank, CreateRankPayload, UpdateRankPayload } from "@chad/types";

export const getRanks = async (): Promise<Rank[]> => {
    const res = await api.get<Rank[]>("/ranks");
    return res.data;
};

export const getRank = async (id: string): Promise<Rank> => {
    const res = await api.get<Rank>(`/ranks/${id}`);
    return res.data;
};

export const createRank = async (data: CreateRankPayload): Promise<Rank> => {
    const res = await api.post<Rank>("/ranks", data);
    return res.data;
};

export const updateRank = async (
    id: string,
    data: UpdateRankPayload,
): Promise<Rank> => {
    const res = await api.patch<Rank>(`/ranks/${id}`, data);
    return res.data;
};

export const deleteRank = async (id: string): Promise<void> => {
    await api.delete<void>(`/ranks/${id}`);
};
