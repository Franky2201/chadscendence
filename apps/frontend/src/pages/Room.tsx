import { Link, useParams } from "react-router-dom";
import { Window, Card, Button } from "../components/ui";
import { Header } from "../components/Header";
import { useRoom } from "../hooks/useRoom";
import { GameList } from "../components/rooms/GameList";
import { PlayerList } from "../components/rooms/PlayerList";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import type { ItemColor } from "../components/ui/unified";

const maxRounds = 10;
const maxPlayers = 10;

export default function LobbyCreator() {
    const { code } = useParams();
    const { theme } = useTheme();
    const { t } = useTranslation();

    const {
        room,
        roomLoading,
        error,
        isSubmitting,
        games,
        authLoading,
        user,
        isHost,
        selectedGames,
        enrichedPlayers,
        toggleGame,
        shareLobbyLink,
        handleLeaveLobby,
        launch,
    } = useRoom(code);

    if (authLoading)
        return (
            <div className="min-h-screen flex items-center justify-center text-white bg-slate-900">
                {t("loading")}...
            </div>
        );

    if (!user) {
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

    const canStart =
        !isSubmitting && !roomLoading && selectedGames.length > 0 && isHost;
    const startButtonColor: ItemColor = canStart
        ? (theme as ItemColor)
        : "grey";

    return (
        <Window>
            <Header />

            <Card className="mb-20 relative max-w-5xl min-w-1/2 -mt-10 mx-auto space-y-8 flex flex-col">
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
                        <p className="text-gray-500">
                            {t("room.noCode.message")}
                        </p>
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

                            <div className="flex flex-wrap gap-3">
                                <Button
                                    onClick={() => void handleLeaveLobby()}
                                    color="grey"
                                    disabled={isSubmitting || roomLoading}
                                >
                                    {t("room.leaveRoom")}
                                </Button>
                            </div>
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

                        {/* Start Game button at the very bottom taking full width */}
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
