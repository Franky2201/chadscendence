import { useAuth } from "../contexts/AuthContext";
import { Window } from "../components/ui";
import * as board from "../components/home";
import { Header } from "../components/Header";
import { useTranslation } from "react-i18next";

export default function HomePage() {
    const { user, isLoading } = useAuth();
    const { t } = useTranslation();

    if (isLoading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                {t("loading")}
            </div>
        );

    return (
        <Window>
            <Header />
            <div
                className={`grid w-full max-w-300 mx-auto grid-cols-1
					md:grid-cols-3 "lg:grid-cols-3" gap-3`}
            >
                <board.Play />
                {!user && <board.Identification />}
                {user && <board.Profile />}
                <board.Leaderboard count={5} />
            </div>
        </Window>
    );
}
