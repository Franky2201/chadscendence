import { useEffect, useState } from "react";
import { roomsSocket } from "../services/socket";
import type { RoomSession, SessionRoundPrompt } from "@chad/types";
import { getSession } from "../services/sessions";

export type SessionViewState = "lobby" | "playing" | "inter_round" | "podium";

export function useRoomSession(code: string | undefined) {
    const [session, setSession] = useState<RoomSession | null>(null);
    const [prompt, setPrompt] = useState<SessionRoundPrompt | null>(null);
    const [endsAt, setEndsAt] = useState<string | null>(null);
    const [viewState, setViewState] = useState<SessionViewState>("lobby");

    useEffect(() => {
        if (!code) return;

        const safeCode = code.toUpperCase();

        getSession(safeCode)
            .then((existingSession) => {
                setSession(existingSession);
                if (existingSession.status === "finished")
                    setViewState("podium");
                else if (existingSession.status === "running")
                    setViewState("inter_round");
            })
            .catch(() => {
                setViewState("lobby");
            });

        roomsSocket.on("connect", () =>
            console.log("🟢 SOCKET ROOM CONNECTÉ !"),
        );
        roomsSocket.on("connect_error", (err) =>
            console.error("🔴 ERREUR SOCKET ROOM:", err),
        );

        roomsSocket.connect();
        roomsSocket.emit("joinRoomChannel", safeCode);
        console.log(`📡 En écoute sur le canal Socket : ${safeCode}`);

        const onSessionUpdated = (data: RoomSession) => {
            console.log("⚡️ EVENT: session_updated", data);
            setSession(data);
            if (data.status === "finished") setViewState("podium");
        };

        const onRoundStarted = (payload: {
            prompt: SessionRoundPrompt;
            endsAt: string;
        }) => {
            console.log("⚡️ EVENT: round_started", payload);
            setPrompt(payload.prompt);
            setEndsAt(payload.endsAt);
            setViewState("playing");
        };

        const onRoundEnded = (data: RoomSession) => {
            console.log("⚡️ EVENT: round_ended", data);
            setSession(data);
            setViewState("inter_round");
        };

        roomsSocket.on("session_updated", onSessionUpdated);
        roomsSocket.on("round_started", onRoundStarted);
        roomsSocket.on("round_ended", onRoundEnded);

        return () => {
            roomsSocket.emit("leaveRoomChannel", safeCode);
            roomsSocket.off("connect");
            roomsSocket.off("connect_error");
            roomsSocket.off("session_updated", onSessionUpdated);
            roomsSocket.off("round_started", onRoundStarted);
            roomsSocket.off("round_ended", onRoundEnded);
            roomsSocket.disconnect();
        };
    }, [code]);

    return { session, prompt, endsAt, viewState };
}
