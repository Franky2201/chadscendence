import { Window } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { useGameSession } from "../hooks/useGameSession";
import { useGameSetup } from "../hooks/useGameSetup";
import { GameSetup } from "../components/games/GameSetup";
import { GamePlaying } from "../components/games/GamePlaying";
import { GamePodium } from "../components/games/GamePodium";
import ReactionTimeUI from "../components/games/ReactionTimeUI";

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
            case "preparing":
                return (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-white">
                        <h1 className="text-6xl font-bold animate-bounce text-yellow-400">
                            PRÉPAREZ-VOUS !
                        </h1>
                    </div>
                );
            case "playing": {
                const gameId =
                    session?.rounds[session.currentRoundIndex]?.game.id;

                if (gameId === "reaction-time") {
                    return (
                        <ReactionTimeUI
                            prompt={prompt!}
                            onSubmit={submitAnswer}
                        />
                    );
                }

                return (
                    <GamePlaying
                        prompt={prompt!}
                        timeLeft={timeLeft}
                        onSubmit={submitAnswer}
                    />
                );
            }
            case "inter_round":
                return (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-white">
                        <h1 className="text-5xl font-bold text-pink-500">
                            SUIVANT ! ⚡️
                        </h1>
                    </div>
                );
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
