import { useState, useEffect } from "react";
import { getGames, type Game } from "../services/games";

export function useGameSetup() {
    const [games, setGames] = useState<Game[]>([]);
    const [selectedGames, setSelectedGames] = useState<string[]>([]);
    const [repetitions, setRepetitions] = useState<number>(1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getGames()
            .then(setGames)
            .catch(() => setGames([]))
            .finally(() => setIsLoading(false));
    }, []);

    const toggleGame = (id: string) => {
        setSelectedGames((prev) =>
            prev.includes(id)
                ? prev.filter((gameId) => gameId !== id)
                : [...prev, id],
        );
    };

    return {
        games,
        selectedGames,
        repetitions,
        setRepetitions,
        isLoading,
        toggleGame,
    };
}
