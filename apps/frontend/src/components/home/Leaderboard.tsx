import { useEffect, useState } from "react";
import { getLeaderboard, type LeaderboardType } from "../../services/users";
import { Card } from "../ui/index";

export function Leaderboard({
    count,
    className = "",
}: {
    count: number;
    className?: string;
}) {
    const [topUsers, setTopUsers] = useState<LeaderboardType>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchLeaderboard = async () => {
            try {
                const data = await getLeaderboard(count);
                setTopUsers(data);
            } catch (err) {
                console.log(err);
                if (isMounted)
                    setError("Erreur lors du chargement du classement.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();

        return () => {
            isMounted = false;
        };
    }, [count]);

    return (
        <Card
            className={className}
            contentClassName="justify-start"
            title="Leaderboard"
        >
            <div className="flex flex-col w-full border-none">
                {isLoading ? (
                    <p className="text-lg">Loading ...</p>
                ) : error ? (
                    <p className="text-[color:var(--color-red)]">{error}</p>
                ) : (
                    topUsers.map((user, index) => (
                        <div
                            key={user.id}
                            className="flex flex-row items-center justify-between w-full"
                        >
                            <div className="flex flex-row items-center min-w-0">
                                <span className="text-xl mr-4 w-5 text-right font-energy">
                                    {index + 1}.
                                </span>

                                <img
                                    src={user.avatarUrl}
                                    alt={`${user.username} avatar`}
                                    className="w-10 h-10 mr-2 mb-1 rounded-xl border"
                                />

                                <span className="block truncate text-xl font-bold max-w-[14rem] sm:max-w-[18rem]">
                                    {user.username}
                                </span>
                            </div>

                            <span className="text-lg font-energy">
                                {user.score}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}
