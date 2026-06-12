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
    { name: "Today", value: 1 },
    { name: "7 Days", value: 7 },
    { name: "30 Days", value: 30 },
    { name: "All Time", value: 0 },
];

interface StatisticsProps {
    user: User | null;
}

export function Statistics({ user }: StatisticsProps) {
    const [period, setPeriod] = useState<TimeRange>(0);
    const { theme } = useTheme();
    const { t } = useTranslation();

    // TODO : This is a test sample for the number of games played
    const arr: number[] = Array.from({ length: period as number }, () =>
        randomInt(1, 100),
    );

    const win_ratio =
        (wrds[period][0].value /
            (wrds[period][0].value +
                wrds[period][1].value +
                wrds[period][2].value)) *
        100;

    const answer_ratio =
        (ards[period][0].value /
            (ards[period][0].value +
                ards[period][1].value +
                ards[period][2].value)) *
        100;

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
                        {p.name}
                    </Button>
                ))}
            </div>
            <div className="flex flex-wrap w-full justify-center gap-2 mt-3">
                {/* Win rate */}
                {!Number.isNaN(win_ratio) && (
                    <div
                        className="flex flex-col justify-center text-center w-full 
                            max-w-22"
                    >
                        <div className="relative">
                            <DonutChart data={wrds[period]} />
                            <span
                                className="absolute inset-0 flex justify-self-center 
                                    self-center select-none font-mona-sans transition-opacity 
                                    text-xl"
                            >
                                {win_ratio.toFixed(0)}%
                            </span>
                        </div>
                        <span className="select-none font-mona-sans-light text-xs">
                            {t("profilePage.statistics.stats.winRate")}
                        </span>
                    </div>
                )}
                {/* Answer rate */}
                {!Number.isNaN(answer_ratio) && (
                    <div
                        className="flex flex-col justify-center text-center 
                        w-full max-w-22"
                    >
                        <div className="relative">
                            <DonutChart data={ards[period]} />
                            <span
                                className="absolute inset-0 flex justify-self-center 
                                    self-center select-none font-mona-sans transition-opacity 
                                    text-xl"
                            >
                                {answer_ratio.toFixed(0)}%
                            </span>
                        </div>
                        <span
                            className="select-none font-mona-sans-light 
                            text-xs"
                        >
                            {t("profilePage.statistics.stats.answerRate")}
                        </span>
                    </div>
                )}
                {/* Skill Chart */}
                <div
                    className="relative flex flex-col items-center 
                        justify-center 
                        w-full max-w-28"
                >
                    <SkillRadarChart
                        data={sds[period]}
                        className="select-none flex items-center justify-center w-full"
                    ></SkillRadarChart>
                    {/*<Select name="" id="" className="px-1 rounded-lg">
                        <option className="small text-xs" key="Overview">
                            Overview
                        </option>
                        {sds[period].map((p) => (
                            <option className="small text-xs" key={p.name}>
                                {p.name}
                            </option>
                        ))}
                    </Select>*/}
                </div>
                {/* Games Played over time */}
                <div
                    className="relative flex flex-col justify-center 
                    items-center w-120"
                >
                    <CustomBarChart
                        values={arr}
                        startDate={
                            new Date(
                                new Date().getTime() -
                                ((arr.length < period
                                    ? arr.length
                                    : period) -
                                    1) *
                                24 *
                                60 *
                                60 *
                                1000,
                            )
                        }
                    ></CustomBarChart>
                    <span className="select-none font-mona-sans-light text-xs">
                        {t("profilePage.statistics.stats.gamePlayed")}
                    </span>
                </div>
            </div>
            <Button
                className="w-full"
                onClick={handleExportCSV}
                disabled={filteredAnalytics.length === 0}
            >
                Export CSV
            </Button>
        </Card>
    );
}
