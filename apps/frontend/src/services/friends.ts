import api from "./api";

export interface Friend {
    friendshipId: string;
    id: string;
    username: string;
    avatarUrl: string;
    status: "online" | "offline";
}

export interface FriendRequest {
    friendshipId: string;
    requesterId: string;
    username: string;
    avatarUrl: string;
}

export interface SentRequest {
    friendshipId: string;
    addresseeId: string;
    username: string;
    avatarUrl: string;
}

export const getFriends = async (): Promise<Friend[]> => {
    const res = await api.get<Friend[]>("/friends");
    return res.data;
};

export const getPendingRequests = async (): Promise<FriendRequest[]> => {
    const res = await api.get<FriendRequest[]>("/friends/requests");
    return res.data;
};

export const getSentRequests = async (): Promise<SentRequest[]> => {
    const res = await api.get<SentRequest[]>("/friends/requests/sent");
    return res.data;
};

export const sendFriendRequest = async (
    addresseeId: string,
): Promise<{ message: string }> => {
    const res = await api.post<{ message: string }>(
        `/friends/request/${addresseeId}`,
    );
    return res.data;
};

export const acceptFriendRequest = async (
    friendshipId: string,
): Promise<{ message: string }> => {
    const res = await api.patch<{ message: string }>(
        `/friends/accept/${friendshipId}`,
    );
    return res.data;
};

export const removeFriend = async (
    friendshipId: string,
): Promise<{ message: string }> => {
    const res = await api.delete<{ message: string }>(
        `/friends/${friendshipId}`,
    );
    return res.data;
};
