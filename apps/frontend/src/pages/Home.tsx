import { useAuth } from "../contexts/AuthContext";
import { Window } from "../components/ui";
import * as board from "../components/home";

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
            <header className="justify-self-center">
                <img
                    className={`select-none w-auto drop-shadow-lg max-h-30 mb-8`}
                    src="/game_banner.png"
                    alt="GameLogo"
                />
            </header>
            <div
                className={`grid w-full max-w-300 justify-self-center grid-cols-1 
					md:grid-cols-3 "lg:grid-cols-3" gap-3`}
            >
                <board.Play />
                {!user && <board.Identification />}
                {user && <board.Profile />}
                <board.Leaderboard count={10} className="row-span-2" />
                {/* <board.Settings /> */}
                {/* user && <board.Friends className="col-span-2" /> */}
                {/* user && <board.Clan /> */}
                {/* <board.About className="md:col-span-2" /> */}
            </div>
        </Window>
    );
}
