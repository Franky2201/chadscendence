import { useAuth } from "../contexts/AuthContext";
import { Window } from "../components/ui";
import * as board from "../components/home";
import { Header } from "../components/Header";

export default function HomePage() {
    const { user, isLoading } = useAuth();

    if (isLoading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading ...
            </div>
        );

    return (
        <Window>
            <Header />
            <div
                className={`grid w-full max-w-300 justify-self-center grid-cols-1 
					md:grid-cols-3 "lg:grid-cols-3" gap-3`}
            >
                <board.Play />
                {!user && <board.Identification />}
                {user && <board.Profile />}
                <board.Leaderboard count={10} className="row-span-2" />
            </div>
        </Window>
    );
}
