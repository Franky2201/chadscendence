import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Card, Button /*, Select*/ } from "../ui/index";
import { DonutChart, SkillRadarChart, CustomBarChart } from "./stats/index";
import { useTranslation } from "react-i18next";

// const { tmp } = useTranslation();

// TODO : Remove the following with calls to the database
type TimeRange = 0 | 1 | 7 | 15 | 30 | 60;

type WinRateEntry = {
    name: "Wins" | "Losses" | "Draws";
    value: number;
    fill: string;
};

const wrds: Record<TimeRange, WinRateEntry[]> = {
    1: [
        { name: "Wins", value: 0, fill: "var(--color-green)" },
        { name: "Losses", value: 0, fill: "var(--color-red)" },
        { name: "Draws", value: 0, fill: "var(--color-grey)" },
    ],
    7: [
        { name: "Wins", value: 8, fill: "var(--color-green)" },
        { name: "Losses", value: 5, fill: "var(--color-red)" },
        { name: "Draws", value: 2, fill: "var(--color-grey)" },
    ],
    15: [
        { name: "Wins", value: 17, fill: "var(--color-green)" },
        { name: "Losses", value: 9, fill: "var(--color-red)" },
        { name: "Draws", value: 4, fill: "var(--color-grey)" },
    ],
    30: [
        { name: "Wins", value: 36, fill: "var(--color-green)" },
        { name: "Losses", value: 18, fill: "var(--color-red)" },
        { name: "Draws", value: 6, fill: "var(--color-grey)" },
    ],
    60: [
        { name: "Wins", value: 74, fill: "var(--color-green)" },
        { name: "Losses", value: 36, fill: "var(--color-red)" },
        { name: "Draws", value: 10, fill: "var(--color-grey)" },
    ],
    0: [
        { name: "Wins", value: 152, fill: "var(--color-green)" },
        { name: "Losses", value: 72, fill: "var(--color-red)" },
        { name: "Draws", value: 16, fill: "var(--color-grey)" },
    ],
};

type AnswerRateEntry = {
    name: "Correct" | "Incorrect" | "Time";
    value: number;
    fill: string;
};

const ards: Record<TimeRange, AnswerRateEntry[]> = {
    1: [
        { name: "Correct", value: 0, fill: "var(--color-green)" },
        { name: "Incorrect", value: 0, fill: "var(--color-red)" },
        { name: "Time", value: 0, fill: "var(--color-orange)" },
    ],
    7: [
        { name: "Correct", value: 8, fill: "var(--color-green)" },
        { name: "Incorrect", value: 5, fill: "var(--color-red)" },
        { name: "Time", value: 2, fill: "var(--color-orange)" },
    ],
    15: [
        { name: "Correct", value: 17, fill: "var(--color-green)" },
        { name: "Incorrect", value: 9, fill: "var(--color-red)" },
        { name: "Time", value: 4, fill: "var(--color-orange)" },
    ],
    30: [
        { name: "Correct", value: 31, fill: "var(--color-green)" },
        { name: "Incorrect", value: 28, fill: "var(--color-red)" },
        { name: "Time", value: 6, fill: "var(--color-orange)" },
    ],
    60: [
        { name: "Correct", value: 94, fill: "var(--color-green)" },
        { name: "Incorrect", value: 66, fill: "var(--color-red)" },
        { name: "Time", value: 10, fill: "var(--color-orange)" },
    ],
    0: [
        { name: "Correct", value: 122, fill: "var(--color-green)" },
        { name: "Incorrect", value: 22, fill: "var(--color-red)" },
        { name: "Time", value: 16, fill: "var(--color-orange)" },
    ],
};

// Skill DataSet
type SkillRateEntry = {
    name: "Mathematics" | "Reflex" | "Memory" | "Geography" | "Social";
    value: number;
};

const sds: Record<TimeRange, SkillRateEntry[]> = {
    1: [
        { name: "Mathematics", value: 100 },
        { name: "Reflex", value: 2 },
        { name: "Memory", value: 80 },
        { name: "Geography", value: 17 },
        { name: "Social", value: 10 },
    ],
    7: [
        { name: "Mathematics", value: 92 },
        { name: "Reflex", value: 55 },
        { name: "Memory", value: 76 },
        { name: "Geography", value: 22 },
        { name: "Social", value: 14 },
    ],
    15: [
        { name: "Mathematics", value: 88 },
        { name: "Reflex", value: 0 },
        { name: "Memory", value: 74 },
        { name: "Geography", value: 8 },
        { name: "Social", value: 18 },
    ],
    30: [
        { name: "Mathematics", value: 85 },
        { name: "Reflex", value: 64 },
        { name: "Memory", value: 70 },
        { name: "Geography", value: 0 },
        { name: "Social", value: 20 },
    ],
    60: [
        { name: "Mathematics", value: 82 },
        { name: "Reflex", value: 70 },
        { name: "Memory", value: 8 },
        { name: "Social", value: 25 },
        { name: "Geography", value: 40 },
    ],
    0: [
        { name: "Mathematics", value: 95 },
        { name: "Reflex", value: 58 },
        { name: "Memory", value: 8 },
        { name: "Geography", value: 30 },
        { name: "Social", value: 22 },
    ],
};

const periods: { name: string; value: TimeRange }[] = [
    { name: "Today", value: 1 },
    { name: "7 Days", value: 7 },
    { name: "15 Days", value: 15 },
    { name: "30 Days", value: 30 },
    { name: "60 Days", value: 60 },
    { name: "All Time", value: 0 },
];

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function Statistics() {
    const [period, setPeriod] = useState<TimeRange>(15);
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
        <Card contentClassName="" title={t("profilePage.statistics.stats.title")}>
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
        </Card>
    );
}
