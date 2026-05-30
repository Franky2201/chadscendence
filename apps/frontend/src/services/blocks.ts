import api from "./api";

export interface BlockedUser {
    id: string;
    username: string;
    avatarUrl: string;
}

export const getBlockedUsers = async (): Promise<BlockedUser[]> => {
    const res = await api.get<BlockedUser[]>("/blocks");
    return res.data;
};

export const blockUser = async (
    userId: string,
): Promise<{ message: string }> => {
    const res = await api.post<{ message: string }>(`/blocks/${userId}`);
    return res.data;
};

export const unblockUser = async (
    userId: string,
): Promise<{ message: string }> => {
    const res = await api.delete<{ message: string }>(`/blocks/${userId}`);
    return res.data;
};
