import { type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { type ThemeName, useTheme } from "../../contexts/ThemeContext";
import { type ItemColor } from "./unified";
import AnimatedBackground from "./AnimatedBackground";

type WindowProps = {
    children: ReactNode;
    className?: string;
    speed?: number;
    angle?: number;
    size?: number;
    color?: ItemColor;
};

const themeButtonClasses: Record<ThemeName, string> = {
    light: "bg-neutral-900 text-neutral-200 border-neutral-800 hover:bg-neutral-800 \
		focus-visible:ring-neutral-400 focus-visible:ring-offset-neutral-100",
    dark: "bg-neutral-100 text-neutral-900 border-neutral-200 hover:bg-white \
		focus-visible:ring-neutral-500 focus-visible:ring-offset-neutral-950",
};

const footerThemeClasses: Record<ThemeName, string> = {
    light: "text-neutral-500",
    dark: "text-neutral-400",
};

const footerLinkClasses: Record<ThemeName, string> = {
    light: "text-neutral-700 hover:text-neutral-950",
    dark: "text-neutral-300 hover:text-white",
};

export function Window({
    children,
    className = "",
    speed = 3,
    angle = 45,
    size = 30,
    color = "grey",
}: WindowProps) {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const classes = [
        "min-h-screen relative overflow-hidden font-sans p-8 transition-all \
		duration-500 ease-in-out",
        className,
    ]
        .filter(Boolean)
        .join(" ");
    const buttonClasses = [
        "z-10 fixed bottom-6 right-6 inline-flex h-12 w-12 items-center \
		justify-center rounded-full border shadow-lg transition-all \
		focus-visible:outline-none focus-visible:ring-2 \
		focus-visible:ring-offset-2 active:scale-95 cursor-pointer \
		overflow-hidden transition-colors duration-300 ease-in-out \
		select-none",
        themeButtonClasses[theme],
    ]
        .filter(Boolean)
        .join(" ");
    const isDark = theme === "dark";
    const footerClasses = [
        "flex justify-center mt-4 items-center text-sm transition-colors duration-300 ease-in-out",
        footerThemeClasses[theme],
    ]
        .filter(Boolean)
        .join(" ");
    const linkClasses = [
        "transition-colors duration-300 ease-in-out hover:underline uppercase",
        footerLinkClasses[theme],
    ]
        .filter(Boolean)
        .join(" ");
    const iconBaseClasses =
        "absolute inset-0 h-8 w-8 transition-all duration-300 ease-in-out";
    const darkIconClasses = isDark
        ? `${iconBaseClasses} opacity-0 scale-75`
        : `${iconBaseClasses} opacity-100 scale-100 filter brightness-0 invert`;
    const lightIconClasses = isDark
        ? `${iconBaseClasses} opacity-100 scale-100`
        : `${iconBaseClasses} opacity-0 scale-75 filter brightness-0 invert`;
    return (
        <div className={classes}>
            <AnimatedBackground
                color={color}
                speed={speed}
                angle={angle}
                size={size}
            />
            <div className="relative z-10">
                {children}
                <footer className={footerClasses}>
                    <a href="" className={linkClasses}>
                        RGPD
                    </a>
                    <span className="mx-2 select-none">|</span>
                    <a href="" className={linkClasses}>
                        Credits
                    </a>
                    {location.pathname !== "/about" && (
                        <>
                            <span className="mx-2 select-none">|</span>
                            <Link to="/about" className={linkClasses}>
                                About Us
                            </Link>
                        </>
                    )}
                </footer>
            </div>
            <button
                type="button"
                className={buttonClasses}
                onClick={toggleTheme}
                aria-label=""
            >
                <span className="relative h-8 w-8">
                    <img
                        src="/dark.svg"
                        alt=""
                        aria-hidden="true"
                        className={darkIconClasses}
                    />
                    <img
                        src="/light.svg"
                        alt=""
                        aria-hidden="true"
                        className={lightIconClasses}
                    />
                </span>
            </button>
        </div>
    );
}
