import { useEffect, useState } from "react";
import { getLeaderboard, type LeaderboardType } from "../../services/users";

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
        <div
            className="flex flex-col items-start p-[20px] gap-[20px] w-full max-w-[450px] overflow-hidden rounded-[32px]"
            style={{
                background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
                fontFamily: "'Lexend', sans-serif",
            }}
        >
            <h2 className="text-[#F8F3F5] text-[20px] font-medium m-0 p-0 leading-none">
                Classement
            </h2>

            <div className="flex flex-col gap-[16px] w-full">
                {isLoading ? (
                    <p className="text-white/60 text-[16px]">
                        Chargement des légendes...
                    </p>
                ) : error ? (
                    <p className="text-red-400 text-[16px]">{error}</p>
                ) : (
                    topUsers.map((user, index) => (
                        <div
                            key={user.id}
                            className="flex flex-row items-center justify-between w-full"
                        >
                            <div className="flex flex-row items-center gap-[16px]">
                                <span
                                    className="font-semibold text-[24px] min-w-[36px]"
                                    style={{ color: "#FFD931" }}
                                >
                                    #{index + 1}
                                </span>

                                <img
                                    src={user.avatarUrl}
                                    alt={`${user.username} avatar`}
                                    className="w-[55px] h-[55px] rounded-full object-cover border border-white/10"
                                />

                                <span className="text-white text-[24px] font-medium">
                                    {user.username}
                                </span>
                            </div>

                            <span className="text-white text-[24px] font-medium">
                                {user.score}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
