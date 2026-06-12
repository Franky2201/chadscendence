import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPublicProfile } from "../services/users";
import type { PublicUserProfile } from "@chad/types";
import { Window, Card, Badge } from "../components/ui";
import { Header } from "../components/Header";
import { useTranslation } from "react-i18next";

export default function PublicProfile() {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [profile, setProfile] = useState<PublicUserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!username) {
            navigate("/");
            return;
        }

        const fetchProfile = async () => {
            try {
                const data = await getPublicProfile(username);
                setProfile(data);
            } catch {
                setError(t("users.error"));
            } finally {
                setLoading(false);
            }
        };

        void fetchProfile();
    }, [username, navigate, t]);

    return (
        <Window className="relative min-h-screen w-full overflow-y-auto bg-cover bg-center">
            <div className="flex flex-col items-center w-full px-4 md:px-8 pb-6 pt-8 gap-4">
                <Header />

                {loading ? (
                    <div className="flex flex-col gap-4 w-full max-w-250 items-center justify-center mt-20 text-white/50">
                        {t("loading")}...
                    </div>
                ) : error || !profile ? (
                    <div className="flex flex-col gap-4 w-full max-w-250 items-center justify-center mt-20 text-white/50 bg-black/20 p-8 rounded-2xl border border-white/10">
                        {error || "Profil introuvable"}
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 w-full max-w-250">
                        <Card
                            size="large"
                            title={profile.username}
                            onClick={() => navigate(-1)}
                        >
                            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start w-full mt-4">
                                <div className="flex flex-col items-center gap-4 md:w-1/3">
                                    <div className="relative">
                                        <img
                                            src={profile.avatarUrl}
                                            alt="avatar"
                                            className="w-40 h-40 rounded-xl object-cover border-4 border-white/20 shadow-xl"
                                        />
                                    </div>
                                    <div className="flex flex-col items-center text-center gap-1 mt-2">
                                        <h2 className="text-2xl font-black flex items-center gap-2">
                                            #{profile.leaderboardRank ?? "..."}
                                            {profile.role?.name === "Admin" && (
                                                <Badge
                                                    color="black"
                                                    className="text-xs"
                                                >
                                                    {t("profilePage.admin")}
                                                </Badge>
                                            )}
                                        </h2>
                                        <p className="text-lg font-bold text-white/80 mt-1">
                                            {profile.rank?.icon}{" "}
                                            {profile.rank?.name} -{" "}
                                            {profile.rating}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-6 flex-1 w-full mt-4 md:mt-0">
                                    <div className="flex flex-col gap-1 items-start w-full">
                                        <label className="text-sm font-bold text-white/70 ml-1">
                                            {t("profilePage.username")}
                                        </label>
                                        <div className="w-full bg-black/20 text-white p-3 rounded-xl border border-white/10 font-medium text-left">
                                            {profile.username}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1 items-start w-full">
                                        <label className="text-sm font-bold text-white/70 ml-1">
                                            {t("profilePage.bio")}
                                        </label>
                                        <div className="w-full bg-black/20 text-white/80 p-3 rounded-xl border border-white/10 min-h-[100px] whitespace-pre-wrap text-left">
                                            {profile.bio || "..."}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </Window>
    );
}
