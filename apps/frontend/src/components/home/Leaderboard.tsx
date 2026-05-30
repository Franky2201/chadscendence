import { useEffect, useState } from "react";
import { getLeaderboard, type LeaderboardType } from "../../services/users";
import { Card } from "../ui/index";

export default function Leaderboard({ count }: { count: number }) {
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
        <Card className="flex flex-col gap-[16px] w-full p-3 border-none">
            {isLoading ? (
                <p className="text-[16px]">Chargement des légendes...</p>
            ) : error ? (
                <p className="text-[color:var(--color-red)] text-[16px]">
                    {error}
                </p>
            ) : (
                topUsers.map((user, index) => (
                    <div
                        key={user.id}
                        className="flex flex-row items-center justify-between w-full"
                    >
                        <div className="flex flex-row items-center gap-[16px]">
                            <span className="font-semibold text-[24px] min-w-[36px]">
                                {index + 1}.
                            </span>

                            <img
                                src={user.avatarUrl}
                                alt={`${user.username} avatar`}
                                className="w-[55px] h-[55px] rounded-full object-cover border border-white/10"
                            />

                            <span className=" text-[24px] font-medium">
                                {user.username}
                            </span>
                        </div>

                        <span className=" text-[24px] font-medium">
                            {user.score}
                        </span>
                    </div>
                ))
            )}
        </Card>
    );
}
