import { useAuth } from "../contexts/AuthContext";
import { Window } from "../components/ui";
import * as board from "../components/home";

export default function HomePage() {
    const { user, isLoading } = useAuth();

    const classes = user ? " lg:grid-cols-3" : "lg:grid-cols-2";

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
					md:grid-cols-2 ${classes} gap-3`}
            >
                {!user && <board.Identification />}
                <board.Play />
                <board.Settings />
                {user && <board.Profile />}
                {user && <board.Leaderboard count={5} />}
                {user && <board.Friends />}
                {/* user && <board.Clan /> */}
                {user && <board.Achievements />}
                {/* <board.About className="md:col-span-2" /> */}
            </div>
        </Window>
    );
}
