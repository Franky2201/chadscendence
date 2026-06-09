import api from "./api";
import type {
    Friend,
    FriendRequest,
    SentRequest,
    MessageResponse,
} from "@chad/types";

export const getFriends = async () => {
    const res = await api.get<Friend[]>("/friends");
    return res.data;
};

export const getPendingRequests = async () => {
    const res = await api.get<FriendRequest[]>("/friends/requests");
    return res.data;
};

export const getSentRequests = async () => {
    const res = await api.get<SentRequest[]>("/friends/requests/sent");
    return res.data;
};

export const sendFriendRequest = async (addresseeId: string) => {
    const res = await api.post<MessageResponse>(
        `/friends/request/${addresseeId}`,
    );
    return res.data;
};

export const acceptFriendRequest = async (friendshipId: string) => {
    const res = await api.patch<MessageResponse>(
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
