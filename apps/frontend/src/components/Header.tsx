import { Link } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";

export function Header() {
    return (
        <header className="relative flex flex-col items-center justify-center w-full mb-6 md:mb-8">
            <Link to="/">
                <img
                    className="select-none w-auto drop-shadow-lg max-h-24 md:max-h-30 mb-8 hover:scale-105 transition-transform cursor-pointer"
                    src="/game_banner.png"
                    alt="GameLogo"
                />
            </Link>
            <div className="mt-4 md:mt-0 md:absolute md:top-2 md:right-6 z-50 scale-90 md:scale-100 origin-center md:origin-top-right">
                <LanguageSwitcher />
            </div>
        </header>
    );
}
