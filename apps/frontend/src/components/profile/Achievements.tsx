import { useTheme } from "../../contexts/ThemeContext";
import { Card, Badge, ProgressBar } from "../ui";
import { getItemColorStyle, getItemMixedColorStyle } from "../ui/unified";

type UserStats = {
    gamesPlayed: number;
    perfectAnswers: number;
    peakRating: number;
    daysPlayed: number;
    playTime: number;
};

type Tier = {
    label: number;
    target: number;
};

type Achievement = {
    title: string;
    description: string;
    tiers: Tier[];
    value: (stats: UserStats) => number;
};

type ProgressResult = {
    current: number;
    target: number;
    completed: boolean;
    tierIndex: number;
};

function computeTierProgress(value: number, tiers: Tier[]): ProgressResult {
    let previous = 0;

    for (let i = 0; i < tiers.length; i++) {
        const tier = tiers[i];
        if (value < tier.target) {
            const current = value - previous;
            const target = tier.target - previous;
            return {
                current,
                target,
                completed: false,
                tierIndex: i,
            };
        }
        previous = tier.target;
    }
    return {
        current: value,
        target: value,
        completed: true,
        tierIndex: tiers.length - 1,
    };
}

const achievements: Achievement[] = [
    {
        title: "Player",
        description: "Play more games.",
        value: (s) => s.gamesPlayed,
        tiers: [
            { label: 1, target: 1 },
            { label: 2, target: 10 },
            { label: 3, target: 100 },
            { label: 4, target: 1000 },
        ],
    },
    {
        title: "Perfect Answer",
        description: "Hit perfect answers.",
        value: (s) => s.perfectAnswers,
        tiers: [
            { label: 1, target: 1 },
            { label: 2, target: 10 },
            { label: 3, target: 100 },
        ],
    },
    {
        title: "Competitive player",
        description: "Grind the ladder.",
        value: (s) => s.peakRating,
        tiers: [
            { label: 1, target: 1 },
            { label: 2, target: 200 },
            { label: 3, target: 1000 },
            { label: 4, target: 2000 },
            { label: 5, target: 3000 },
        ],
    },
    {
        title: "No Time",
        description: "Total playtime.",
        value: (s) => s.playTime,
        tiers: [
            { label: 1, target: 10 },
            { label: 2, target: 50 },
            { label: 3, target: 100 },
        ],
    },
    {
        title: "Recurring player",
        description: "Play on different days.",
        value: (s) => s.daysPlayed,
        tiers: [
            { label: 1, target: 1 },
            { label: 2, target: 7 },
            { label: 3, target: 14 },
            { label: 4, target: 30 },
            { label: 5, target: 91 },
            { label: 6, target: 182 },
            { label: 7, target: 365 },
        ],
    },
];

export function Achievements() {
    const { theme } = useTheme();
    const s: UserStats = {
        gamesPlayed: 21,
        perfectAnswers: 23,
        peakRating: 4335.2,
        daysPlayed: 1,
        playTime: 34,
    };
    return (
        <Card title="Achievements">
            <div className="flex flex-wrap gap-2 justify-center">
                {achievements.map((a) => {
                    const raw = a.value(s);
                    const progress = computeTierProgress(raw, a.tiers);
                    const completed = progress.completed;

                    const currentTier = a.tiers[progress.tierIndex]?.label;

                    return (
                        <Badge
                            key={a.title}
                            className="w-78"
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
                                        Tier {currentTier} / {a.tiers.length}
                                    </div>
                                )}
                                <span className="select-none text-lg font-mona-sans-title break-words pr-10">
                                    {a.title}
                                </span>

                                <span className="select-none font-mona-sans-light text-sm">
                                    {a.description}
                                </span>

                                {!completed && (
                                    <ProgressBar
                                        className="h-4 w-full my-1"
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
