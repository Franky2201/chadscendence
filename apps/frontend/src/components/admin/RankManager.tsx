import { useTranslation } from "react-i18next";
import { Card, Title } from "../ui";
import type { Rank } from "@chad/types";
import { getItemColorStyle } from "../ui/unified";
import { useTheme } from "../../contexts/ThemeContext";

interface RankManagerProps {
    ranks: Rank[];
}

export default function RankManager({ ranks }: RankManagerProps) {
    const { t } = useTranslation();
    const { theme } = useTheme();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <Title color="white" className="text-2xl">
                    {t("admin.tabs.ranks")}
                </Title>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ranks.map((rank) => (
                    <Card
                        key={rank.id}
                        className="flex flex-col gap-4 border-white/10 hover:border-white/20 transition-colors"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-4xl border border-white/10">
                                {rank.icon || "🏅"}
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                                    {rank.name}
                                </h3>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 bg-black/20 p-4 rounded-xl border border-white/5">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white/40 uppercase font-bold tracking-widest text-[10px]">
                                    {t("admin.ranks.ratingMin")}
                                </span>
                                <span className="text-white font-mono font-bold text-lg">
                                    {rank.ratingMin}
                                </span>
                            </div>
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[var(--ui-color)]"
                                    style={{
                                        width: `${Math.min(100, (rank.ratingMin / 5000) * 100)}%`,
                                        ...getItemColorStyle(theme),
                                    }}
                                />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-4">
                <div className="text-blue-400 mt-1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                </div>
                <p className="text-sm text-blue-300 leading-relaxed">
                    {t("admin.ranks.info")}
                </p>
            </div>
        </div>
    );
}
