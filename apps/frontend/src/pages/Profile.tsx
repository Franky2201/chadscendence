import { Window } from "../components/ui";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { Header } from "../components/Header";
import * as pannel from "../components/profile/index";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function ProfilePage() {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !user) {
            navigate("/");
        }
    }, [isLoading, user, navigate]);

    if (!user) return null;

    return (
        <Window className="relative min-h-screen w-full overflow-y-auto bg-cover bg-center">
            <div className="flex flex-col items-center w-full px-4 md:px-8 pb-6 pt-8 gap-4">
                <Header />
                <div className="absolute top-4 right-4 z-50">
                    <LanguageSwitcher />
                </div>
                <div className="flex flex-col gap-4 w-full max-w-250">
                    <pannel.Summary></pannel.Summary>
                    <pannel.History></pannel.History>
                    <pannel.Achievements></pannel.Achievements>
                </div>
            </div>
        </Window>
    );
}
