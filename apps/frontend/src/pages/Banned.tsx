import { Window, Card, Title } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function Banned() {
    const { user, logout } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.accountStatus !== "banned") {
            navigate("/");
        }
    }, [user, navigate]);

    const handleLogout = async () => {
        await logout();
        window.location.href = "/";
    };

    return (
        <Window className="relative flex items-center justify-center">
            <div className="absolute top-8 right-8">
                <LanguageSwitcher />
            </div>

            <Card className="max-w-lg w-full p-12 text-center border-red-500/50">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-500/50 animate-pulse">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-red-500"
                        >
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </div>

                    <Title color="white" className="text-4xl">
                        {t("banned.title")}
                    </Title>

                    <p className="text-xl text-white/70 font-medium leading-relaxed">
                        {t("banned.message")}
                    </p>

                    <button
                        onClick={() => void handleLogout()}
                        className="mt-4 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all border border-white/10"
                    >
                        {t("home.profile.logout")}
                    </button>
                </div>
            </Card>
        </Window>
    );
}
