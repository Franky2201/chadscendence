import { Link } from "react-router-dom";
import { Card, Button } from "../ui";
import { Header } from "../Header";
import type { GameSession } from "@chad/types";

interface GamePodiumProps {
    session: GameSession;
}

export function GamePodium({ session }: GamePodiumProps) {
    return (
        <>
            <Header />
            <Card className="mt-10 max-w-3xl mx-auto text-center p-12">
                <h1 className="text-6xl font-black mb-10 text-yellow-400">
                    🏆 TERMINÉ 🏆
                </h1>

                <div className="flex flex-col items-center justify-center gap-4 mb-12">
                    <div className="text-3xl">
                        Score total :{" "}
                        <span className="font-bold text-yellow-500">
                            {session.totalScore}
                        </span>
                    </div>

                    {session.ratingDelta !== undefined && (
                        <div className="text-2xl mt-4">
                            Rating Elo :
                            <span
                                className={
                                    session.ratingDelta > 0
                                        ? "text-green-500 ml-2 font-bold"
                                        : "text-red-500 ml-2 font-bold"
                                }
                            >
                                {session.ratingDelta > 0 ? "+" : ""}
                                {session.ratingDelta}
                            </span>
                        </div>
                    )}
                </div>

                <Link to="/">
                    <Button size="large" color="grey">
                        Retour à l'accueil
                    </Button>
                </Link>
            </Card>
        </>
    );
}
