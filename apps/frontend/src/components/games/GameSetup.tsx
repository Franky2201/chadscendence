import { Link } from "react-router-dom";
import { Card, Button } from "../ui";
import { Header } from "../Header";
import { GameList } from "./GameList";
import { useTheme } from "../../contexts/ThemeContext";
import type { Game } from "../../services/games";
import type { ItemColor } from "../ui/unified";

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
    const { theme } = useTheme();

    const canStart = !isSubmitting && !isLoading && selectedGames.length > 0;
    const startButtonColor: ItemColor = canStart
        ? (theme as ItemColor)
        : "grey";

    return (
        <>
            <Header />
            <Card className="mb-20 relative max-w-5xl mt-10 mx-auto space-y-8 flex flex-col">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">
                        Configuration de la partie
                    </h1>
                    <Link to="/">
                        <Button color="grey">Retour</Button>
                    </Link>
                </div>

                <div className="flex flex-col gap-4">
                    <label className="font-bold text-lg">
                        Nombre de répétitions de la séquence : {repetitions}
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="5"
                        value={repetitions}
                        onChange={(e) =>
                            onRepetitionsChange(Number(e.target.value))
                        }
                        className="w-full max-w-md cursor-pointer"
                    />
                </div>

                <GameList
                    games={games}
                    selectedGames={selectedGames}
                    maxRounds={10}
                    isHost={true}
                    isSubmitting={isSubmitting}
                    roomLoading={isLoading}
                    onToggleGame={onToggleGame}
                />

                <div className="mt-8 pt-6 border-t border-gray-100 w-full">
                    <Button
                        onClick={onLaunch}
                        color={startButtonColor}
                        disabled={!canStart}
                        size="large"
                        className="w-full"
                    >
                        {selectedGames.length > 0
                            ? "Lancer la partie"
                            : "Sélectionnez un jeu"}
                    </Button>
                </div>
            </Card>
        </>
    );
}
