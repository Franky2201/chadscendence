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
                    className="select-none w-auto drop-shadow-lg max-h-30 mb-8"
                    src="/game_banner.png"
                    alt="GameLogo"
                />
            </header>
            <div className="grid w-full max-w-300 justify-self-center grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {!user && <board.Identification />}
                <board.Play />
                <board.Leaderboard count={5} />
                {user && <board.Profile />}
                {user && <board.Friends />}
                {user && <board.Clan />}
                {user && <board.Achievements />}
                <board.Settings />
                <board.Credits className="md:col-span-2 xl:col-span-2" />
            </div>
        </Window>
    );
}
