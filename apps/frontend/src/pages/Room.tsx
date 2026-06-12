import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Window, Card, Button, Input } from "../components/ui";
import { Header } from "../components/Header";
import { useRoom } from "../hooks/useRoom";
import { useRoomSession } from "../hooks/useRoomSession";
import { GameList } from "../components/rooms/GameList";
import { PlayerList } from "../components/rooms/PlayerList";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import { submitRoundAnswer } from "../services/sessions";
import type { ItemColor } from "../components/ui/unified";
import type { RoomSession, SessionRoundPrompt } from "@chad/types";

const maxRounds = 10;
const maxPlayers = 10;

export default function RoomPage() {
    const { code } = useParams();
    const { t } = useTranslation();

    // 1. Les données du Lobby
    const roomData = useRoom(code);

    // 2. Le Cerveau du Temps Réel (Le Game Engine)
    const { viewState, prompt, endsAt, session } = useRoomSession(code);

    if (roomData.authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white bg-slate-900">
                {t("loading")}...
            </div>
        );
    }

    if (!roomData.user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white gap-4">
                <h1 className="text-3xl font-bold">{t("room.denied.title")}</h1>
                <p>{t("room.denied.message")}</p>
                <Link to="/">
                    <Button>{t("room.denied.back")}</Button>
                </Link>
            </div>
        );
    }

    // 🚀 LA MACHINE À ÉTATS : On aiguille vers le bon écran !
    switch (viewState) {
        case "playing":
            return (
                <PlayingView
                    prompt={prompt!}
                    endsAt={endsAt!}
                    code={code!}
                    session={session!}
                />
            );
        case "inter_round":
            return <InterRoundLeaderboard session={session!} />;
        case "podium":
            return <PodiumView session={session!} />;
        case "lobby":
        default:
            return <LobbyView roomData={roomData} code={code} />;
    }
}

// =========================================================
// 1. LE LOBBY (Ton code exact, juste encapsulé)
// =========================================================
function LobbyView({
    roomData,
    code,
}: {
    roomData: ReturnType<typeof useRoom>;
    code: string | undefined;
}) {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const {
        room,
        roomLoading,
        error,
        isSubmitting,
        games,
        isHost,
        selectedGames,
        enrichedPlayers,
        toggleGame,
        shareLobbyLink,
        handleLeaveLobby,
        launch,
    } = roomData;

    const canStart =
        !isSubmitting && !roomLoading && selectedGames.length > 0 && isHost;
    const startButtonColor: ItemColor = canStart
        ? (theme as ItemColor)
        : "grey";

    console.log("ÉTAT DU BOUTON START :", {
        canStart,
        isSubmitting,
        roomLoading,
        nbJeux: selectedGames.length,
        isHost,
    });

    return (
        <Window>
            <Header />
            <Card className="mb-20 relative max-w-5xl min-w-1/2 mt-10 mx-auto space-y-8 flex flex-col">
                {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {!code ? (
                    <div className="space-y-4 py-16 text-center">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {t("room.noCode.title")}
                        </h2>
                        <Link to="/">
                            <Button>{t("room.noCode.back")}</Button>
                        </Link>
                    </div>
                ) : !room && roomLoading ? (
                    <div className="py-20 text-center text-gray-500">
                        {t("room.loading")}
                    </div>
                ) : !room ? (
                    <div className="py-16 text-center text-gray-500">
                        {t("room.notFound")}
                    </div>
                ) : (
                    <div className="space-y-8 flex flex-col flex-1">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                    {t("room.codeLabel")}
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
                                        {t("room.copyLink")}
                                    </Button>
                                </div>
                            </div>
                            <Button
                                onClick={() => void handleLeaveLobby()}
                                color="grey"
                                disabled={isSubmitting || roomLoading}
                            >
                                {t("room.leaveRoom")}
                            </Button>
                        </div>

                        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
                            <GameList
                                games={games}
                                selectedGames={selectedGames}
                                maxRounds={maxRounds}
                                isHost={isHost}
                                isSubmitting={isSubmitting}
                                roomLoading={roomLoading}
                                onToggleGame={(id) => void toggleGame(id)}
                            />
                            <PlayerList
                                players={enrichedPlayers}
                                maxPlayers={maxPlayers}
                            />
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 w-full">
                            <Button
                                onClick={launch}
                                color={startButtonColor}
                                disabled={!canStart}
                                size="large"
                                className="w-full"
                            >
                                {isHost
                                    ? selectedGames.length > 0
                                        ? t("room.startGame")
                                        : t("room.selectOneGame")
                                    : t("room.waitingHost")}
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </Window>
    );
}

// =========================================================
// 2. LE JEU EN COURS (Générique pour TOUS les jeux)
// =========================================================
function PlayingView({
    prompt,
    endsAt,
    code,
    session,
}: {
    prompt: SessionRoundPrompt;
    endsAt: string;
    code: string;
    session: RoomSession;
}) {
    const { theme } = useTheme();
    const [timeLeft, setTimeLeft] = useState<number>(20);
    const [answer, setAnswer] = useState<string>("");
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // Timer local
    useEffect(() => {
        const interval = setInterval(() => {
            const diff = Math.max(0, new Date(endsAt).getTime() - Date.now());
            setTimeLeft(Math.ceil(diff / 1000));
        }, 500);
        return () => clearInterval(interval);
    }, [endsAt]);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (hasSubmitted) return;

        setHasSubmitted(true);
        try {
            // On parse la réponse selon le type de jeu (ex: Math -> nombre)
            const finalAnswer =
                prompt.kind === "number"
                    ? Number(answer)
                    : prompt.kind === "action"
                      ? prompt.actionValue
                      : answer;
            await submitRoundAnswer(
                code,
                session.currentRoundIndex,
                finalAnswer,
            );
        } catch (err) {
            console.error(err);
            setHasSubmitted(false);
        }
    };

    return (
        <Window>
            <Header />
            <Card className="mt-10 max-w-2xl mx-auto flex flex-col items-center p-10 text-center">
                <div className="text-4xl font-bold mb-4 bg-slate-100 rounded-full w-20 h-20 flex items-center justify-center border-4 border-slate-300">
                    {timeLeft}
                </div>

                <h2 className="text-3xl font-black mb-8">{prompt.prompt}</h2>

                {hasSubmitted ? (
                    <div className="text-xl text-green-500 font-bold animate-pulse">
                        Réponse envoyée ! En attente des autres joueurs...
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-md flex flex-col gap-4"
                    >
                        {prompt.kind === "number" && (
                            <Input
                                type="number"
                                autoFocus
                                required
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Votre réponse numérique..."
                                className="w-full text-2xl py-4"
                            />
                        )}
                        {prompt.kind === "text" && (
                            <Input
                                type="text"
                                autoFocus
                                required
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Tapez ici..."
                                className="w-full text-2xl py-4"
                            />
                        )}

                        <Button
                            type="submit"
                            color={theme}
                            size="large"
                            className="w-full mt-4"
                        >
                            {prompt.actionLabel || "Valider"}
                        </Button>
                    </form>
                )}
            </Card>
        </Window>
    );
}

// =========================================================
// 3. LE LEADERBOARD INTER-ROUND (Kahoot style)
// =========================================================
function InterRoundLeaderboard({ session }: { session: RoomSession }) {
    // Trier les joueurs par score total
    const sortedPlayers = [...session.players].sort(
        (a, b) => b.totalScore - a.totalScore,
    );

    return (
        <Window>
            <Header />
            <Card className="mt-10 max-w-3xl mx-auto text-center p-8">
                <h1 className="text-4xl font-black mb-2 uppercase">
                    Classement Actuel
                </h1>
                <p className="text-gray-500 mb-8 animate-pulse">
                    Préparez-vous pour la suite...
                </p>

                <div className="flex flex-col gap-3">
                    {sortedPlayers.map((p, index) => (
                        <div
                            key={p.id}
                            className="flex justify-between items-center bg-slate-100 p-4 rounded-xl text-xl font-bold"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-2xl w-8 text-left text-slate-400">
                                    #{index + 1}
                                </span>
                                <span className="text-slate-400">
                                    {p.username}
                                </span>
                            </div>
                            <span className="text-yellow-500">
                                {p.totalScore} pts
                            </span>
                        </div>
                    ))}
                </div>
            </Card>
        </Window>
    );
}

// =========================================================
// 4. LE PODIUM FINAL
// =========================================================
function PodiumView({ session }: { session: RoomSession }) {
    const sortedPlayers = [...session.players].sort(
        (a, b) => b.totalScore - a.totalScore,
    );

    return (
        <Window>
            <Header />
            <Card className="mt-10 max-w-3xl mx-auto text-center p-12">
                <h1 className="text-6xl font-black mb-6 text-yellow-400">
                    🏆 TERMINÉ 🏆
                </h1>

                {sortedPlayers.map((p: any, index) => (
                    <div key={p.id} className="flex justify-between w-full">
                        <span>
                            {index + 1}. {p.username}
                        </span>
                        <span>
                            Score: {p.totalScore} | Elo:{" "}
                            {Math.round(p.newRating)}
                            <span
                                className={
                                    p.ratingDelta > 0
                                        ? "text-green-500"
                                        : "text-red-500"
                                }
                            >
                                ({p.ratingDelta > 0 ? "+" : ""}
                                {Math.round(p.ratingDelta)})
                            </span>
                        </span>
                    </div>
                ))}

                <Link to="/">
                    <Button size="large" color="grey">
                        Retour à l'accueil
                    </Button>
                </Link>
            </Card>
        </Window>
    );
}
