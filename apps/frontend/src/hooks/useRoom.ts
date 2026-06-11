import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import {
    getRoom,
    updateRoomGames,
    leaveRoom,
    type Room,
    type RoomPlayer,
} from "../services/rooms";
import { getGames, type Game } from "../services/games";
import { startSession } from "../services/sessions";
import { getAllUsers } from "../services/users";
import type { UserListItem } from "@chad/types";

export type EnrichedPlayer = RoomPlayer & {
    avatarUrl?: string;
    leaderboardRank: number | null;
    rating: number;
};

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

    const loadRoom = useCallback(
        async (showLoading = true) => {
            if (!code) return;
            if (showLoading) setRoomLoading(true);
            try {
                const nextRoom = await getRoom(code);
                setRoom(nextRoom);
                setError(null);
            } catch {
                if (showLoading) {
                    setRoom(null);
                    setError(t("room.error.load"));
                }
            } finally {
                if (showLoading) setRoomLoading(false);
            }
        },
        [code, t],
    );

    useEffect(() => {
        if (!code || !user) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
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

    const toggleGame = async (id: string) => {
        if (!room || room.hostId !== user?.id) return;

        const maxRounds = 10;
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
        const lobbyLink = `${window.location.origin}/room/${lobbyCode}`;
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

    const launch = async () => {
        if (!room || room.hostId !== user?.id) return;
        setIsSubmitting(true);
        setError(null);

        try {
            await startSession(room.code);
        } catch {
            setError(t("room.error.start"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const isHost = room?.hostId === user?.id;
    const selectedGames = room?.selectedGames ?? [];

    const enrichedPlayers: EnrichedPlayer[] = (room?.players ?? []).map(
        (player) => {
            const userIndex = users.findIndex((u) => u.id === player.id);
            const userData = userIndex !== -1 ? users[userIndex] : null;
            return {
                ...player,
                avatarUrl: userData?.avatarUrl,
                leaderboardRank: userIndex !== -1 ? userIndex + 1 : null,
                rating: userData?.rating ?? 0,
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
        selectedGames,
        enrichedPlayers,
        toggleGame,
        shareLobbyLink,
        handleLeaveLobby,
        launch,
    };
}
