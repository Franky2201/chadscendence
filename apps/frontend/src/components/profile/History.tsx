import { useTranslation } from "react-i18next";
import { Card } from "../ui";
import { GameHistoryCard, type GameHistory } from "./history/GameHistoryCard";
import { useState, useMemo } from "react";
import type { User } from "@chad/types";

interface HistoryProps {
    user: User | null;
}

const PAGE_SIZE = 10;

export function History({ user }: HistoryProps) {
    const { t } = useTranslation();
    const [openId, setOpenId] = useState<string | null>(null);
    const [page, setPage] = useState(0);

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

    const totalPages = Math.ceil(historyData.length / PAGE_SIZE);

    const paginatedData = useMemo(() => {
        const start = page * PAGE_SIZE;
        return historyData.slice(start, start + PAGE_SIZE);
    }, [historyData, page]);

    const commonClasses =
        "select-none flex justify-self-center font-mona-sans-ligh text-xs sm:text-md";

    const goToPrev = () => setPage((p) => Math.max(0, p - 1));
    const goToNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

    return (
        <Card title={t("profilePage.statistics.gameHistory.title")}>
            <div className="flex flex-col gap-2">
                <div className="grid grid-cols-4 gap-2 px-4">
                    <span className={commonClasses}>
                        {t("profilePage.statistics.gameHistory.rounds")}
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
                    paginatedData.map((g) => (
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

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <button
                            onClick={goToPrev}
                            disabled={page === 0}
                            className="px-3 py-1 rounded-md text-sm select-none disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                        >
                            {t("profilePage.statistics.gameHistory.next", "Next")}
                        </button>
                        <span className="text-xs sm:text-sm text-white/70 select-none">
                            {page + 1} / {totalPages}
                        </span>
                        <button
                            onClick={goToNext}
                            disabled={page === totalPages - 1}
                            className="px-3 py-1 rounded-md text-sm select-none disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                        >
                            {t("profilePage.statistics.gameHistory.previous", "Previous")}
                        </button>
                    </div>
                )}
            </div>
        </Card>
    );
}