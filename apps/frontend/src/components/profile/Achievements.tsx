import { useTheme } from "../../contexts/ThemeContext";
import { Card, Badge, ProgressBar } from "../ui";
import { getItemColorStyle, getItemMixedColorStyle } from "../ui/unified";
import achievementsData from "./achievements.json";

type UserStats = {
    gamesPlayed: number;
    perfectAnswers: number;
    peakRating: number;
    daysPlayed: number;
    playTime: number;
    numberOfFriends: number;
};

type Achievement = {
    title: string;
    description: string;
    stat: keyof UserStats;
    tiers: number[];
};

type ProgressResult = {
    current: number;
    target: number;
    completed: boolean;
    tierIndex: number;
};

function computeTierProgress(value: number, tiers: number[]): ProgressResult {
    let previous = 0;

    for (let i = 0; i < tiers.length; i++) {
        const tier = tiers[i];
        if (value < tier) {
            const current = value - previous;
            const target = tier - previous;
            return {
                current,
                target,
                completed: false,
                tierIndex: i,
            };
        }
        previous = tier;
    }
    return {
        current: value,
        target: value,
        completed: true,
        tierIndex: tiers.length - 1,
    };
}

export function Achievements() {
    const { theme } = useTheme();
    const achievements = achievementsData as Achievement[];

    const s: UserStats = {
        gamesPlayed: 21,
        perfectAnswers: 23,
        peakRating: 4335.2,
        daysPlayed: 101,
        playTime: 1,
        numberOfFriends: 0,
    };

    return (
        <Card title="Achievements">
            <div className="flex flex-wrap gap-2 justify-center">
                {achievements.map((a) => {
                    const raw = s[a.stat];
                    const progress = computeTierProgress(raw, a.tiers);
                    const completed = progress.completed;
                    return (
                        <Badge
                            key={a.title}
                            className="w-78"
                            contentClassName="h-full flex flex-col justify-between"
                            freq="5"
                            color={completed ? theme : "white"}
                            type={completed ? "translation" : "default"}
                        >
                            <div className="flex flex-col">
                                {!completed && (
                                    <div
                                        className="select-none absolute top-1 right-0 text-[10px] px-2 py-0.5 
                                            rounded-md bg-[var(--ui-color)] text-[var(--text-color)] backdrop-blur-sm"
                                        style={{
                                            ...getItemColorStyle(theme),
                                            ...getItemMixedColorStyle(
                                                theme,
                                                "--text-color",
                                                60,
                                            ),
                                        }}
                                    >
                                        Tier {progress.tierIndex} /{" "}
                                        {a.tiers.length}
                                    </div>
                                )}
                                <span className="select-none text-md sm:text-lg font-mona-sans-title break-words pr-10">
                                    {a.title}
                                </span>

                                <span className="select-none font-mona-sans-light text-xs sm:text-sm">
                                    {a.description}
                                </span>
                            </div>
                            <div className="my-1 w-full text-center">
                                {!completed && (
                                    <ProgressBar
                                        barClassName="h-5 w-full"
                                        progress={progress.current}
                                        objective={progress.target}
                                        color={theme}
                                    >
                                        <span
                                            className={`select-none absolute inset-0 self-center 
                                                justify-self-center text-xs text-white`}
                                        >
                                            {(
                                                (progress.current /
                                                    progress.target) *
                                                100
                                            ).toPrecision(3)}
                                            %
                                        </span>
                                    </ProgressBar>
                                )}
                                {completed && (
                                    <span className="select-none self-center justify-self-center text-xs">
                                        {progress.current}
                                    </span>
                                )}
                            </div>
                        </Badge>
                    );
                })}
            </div>
        </Card>
    );
}
