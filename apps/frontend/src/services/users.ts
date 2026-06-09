import api from "./api";
import type {
    User,
    UpdateMePayload,
    AdminUpdateDataPayload,
    LeaderboardItem,
    UserSearchResult,
    PublicUserProfile,
    UserListItem,
    BasicMessageResponse,
    BanResponse,
} from "@chad/types";

export const getPublicProfile = async (
    username: string,
): Promise<PublicUserProfile> => {
    const res = await api.get<PublicUserProfile>(`/users/profile/${username}`);
    return res.data;
};

export const getMe = async (): Promise<User> => {
    const res = await api.get<User>("/users/me");
    return res.data;
};

export const updateMe = async (data: UpdateMePayload): Promise<User> => {
    const res = await api.patch<User>("/users/me", data);
    return res.data;
};

export const uploadAvatar = async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post<User>("/users/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

export const uploadAvatarForUser = async (
    userId: string,
    file: File,
): Promise<UserListItem> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post<UserListItem>(
        `/users/${userId}/avatar`,
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
        },
    );
    return res.data;
};

export const deleteMe = async (): Promise<BasicMessageResponse> => {
    const res = await api.delete<BasicMessageResponse>("/users/me");
    return res.data;
};

export const getLeaderboard = async (
    count: number,
): Promise<LeaderboardItem[]> => {
    const res = await api.get<LeaderboardItem[]>(
        `/users/leaderboard?count=${count}`,
    );
    return res.data;
};

export const searchUsers = async (
    query: string,
): Promise<UserSearchResult[]> => {
    if (!query) return [];
    const res = await api.get<UserSearchResult[]>(`/users/search?q=${query}`);
    return res.data;
};

export const getAllUsers = async (): Promise<UserListItem[]> => {
    const res = await api.get<UserListItem[]>("/users");
    return res.data;
};

export const banUser = async (userId: string): Promise<BanResponse> => {
    const res = await api.patch<BanResponse>(`/users/${userId}/ban`);
    return res.data;
};

export const adminUpdateUser = async (
    userId: string,
    data: AdminUpdateDataPayload,
): Promise<UserListItem> => {
    const res = await api.patch<UserListItem>(`/users/${userId}`, data);
    return res.data;
};
