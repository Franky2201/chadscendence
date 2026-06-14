import api from "./api";

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
    repetitions: number;
    status: "waiting" | "playing";
    startedAt: string | null;
    players: RoomPlayer[];
    createdAt: string;
    updatedAt: string;
}

export const createRoom = async (
    selectedGames: string[] = [],
): Promise<Room> => {
    const res = await api.post<Room>("/rooms", { selectedGames });
    return res.data;
};

export const getRoom = async (code: string): Promise<Room> => {
    const res = await api.get<Room>(`/rooms/${code}`);
    return res.data;
};

export const joinRoom = async (code: string): Promise<Room> => {
    const res = await api.post<Room>(`/rooms/${code}/join`);
    return res.data;
};

export const updateRoomGames = async (
    code: string,
    selectedGames: string[],
): Promise<Room> => {
    const res = await api.patch<Room>(`/rooms/${code}/games`, {
        selectedGames,
    });
    return res.data;
};

export const launchRoom = async (
    code: string,
    selectedGames: string[],
    repetitions: number,
): Promise<Room> => {
    const res = await api.post<Room>(`/rooms/${code}/launch`, {
        selectedGames,
        repetitions,
    });
    return res.data;
};

export const resetRoom = async (code: string): Promise<Room> => {
    const res = await api.post<Room>(`/rooms/${code}/reset`);
    return res.data;
};

export const leaveRoom = async (code: string): Promise<{ message: string }> => {
    const res = await api.delete<{ message: string }>(`/rooms/${code}/leave`);
    return res.data;
};

export const heartbeatRoom = async (code: string): Promise<void> => {
    await api.post(`/rooms/${code}/heartbeat`);
};
