import { io } from "socket.io-client";

const backendUrl = import.meta.env.PROD
    ? undefined
    : import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const socket = io(backendUrl, {
    withCredentials: true,
    autoConnect: false,
    transports: ["websocket"],
});

const roomsNamespaceUrl = backendUrl ? `${backendUrl}/rooms` : "/rooms";
export const roomsSocket = io(roomsNamespaceUrl, {
    withCredentials: true,
    autoConnect: false,
    transports: ["websocket"],
});
