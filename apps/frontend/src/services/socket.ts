import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const socket = io(backendUrl, {
    withCredentials: true,
    autoConnect: false,
    transports: ["websocket"],
});
