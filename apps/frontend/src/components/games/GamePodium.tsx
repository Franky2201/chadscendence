import { Link } from "react-router-dom";
import { Card, Button } from "../ui";
import { Header } from "../Header";
import type { GameSession } from "@chad/types";
import { useTranslation } from "react-i18next";

interface GamePodiumProps {
    session: GameSession;
    returnTo?: string;
    hardRefresh?: boolean;
}

export function GamePodium({ session , returnTo = "/", hardRefresh = false}: GamePodiumProps) {
    const { t } = useTranslation();
    return (
        <>
            <Header />
            <Card className="mt-10 max-w-3xl mx-auto text-center p-12">
                <h1 className="text-6xl font-black mb-10 text-yellow-400">
                    {t("game.podium.end")}
                </h1>

                <div className="flex flex-col items-center justify-center gap-4 mb-12">
                    <div className="text-3xl">
                        {t("game.podium.totalScore")} :{" "}
                        <span className="font-bold text-yellow-500">
                            {session.totalScore}
                        </span>
                    </div>

                    {session.ratingDelta !== undefined && (
                        <div className="text-2xl mt-4">
                            {t("game.podium.rating")} :
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

                <Link to={returnTo}>
                    <Button size="large" color="grey" onClick={hardRefresh ? () => { window.location.href = returnTo } : undefined}>
                        {t("game.podium.back")}
                    </Button>
                </Link>
            </Card>
        </>
    );
}
