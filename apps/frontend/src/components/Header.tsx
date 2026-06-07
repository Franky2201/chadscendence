import { Link } from "react-router-dom";

export function Header() {
    return (
        <header className="flex justify-center w-full">
            <Link to="/">
                <img
                    className="select-none w-auto drop-shadow-lg max-h-24 md:max-h-30 mb-8 hover:scale-105 transition-transform cursor-pointer"
                    src="/game_banner.png"
                    alt="GameLogo"
                />
            </Link>
        </header>
    );
}
