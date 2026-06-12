import { io } from "socket.io-client";

const backendUrl = undefined;

export const socket = io(backendUrl, {
    withCredentials: true,
    autoConnect: false,
    transports: ["websocket"],
});
