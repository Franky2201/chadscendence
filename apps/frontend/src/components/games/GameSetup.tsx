import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, Button } from "../ui";
import { Header } from "../Header";
import { useTheme } from "../../contexts/ThemeContext";
import type { Game } from "../../services/games";
import { getItemColorStyle, type ItemColor } from "../ui/unified";

interface GameSetupProps {
    games: Game[];
    selectedGames: string[];
    repetitions: number;
    isLoading: boolean;
    isSubmitting: boolean;
    onToggleGame: (id: string) => void;
    onRepetitionsChange: (val: number) => void;
    onLaunch: () => void;
}

export function GameSetup({
    games,
    selectedGames,
    repetitions,
    isLoading,
    isSubmitting,
    onToggleGame,
    onRepetitionsChange,
    onLaunch,
}: GameSetupProps) {
    const { t } = useTranslation();
    const { theme } = useTheme();

    const canStart = !isSubmitting && !isLoading && selectedGames.length > 0;
    const startButtonColor: ItemColor = canStart
        ? (theme as ItemColor)
        : "grey";

    const colors: ItemColor[] = [
        "purple",
        "pink",
        "blue",
        "orange",
        "green",
        "red",
    ];

    return (
        <>
            <Header />
            <Card className="mb-20 relative max-w-5xl mt-10 mx-auto flex flex-col p-8 gap-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">{t("game.title")}</h1>
                    <Link to="/">
                        <Button color="grey">{t("game.back")}</Button>
                    </Link>
                </div>

                <div className="space-y-4">
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                            {t("room.gameList.label") || "Mini-jeux"}
                        </p>
                        <h2 className="text-2xl font-bold">
                            {t("game.selection")}
                        </h2>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-10 text-gray-400 text-sm animate-pulse">
                            {t("game.loading")}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {games.map((g, index) => {
                                const color = colors[index % colors.length];
                                const isSelected = selectedGames.includes(g.id);

                                return (
                                    <div
                                        key={g.id}
                                        className={`transition-all duration-200 ${
                                            isSelected
                                                ? "rounded-2xl transform scale-[1.02]"
                                                : "opacity-80 grayscale-[20%]"
                                        }`}
                                    >
                                        <Button
                                            color={color}
                                            onClick={() => onToggleGame(g.id)}
                                            className="h-full w-full min-h-[120px]"
                                            disabled={isSubmitting || isLoading}
                                        >
                                            <div className="flex flex-col items-start w-full p-2">
                                                <div className="flex justify-between items-center w-full mb-2">
                                                    <span className="text-xl font-bold">
                                                        {g.name}
                                                    </span>
                                                    {isSelected && (
                                                        <span className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center text-white text-sm shadow-sm">
                                                            ✓
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm font-normal opacity-90 text-left line-clamp-3 leading-tight whitespace-normal break-words">
                                                    {g.description}
                                                </p>
                                            </div>
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-4 bg-slate-500/10 p-6 rounded-2xl border border-slate-500/20 mt-2">
                    <div className="flex justify-between items-center">
                        <label className="font-bold text-lg opacity-90">
                            {t("game.sequence")}
                        </label>
                        <span className="text-xl font-black text-white-500 px-4 py-1 bg-white-500/10 rounded-lg">
                            x{repetitions}
                        </span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={repetitions}
                        disabled={isSubmitting || isLoading}
                        onChange={(e) =>
                            onRepetitionsChange(Number(e.target.value))
                        }
                        className="w-full cursor-pointer h-2 bg-white/30 rounded-lg appearance-none accent-[var(--ui-color)]"
                        style={{ ...getItemColorStyle(theme) }}
                    />
                </div>

                <div className="pt-4 border-t border-slate-500/20 w-full mt-2">
                    <Button
                        onClick={onLaunch}
                        color={startButtonColor}
                        disabled={!canStart}
                        size="large"
                        className="w-full"
                    >
                        {selectedGames.length > 0
                            ? t("game.start")
                            : t("game.needMoreGames")}
                    </Button>
                </div>
            </Card>
        </>
    );
}
