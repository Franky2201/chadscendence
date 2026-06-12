import { Window } from "../components/ui";
import { Header } from "../components/Header";
import { Achievements } from "../components/profile/Achievements";
import { Summary } from "../components/profile/Summary";
import { History } from "../components/profile/History";
import { Statistics } from "../components/profile/Statistics";
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
                <div className="flex flex-col gap-4 w-full max-w-250">
                    <Summary />
                    <History user={user} />
                    <Statistics user={user} />
                    <Achievements />
                </div>
            </div>
        </Window>
    );
}
