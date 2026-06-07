import { useEffect, useState } from "react";
import { getLeaderboard, getMyLeaderboardRank } from "../../services/users";
import type { LeaderboardType } from "../../services/users";
import { useAuth } from "../../contexts/AuthContext";
import { Card, Button } from "../ui/index";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

export function Leaderboard({
    count,
    className = "",
}: {
    count: number;
    className?: string;
}) {
    type DisplayUser = LeaderboardType[number] & { rank?: number };
    const [topUsers, setTopUsers] = useState<DisplayUser[]>([]);
    const [appendedCurrent, setAppendedCurrent] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { theme } = useTheme();

    useEffect(() => {
        let isMounted = true;

        const fetchLeaderboard = async () => {
            try {
                const data = await getLeaderboard(count);
                const displayData: DisplayUser[] = data.map((u) => ({ ...u }));
                setAppendedCurrent(false);
                if (user) {
                    const alreadyIncluded = displayData.some(
                        (u) => String(u.id) === String(user.id),
                    );

                    if (!alreadyIncluded) {
                        try {
                            const myRank = await getMyLeaderboardRank();
                            displayData.push({
                                id: user.id,
                                username: user.username,
                                avatarUrl: user.avatarUrl || "/avatar.jpg",
                                score: user.score,
                                rank: myRank,
                            });
                            setAppendedCurrent(true);
                        } catch {
                            displayData.push({
                                id: user.id,
                                username: user.username,
                                avatarUrl: user.avatarUrl || "/avatar.jpg",
                                score: user.score,
                            });
                            setAppendedCurrent(true);
                        }
                    }
                }
                if (isMounted) setTopUsers(displayData);
                setIsLoading(false);
            } catch {
                toast.error("Error while loading the leaderboard");
            }
        };

        fetchLeaderboard();

        return () => {
            isMounted = false;
        };
    }, [count, user]);

    return (
        <Card
            className={className}
            contentClassName="justify-start"
            title={t("home.leaderboard")}
        >
            <div className="flex flex-col w-full border-none">
                {isLoading ? (
                    <p className="text-lg">Loading ...</p>
                ) : (
                    topUsers.map((item, index) => (
                        <div key={item.id} className="w-full">
                            {appendedCurrent &&
                                item.rank !== undefined &&
                                index === topUsers.length - 1 && (
                                    <span className="block w-full border-t border-dashed my-2" />
                                )}

                            <div className="flex flex-row items-center justify-between w-full">
                                <div className="flex flex-row items-center min-w-0">
                                    <span className="text-xl mr-4 w-5 text-right font-mona-sans">
                                        {item.rank ?? index + 1}.
                                    </span>

                                    <img
                                        src={item.avatarUrl}
                                        alt={`${item.username} avatar`}
                                        className="w-10 h-10 mr-2 mb-1 rounded-xl border"
                                    />

                                    <span className="block truncate text-xl font-bold max-w-[14rem] sm:max-w-[18rem]">
                                        {item.username}
                                    </span>
                                </div>

                                <span className="text-lg font-mona-sans">
                                    {item.score}
                                </span>
                            </div>
                        </div>
                    ))
                )}

                <Button
                    color={theme}
                    className="w-full mt-6"
                    onClick={() => navigate("/users")}
                >
                    {t("users.title")}
                </Button>
            </div>
        </Card>
    );
}
