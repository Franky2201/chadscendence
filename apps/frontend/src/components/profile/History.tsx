import { useTranslation } from "react-i18next";
import { Card } from "../ui";
import { GameHistoryCard, type GameHistory } from "./history/GameHistoryCard";
import { useState, useMemo } from "react";
import type { User } from "@chad/types";

interface HistoryProps {
    user: User | null;
}

export function History({ user }: HistoryProps) {
    const { t } = useTranslation();
    const [openId, setOpenId] = useState<string | null>(null);

    const historyData: (GameHistory & { id: string })[] = useMemo(() => {
        if (!user?.analytics) return [];

        return user.analytics
            .slice()
            .sort(
                (a, b) =>
                    new Date(b.playedAt).getTime() -
                    new Date(a.playedAt).getTime(),
            )
            .map((game) => ({
                id: game.id,
                start: new Date(game.playedAt).toISOString(),
                duration: game.roundsDetails?.length || 0,
                players: [user.username],
                scores: [game.totalScore],
                ratings: [game.newRating],
                rating_diffs: [game.ratingDelta],
            }));
    }, [user]);

    const commonClasses =
        "select-none flex justify-self-center font-mona-sans-ligh text-xs sm:text-md";

    return (
        <Card title={t("profilePage.statistics.gameHistory.title")}>
            <div className="flex flex-col gap-2">
                <div className="grid grid-cols-4 gap-2 px-4">
                    <span className={commonClasses}>
                        {t("profilePage.statistics.gameHistory.position")}
                    </span>
                    <span className={commonClasses}>
                        {t("profilePage.statistics.gameHistory.score")}
                    </span>
                    <span className={commonClasses}>
                        {t("profilePage.statistics.gameHistory.rating")}
                    </span>
                    <span className={commonClasses}>
                        {t("profilePage.statistics.gameHistory.ratingGained")}
                    </span>
                </div>

                {historyData.length === 0 ? (
                    <div className="text-center text-white/50 py-6 italic font-mono text-sm">
                        {t("profilePage.statistics.gameHistory.noData")}
                    </div>
                ) : (
                    historyData.map((g) => (
                        <GameHistoryCard
                            key={g.id}
                            game={g}
                            isOpen={openId === g.id}
                            onToggle={() =>
                                setOpenId(openId === g.id ? null : g.id)
                            }
                        />
                    ))
                )}
            </div>
        </Card>
    );
}
