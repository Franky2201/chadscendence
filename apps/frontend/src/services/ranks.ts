import api from "./api";
import type { Rank, CreateRank, UpdateRank } from "@chad/types";

export const getRanks = async () => {
    const res = await api.get<Rank[]>("/ranks");
    return res.data;
};

export const getRank = async (id: string) => {
    const res = await api.get<Rank>(`/ranks/${id}`);
    return res.data;
};

export const createRank = async (data: CreateRank) => {
    const res = await api.post<Rank>("/ranks", data);
    return res.data;
};

export const updateRank = async (id: string, data: UpdateRank) => {
    const res = await api.patch<Rank>(`/ranks/${id}`, data);
    return res.data;
};

export const deleteRank = async (id: string) => {
    const res = await api.delete<void>(`/ranks/${id}`);
    return res.data;
};
