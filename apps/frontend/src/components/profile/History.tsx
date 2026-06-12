import { useTranslation } from "react-i18next";
import { Card } from "../ui";
import { GameHistoryCard, type GameHistory } from "./history/GameHistoryCard";
import { useState } from "react";

const data: GameHistory[] = [
    {
        start: "2026-06-09T14:30:00",
        duration: 3,
        players: ["Totema", "admin", "Aaa"],
        scores: [431, 321, 123],
        ratings: [1221, 432, 567],
        rating_diffs: [32, -12, -3],
    },
    {
        start: "2026-06-09T14:35:00",
        duration: 3,
        players: ["Totema", "admin", "Aaa"],
        scores: [431, 321, 123],
        ratings: [123, 432, 567],
        rating_diffs: [-32, -12, -3],
    },
    {
        start: "2026-06-04T14:30:00",
        duration: 3,
        players: ["Totema", "admin", "Aaa"],
        scores: [431, 321, 123],
        ratings: [873, 432, 567],
        rating_diffs: [0, -12, -3],
    },
];

export function History() {
    const { t } = useTranslation();
    const [openId, setOpenId] = useState<string | null>(null);

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

                {data.map((g) => (
                    <GameHistoryCard
                        key={g.start}
                        game={g}
                        isOpen={openId === g.start}
                        onToggle={() =>
                            setOpenId(openId === g.start ? null : g.start)
                        }
                    />
                ))}
            </div>
        </Card>
    );
}
