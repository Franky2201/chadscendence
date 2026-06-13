import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import {
    getRoom,
    updateRoomGames,
    launchRoom,
    leaveRoom,
    // heartbeatRoom,
    type Room,
    type RoomPlayer,
} from "../services/rooms";
import { getGames, type Game } from "../services/games";
import type { UserListItem } from "@chad/types";
import { getAllUsers } from "../services/users";
import { useGameSession } from "../hooks/useGameSession";

export type EnrichedPlayer = RoomPlayer & {
    avatarUrl?: string;
    leaderboardRank: number | null;
    score: number;
};

const maxRounds = 10;

export function useRoom(code: string | undefined) {
    const { user, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [room, setRoom] = useState<Room | null>(null);
    const [roomLoading, setRoomLoading] = useState(Boolean(code));
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [games, setGames] = useState<Game[]>([]);
    const [users, setUsers] = useState<UserListItem[]>([]);

    const gameSession = useGameSession();
    const { launchGame, viewState } = gameSession;

    const isHost = room?.hostId === user?.id;
    const launchedAtRef = useRef<string | null>(
        sessionStorage.getItem(`room_launched_${code}`) 
    );

    const loadRoom = useCallback(
        async (showLoading = true) => {
            if (!code) return;
            if (showLoading) setRoomLoading(true);
            try {
                const nextRoom = await getRoom(code);
                setRoom(nextRoom);
                setError(null);
                return nextRoom;
            } catch {
                if (showLoading) {
                    setRoom(null);
                    setError(t("room.error.load"));
                }
                return null;
            } finally {
                if (showLoading) setRoomLoading(false);
            }
        },
        [code, t],
    );

    useEffect(() => {
        if (!code || !user) return;

        void loadRoom(true);

        const interval = setInterval(() => {
            void loadRoom(false);
        }, 3000);

        return () => clearInterval(interval);
    }, [code, user, loadRoom]);

    useEffect(() => {
        const fetchGamesAndUsers = async () => {
            try {
                const [gamesData, usersData] = await Promise.all([
                    getGames(),
                    getAllUsers(),
                ]);
                setGames(gamesData);
                setUsers(usersData.sort((a, b) => b.rating - a.rating));
            } catch (err) {
                console.error("Failed to load games or users", err);
            }
        };
        void fetchGamesAndUsers();
    }, []);

    // useEffect(() => {
    //     if (!code || !user) return;
    //     const interval = setInterval(() => {
    //         void heartbeatRoom(code);
    //     }, 5000);
    //     return () => clearInterval(interval);
    // }, [code, user])

    // When the room transitions to "playing" with a new startedAt,
    // every player (host included) launches their own local game session,
    // using the same flow as SoloGamePage.
    useEffect(() => {
        if (!room) return;
        if (room.status !== "playing" || !room.startedAt) return;
        if (launchedAtRef.current === room.startedAt) return;
        if (room.selectedGames.length === 0) return;

        launchedAtRef.current = room.startedAt;
        sessionStorage.setItem(`room_launched_${code}`, room.startedAt);
        void launchGame(room.selectedGames, room.repetitions);
    }, [room, launchGame]);


    const toggleGame = async (id: string) => {
        if (!room || room.hostId !== user?.id) return;

        const selectedGames = room.selectedGames;
        const nextSelectedGames = selectedGames.includes(id)
            ? selectedGames.filter((gameId) => gameId !== id)
            : selectedGames.length >= maxRounds
              ? selectedGames
              : [...selectedGames, id];

        setIsSubmitting(true);
        setError(null);

        try {
            const nextRoom = await updateRoomGames(
                room.code,
                nextSelectedGames,
            );
            setRoom(nextRoom);
        } catch {
            setError(t("room.error.updateGames"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const shareLobbyLink = async () => {
        const lobbyCode = room?.code ?? code?.toUpperCase() ?? null;
        if (!lobbyCode) return;
        const lobbyLink = `${lobbyCode}`;
        await navigator.clipboard?.writeText(lobbyLink);
    };

    const handleLeaveLobby = async () => {
        if (!room) return;
        setIsSubmitting(true);
        setError(null);
        try {
            await leaveRoom(room.code);
            navigate("/");
        } catch {
            setError(t("room.error.leave"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const launch = async (repetitions: number) => {
        if (!room || room.hostId !== user?.id) return;
        if (room.selectedGames.length === 0) return;

        setIsSubmitting(true);
        setError(null);
        try {
            const nextRoom = await launchRoom(
                room.code,
                room.selectedGames,
                repetitions,
            );
            setRoom(nextRoom);
        } catch {
            setError(t("room.error.launch"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedGames = room?.selectedGames ?? [];
    const isPlaying = room?.status === "playing" || viewState !== "setup";

    const enrichedPlayers: EnrichedPlayer[] = (room?.players ?? []).map(
        (player) => {
            const userIndex = users.findIndex((u) => u.id === player.id);
            const userData = userIndex !== -1 ? users[userIndex] : null;
            return {
                ...player,
                avatarUrl: userData?.avatarUrl,
                leaderboardRank: userIndex !== -1 ? userIndex + 1 : null,
                score: userData?.rating ?? 0,
            };
        },
    );

    return {
        room,
        roomLoading,
        error,
        isSubmitting,
        games,
        users,
        authLoading,
        user,
        isHost,
        isPlaying,
        selectedGames,
        enrichedPlayers,
        toggleGame,
        shareLobbyLink,
        handleLeaveLobby,
        launch,
        gameSession,
    };
}