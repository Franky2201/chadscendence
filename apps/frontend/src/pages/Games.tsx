import { Window } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { useGameSession } from "../hooks/useGameSession";
import { useGameSetup } from "../hooks/useGameSetup";
import { GameSetup } from "../components/games/GameSetup";
import { GamePlaying } from "../components/games/GamePlaying";
import { GameInterRound } from "../components/games/GameInterRound";
import { GamePodium } from "../components/games/GamePodium";

export default function SoloGamePage() {
    const { t } = useTranslation();
    const { user, isLoading: authLoading } = useAuth();

    const setup = useGameSetup();

    const {
        session,
        prompt,
        viewState,
        timeLeft,
        isSubmitting,
        launchGame,
        submitAnswer,
    } = useGameSession();

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white bg-slate-900">
                {t("loading")}...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
                <h1 className="text-3xl font-bold">Accès refusé</h1>
            </div>
        );
    }

    const renderView = () => {
        switch (viewState) {
            case "playing":
                return (
                    <GamePlaying
                        prompt={prompt!}
                        timeLeft={timeLeft}
                        onSubmit={submitAnswer}
                    />
                );
            case "inter_round":
                return <GameInterRound />;
            case "podium":
                return <GamePodium session={session!} />;
            case "setup":
            default:
                return (
                    <GameSetup
                        games={setup.games}
                        selectedGames={setup.selectedGames}
                        repetitions={setup.repetitions}
                        isLoading={setup.isLoading}
                        isSubmitting={isSubmitting}
                        onToggleGame={setup.toggleGame}
                        onRepetitionsChange={setup.setRepetitions}
                        onLaunch={() =>
                            void launchGame(
                                setup.selectedGames,
                                setup.repetitions,
                            )
                        }
                    />
                );
        }
    };

    return <Window>{renderView()}</Window>;
}
