import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, Button } from "../components/ui";
import type { ItemColor } from "../components/ui/unified";
import { useAuth } from "../contexts/AuthContext";
import {
    getRoom,
    leaveRoom,
    updateRoomGames,
    type Room,
} from "../services/rooms";
import { useChat } from "../contexts/ChatContext";
import { useTranslation } from "react-i18next";

const GAMES = [
    { id: "0", name: "Game", type: "memory" },
    { id: "1", name: "Game", type: "reflex" },
    { id: "2", name: "Game", type: "puzzle" },
    { id: "3", name: "Game", type: "culture" },
    { id: "4", name: "Game", type: "reflex" },
    { id: "5", name: "Game", type: "puzzle" },
    { id: "6", name: "Game", type: "memory" },
    { id: "7", name: "Game", type: "puzzle" },
    { id: "8", name: "Game", type: "memory" },
    { id: "9", name: "Game", type: "puzzle" },
    { id: "10", name: "Game", type: "culture" },
    { id: "11", name: "Game", type: "reflex" },
    { id: "12", name: "Game", type: "culture" },
    { id: "13", name: "Game", type: "puzzle" },
    { id: "14", name: "Game", type: "reflex" },
];

const testStyles: Record<string, string> = {
    memory: "red",
    reflex: "blue",
    puzzle: "orange",
    culture: "green",
    default: "grey",
};

const maxRounds = 10;
const maxPlayers = 10;

export default function LobbyCreator() {
    const navigate = useNavigate();
    const { code } = useParams();
    const { user, isLoading } = useAuth();
    const [room, setRoom] = useState<Room | null>(null);
    const [roomLoading, setRoomLoading] = useState(Boolean(code));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const selectedGames = room?.selectedGames ?? [];
    const players = room?.players ?? [];
    const lobbyCode = room?.code ?? code?.toUpperCase() ?? null;
    const isHost = room?.hostId === user?.id;
    const { t } = useTranslation();
    const { openPanel } = useChat();

    useEffect(() => {
        if (!code || !user) {
            return;
        }

        let isCancelled = false;

        const loadRoom = async () => {
            setRoomLoading(true);
            setError(null);

            try {
                const nextRoom = await getRoom(code);

                if (isCancelled) return;

                setRoom(nextRoom);
            } catch {
                if (isCancelled) return;

                setRoom(null);
                setError("Impossible de charger cette salle.");
            } finally {
                if (!isCancelled) {
                    setRoomLoading(false);
                }
            }
        };

        void loadRoom();

        return () => {
            isCancelled = true;
        };
    }, [code, user]);

    if (isLoading)
        return (
            <div className="min-h-screen flex items-center justify-center text-white bg-slate-900">
                Chargement...
            </div>
        );
    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white gap-4">
                <h1 className="text-3xl font-bold">Accès refusé</h1>
                <p>Veuillez vous connecter pour lancer une partie.</p>
                <Link to="/">
                    <Button>Retour à l'accueil</Button>
                </Link>
            </div>
        );
    }

    const toggleGame = async (id: string) => {
        if (!room || !isHost) {
            return;
        }

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
            setError("Impossible de mettre à jour les mini-jeux.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const shareLobbyLink = async () => {
        if (!lobbyCode) return;
        const lobbyLink = `${window.location.origin}/room/${lobbyCode}`;
        await navigator.clipboard?.writeText(lobbyLink);
    };

    const leaveLobby = async () => {
        if (!room) return;

        setIsSubmitting(true);
        setError(null);
        try {
            await leaveRoom(room.code);
            navigate("/");
        } catch {
            setError("Impossible de quitter la salle.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const launch = () => {
        // TODO
        console.log("Launching game");
    };

    return (
        <div
            className="relative min-h-screen w-full overflow-hidden bg-slate-900 bg-cover bg-center text-white font-sans"
            style={{ backgroundImage: "url('/background.png')" }}
        >
            <div className="absolute inset-0 bg-linear-to-r from-slate-900/90 via-slate-900/50 to-slate-900/90" />
            <div className="relative z-10 flex flex-col">
                <div className="flex w-full justify-between items-center p-10">
                    <Link to="/">
                        <img
                            src="/logo.png"
                            alt="WhoIsChad"
                            className="w-48 object-contain drop-shadow-2xl transition-transform hover:scale-105"
                        />
                    </Link>
                    <div className="flex items-center gap-6">
                        <h1 className="text-4xl font-black tracking-wide drop-shadow-xl">
                            Lobby
                        </h1>
                        <Link to="/">
                            <Button>Retour</Button>
                        </Link>
                    </div>
                </div>
            </div>

            <Card className="mb-20 relative max-w-5xl min-w-1/2 -mt-10 mx-auto space-y-8">
                {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {!code ? (
                    <div className="space-y-4 py-16 text-center">
                        <h2 className="text-2xl font-bold text-gray-900">
                            No room code provided
                        </h2>
                        <p className="text-gray-500">
                            Use the multiplayer button on the home page to
                            create a room or join one with a code.
                        </p>
                        <Link to="/">
                            <Button>Back home</Button>
                        </Link>
                    </div>
                ) : !room && roomLoading ? (
                    <div className="py-20 text-center text-gray-500">
                        Loading room...
                    </div>
                ) : !room ? (
                    <div className="py-16 text-center text-gray-500">
                        Room not found.
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                    Room code
                                </p>
                                <div className="flex flex-wrap items-center gap-3">
                                    <code className="bg-gray-100 text-gray-700 rounded-lg px-3 py-2 font-mono tracking-[0.3em] text-lg">
                                        {room.code}
                                    </code>
                                    <Button
                                        onClick={() => void shareLobbyLink()}
                                        color="grey"
                                        disabled={isSubmitting || roomLoading}
                                    >
                                        Copy invite link
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Button
                                    onClick={leaveLobby}
                                    color="grey"
                                    disabled={isSubmitting || roomLoading}
                                >
                                    Leave room
                                </Button>
                                <Button
                                    onClick={launch}
                                    color="red"
                                    disabled={
                                        isSubmitting ||
                                        roomLoading ||
                                        selectedGames.length === 0 ||
                                        !isHost
                                    }
                                    className="text-black disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    Start Game
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
                            <Card className="space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                            Minigames
                                        </p>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            Choose the game list
                                        </h2>
                                    </div>
                                    <span className="text-sm text-gray-400">
                                        {selectedGames.length} / {maxRounds}
                                    </span>
                                </div>

                                <Card className="m-5">
                                    <div className="grid grid-cols-3 gap-5">
                                        {GAMES.map((g) => {
                                            const test =
                                                testStyles[g.type] ??
                                                testStyles.default;
                                            return (
                                                <Button
                                                    key={g.id}
                                                    color={test as ItemColor}
                                                    onClick={() =>
                                                        void toggleGame(g.id)
                                                    }
                                                    size="small"
                                                    className="flex flex-col"
                                                    disabled={
                                                        isSubmitting ||
                                                        roomLoading ||
                                                        !isHost
                                                    }
                                                >
                                                    {g.name}
                                                    <p className="text-xs m-1">
                                                        {g.type[0].toUpperCase() +
                                                            g.type
                                                                .substring(1)
                                                                .toLowerCase()}
                                                    </p>
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </Card>

                                {selectedGames.length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase">
                                            Selected games
                                        </p>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {selectedGames.map((id, i) => {
                                                const game = GAMES.find(
                                                    (entry) => entry.id === id,
                                                );
                                                if (!game) return null;
                                                return (
                                                    <button
                                                        key={id}
                                                        onClick={() =>
                                                            void toggleGame(id)
                                                        }
                                                        disabled={!isHost}
                                                        className="flex items-center gap-2 bg-pink-50 border border-pink-200 rounded-full px-3 py-1 text-sm text-pink-500 hover:bg-pink-100 transition disabled:cursor-not-allowed disabled:opacity-70"
                                                    >
                                                        {i + 1}
                                                        {". "}
                                                        {game.name}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </Card>

                            <Card className="space-y-4">
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                        Players
                                    </p>
                                    <div className="text-sm text-gray-500">
                                        {players.length} / {maxPlayers}
                                    </div>
                                </div>
                                <Button
                                    color="green"
                                    onClick={openPanel}
                                    size="medium"
                                    className="my-2"
                                >
                                    {t("home.profile.friends")}
                                </Button>
                                <div className="flex flex-wrap gap-2">
                                    {players.map((player) => (
                                        <div
                                            key={player.id}
                                            className="flex items-center gap-2 bg-pink-50 border border-pink-200 rounded-full px-3 py-1 text-sm text-pink-500"
                                        >
                                            <span>{player.username}</span>
                                            {player.host && (
                                                <span className="text-xs">
                                                    Host
                                                </span>
                                            )}
                                            <div
                                                className={`w-2 h-2 rounded-full ${player.status === "online" ? "bg-green-500" : "bg-orange-500"}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
