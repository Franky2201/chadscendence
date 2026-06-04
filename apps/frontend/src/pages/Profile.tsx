import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Window, Card, Badge } from "../components/ui";
import { getMyLeaderboardRank } from "../services/users";

export default function ProfilePage() {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();
    const [leaderboardRank, setLeaderboardRank] = useState<number | null>(null);

    useEffect(() => {
        if (!isLoading && !user) {
            navigate("/");
        }
    }, [isLoading, user, navigate]);

    useEffect(() => {
        if (user) {
            getMyLeaderboardRank()
                .then(setLeaderboardRank)
                .catch(() => { });
        }
    }, [user]);

    if (isLoading || !user)
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading ...
            </div>
        );

    const formatDate = (date: Date | string) =>
        new Date(date).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });

    return (
        <Window className="relative min-h-screen w-full overflow-hidden bg-cover bg-center">
            <header className="justify-self-center">
                <img
                    className="select-none w-auto drop-shadow-lg max-h-30 mb-8"
                    src="/game_banner.png"
                    alt="GameLogo"
                />
            </header>
            <Card
                className="relative max-w-250 mx-auto p-6"
                title="Profile"
                href="/"
                description="Back"
                size="large"
            >
                <div className="relative group">
                    <img
                        src={user.avatarUrl}
                        alt="avatar"
                        className="w-36 h-36 rounded-xl justify-self-center 
							mb-4 object-cover border-4 border-white/20 
							shadow-xl transition-opacity"
                    />
                </div>

                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-4xl font-black">{user.username}</h1>
                    <p className="text-lg">{user.email}</p>
                    <p className="text-2xl mt-1">
                        {user.rank?.icon} {user.rank?.name}
                    </p>
                    <p className="text-3xl font-bold">
                        {user.score} pts{" "}
                        <span className="text-2xl font-semibold/70">
                            #{leaderboardRank ?? "…"}
                        </span>
                    </p>
                    {user.bio && (
                        <p className="text-base text-center max-w-sm mt-1 italic">
                            {user.bio}
                        </p>
                    )}
                    {user?.role?.name === "Admin" && (
                        <Badge
                            color="black"
                            className="text-xs font-bold uppercase mt-1"
                        >
                            Admin
                        </Badge>
                    )}
                    <div className="mt-3 flex flex-col gap-1 text-xs">
                        <span>
                            Membre depuis le {formatDate(user.createdAt)}
                        </span>
                        <span>
                            Profil mis à jour le {formatDate(user.updatedAt)}
                        </span>
                    </div>
                </div>
            </Card>
        </Window>
    );
}
