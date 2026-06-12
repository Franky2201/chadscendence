import { useState, useMemo } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Card, Button } from "../ui/index";
import { DonutChart } from "./stats/DonutChart";
import { SkillRadarChart } from "./stats/SkillRadarChart";
import { useTranslation } from "react-i18next";
import type { User, GameAnalytics } from "@chad/types";

type TimeRange = 0 | 1 | 7 | 30 | 60;

type ChartStatEntry = {
    name: string;
    value: number;
    fill: string;
};

type SkillStatEntry = {
    name: string;
    value: number;
};

const periods: { name: string; value: TimeRange }[] = [
    { name: "profilePage.statistics.periods.today", value: 1 },
    { name: "profilePage.statistics.periods.7days", value: 7 },
    { name: "profilePage.statistics.periods.30days", value: 30 },
    { name: "profilePage.statistics.periods.allTime", value: 0 },
];

interface StatisticsProps {
    user: User | null;
}

export function Statistics({ user }: StatisticsProps) {
    const [period, setPeriod] = useState<TimeRange>(7);
    const { theme } = useTheme();
    const { t } = useTranslation();

    const filteredAnalytics = useMemo(() => {
        if (!user?.analytics) return [];

        const now = new Date().getTime();
        return user.analytics.filter((game: GameAnalytics) => {
            if (period === 0) return true;
            const gameDate = new Date(game.playedAt).getTime();
            const diffDays = (now - gameDate) / (1000 * 60 * 60 * 24);
            return diffDays <= period;
        });
    }, [user, period]);

    const stats = useMemo(() => {
        let positiveRating = 0;
        let negativeRating = 0;
        let neutralRating = 0;

        let correctAnswers = 0;
        let incorrectAnswers = 0;
        const timeoutAnswers = 0;

        const gameScores: Record<string, { total: number; count: number }> = {};

        filteredAnalytics.forEach((game: GameAnalytics) => {
            if (game.ratingDelta > 0) positiveRating++;
            else if (game.ratingDelta < 0) negativeRating++;
            else neutralRating++;

            if (game.roundsDetails) {
                game.roundsDetails.forEach((round) => {
                    if (round.score > 0) correctAnswers++;
                    else incorrectAnswers++;

                    if (!gameScores[round.gameId]) {
                        gameScores[round.gameId] = { total: 0, count: 0 };
                    }
                    gameScores[round.gameId].total += round.score;
                    gameScores[round.gameId].count++;
                });
            }
        });

        const performanceData: ChartStatEntry[] = [
            { name: "Gain", value: positiveRating, fill: "var(--color-green)" },
            { name: "Loss", value: negativeRating, fill: "var(--color-red)" },
            {
                name: "Neutral",
                value: neutralRating,
                fill: "var(--color-grey)",
            },
        ];

        const answerData: ChartStatEntry[] = [
            {
                name: "Correct",
                value: correctAnswers,
                fill: "var(--color-green)",
            },
            {
                name: "Incorrect",
                value: incorrectAnswers,
                fill: "var(--color-red)",
            },
            {
                name: "Time",
                value: timeoutAnswers,
                fill: "var(--color-orange)",
            },
        ];

        const skillData: SkillStatEntry[] = Object.entries(gameScores).map(
            ([gameId, data]) => ({
                name: gameId,
                value: data.count > 0 ? Math.round(data.total / data.count) : 0,
            }),
        );

        if (skillData.length === 0) {
            skillData.push({ name: "No Data", value: 0 });
        }

        return { performanceData, answerData, skillData };
    }, [filteredAnalytics]);

    const performanceRatio = useMemo(() => {
        const total =
            stats.performanceData[0].value +
            stats.performanceData[1].value +
            stats.performanceData[2].value;

        if (total === 0) return NaN;
        return (stats.performanceData[0].value / total) * 100;
    }, [stats.performanceData]);

    const answerRatio = useMemo(() => {
        const total =
            stats.answerData[0].value +
            stats.answerData[1].value +
            stats.answerData[2].value;

        if (total === 0) return NaN;
        return (stats.answerData[0].value / total) * 100;
    }, [stats.answerData]);

    const handleExportCSV = () => {
        if (!filteredAnalytics || filteredAnalytics.length === 0) return;

        const headers = [
            "Date",
            "Session ID",
            "Game ID",
            "Round Score",
            "Session Total Score",
            "Rating Delta",
            "New Rating",
        ];

        const rows: string[] = [];

        filteredAnalytics.forEach((session: GameAnalytics) => {
            const date = new Date(session.playedAt).toISOString();

            if (session.roundsDetails && session.roundsDetails.length > 0) {
                session.roundsDetails.forEach((round) => {
                    rows.push(
                        [
                            date,
                            session.id,
                            round.gameId,
                            round.score,
                            session.totalScore,
                            session.ratingDelta,
                            session.newRating,
                        ].join(","),
                    );
                });
            } else {
                rows.push(
                    [
                        date,
                        session.id,
                        "N/A",
                        0,
                        session.totalScore,
                        session.ratingDelta,
                        session.newRating,
                    ].join(","),
                );
            }
        });

        const csvContent = [headers.join(","), ...rows].join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
            "download",
            `analytics_${user?.username || "export"}_${new Date().toISOString().split("T")[0]}.csv`,
        );

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <Card
            contentClassName=""
            title={t("profilePage.statistics.stats.title")}
        >
            <div className="flex flex-wrap w-full justify-center gap-2">
                {periods.map((p) => (
                    <Button
                        size="small"
                        className="small h-7 text-xs"
                        color={period === p.value ? theme : "white"}
                        key={p.name}
                        disabled={period === p.value}
                        onClick={() => setPeriod(p.value)}
                    >
                        {t(p.name)}
                    </Button>
                ))}
            </div>

            <div className="flex flex-wrap w-full justify-center gap-2 my-8 min-h-[120px]">
                {filteredAnalytics.length === 0 ? (
                    <div className="text-center text-white/50 italic font-mono text-sm self-center">
                        {t("profilePage.statistics.stats.noData")}
                    </div>
                ) : (
                    <>
                        {!Number.isNaN(performanceRatio) && (
                            <div className="flex flex-col justify-center text-center w-full max-w-22">
                                <div className="relative">
                                    <DonutChart data={stats.performanceData} />
                                    <span className="absolute inset-0 flex justify-self-center self-center select-none font-mona-sans transition-opacity text-xl">
                                        {performanceRatio.toFixed(0)}%
                                    </span>
                                </div>
                                <span className="select-none font-mona-sans-light text-xs">
                                    {t(
                                        "profilePage.statistics.stats.progression",
                                    )}
                                </span>
                            </div>
                        )}

                        {!Number.isNaN(answerRatio) && (
                            <div className="flex flex-col justify-center text-center w-full max-w-22">
                                <div className="relative">
                                    <DonutChart data={stats.answerData} />
                                    <span className="absolute inset-0 flex justify-self-center self-center select-none font-mona-sans transition-opacity text-xl">
                                        {answerRatio.toFixed(0)}%
                                    </span>
                                </div>
                                <span className="select-none font-mona-sans-light text-xs">
                                    {t(
                                        "profilePage.statistics.stats.answerRate",
                                    )}
                                </span>
                            </div>
                        )}

                        <div className="relative flex flex-col items-center justify-center w-full max-w-28">
                            <SkillRadarChart
                                data={stats.skillData}
                                className="select-none flex items-center justify-center w-full"
                            />
                        </div>
                    </>
                )}
            </div>
            <Button
                className="w-full"
                onClick={handleExportCSV}
                disabled={filteredAnalytics.length === 0}
            >
                {t("profilePage.statistics.stats.exportCSV")}
            </Button>
        </Card>
    );
}
