import { Card, Button } from "../ui";
import type { ItemColor } from "../ui/unified";
import type { Game } from "../../services/games";
import { useTranslation } from "react-i18next";

interface GameListProps {
    games: Game[];
    selectedGames: string[];
    maxRounds: number;
    isHost: boolean;
    isSubmitting: boolean;
    roomLoading: boolean;
    onToggleGame: (id: string) => void;
}

export function GameList({
    games,
    selectedGames,
    maxRounds,
    isHost,
    isSubmitting,
    roomLoading,
    onToggleGame,
}: GameListProps) {
    const { t } = useTranslation();
    const colors: ItemColor[] = [
        "purple",
        "pink",
        "blue",
        "orange",
        "green",
        "red",
    ];

    return (
        <Card className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                        {t("room.gameList.label")}
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {t("room.gameList.title")}
                    </h2>
                </div>
            </div>

            <Card className="p-3 bg-slate-50 border border-slate-100">
                {games.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">
                        {t("room.gameList.loading")}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {games.map((g, index) => {
                            const color = colors[index % colors.length];
                            const isSelected = selectedGames.includes(g.id);

                            return (
                                <div
                                    key={g.id}
                                    className={`h-full ${isSelected ? "rounded-xl" : "opacity-80 grayscale-[20%]"}`}
                                >
                                    <Button
                                        color={color}
                                        onClick={() => onToggleGame(g.id)}
                                        size="small"
                                        className="h-full w-full"
                                        disabled={
                                            isSubmitting ||
                                            roomLoading ||
                                            !isHost
                                        }
                                    >
                                        <div className="flex flex-col items-start w-full p-1">
                                            <div className="flex justify-between items-center w-full mb-1">
                                                <span className="font-bold">
                                                    {g.name}
                                                </span>
                                                {isSelected && (
                                                    <span className="w-4 h-4 bg-white/30 rounded-full flex items-center justify-center text-white text-[10px]">
                                                        ✓
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] font-normal opacity-90 text-left line-clamp-2 leading-tight whitespace-normal break-words">
                                                {g.description}
                                            </p>
                                        </div>
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>

            {selectedGames.length > 0 && (
                <div className="pt-2">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3">
                        {t("room.gameList.selectedOrder")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {selectedGames.map((id, i) => {
                            const game = games.find((entry) => entry.id === id);
                            if (!game) return null;
                            return (
                                <button
                                    key={`${id}-${i}`}
                                    onClick={() => onToggleGame(id)}
                                    disabled={!isHost}
                                    className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-200 transition shadow-sm disabled:cursor-not-allowed disabled:opacity-70 group"
                                >
                                    <span className="w-5 h-5 rounded-full bg-slate-300 flex items-center justify-center text-xs font-bold text-slate-700">
                                        {i + 1}
                                    </span>
                                    <span className="font-medium">
                                        {game.name}
                                    </span>
                                    {isHost && (
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-slate-400">
                                            ×
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </Card>
    );
}