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
    const { theme } = useTheme();
    const location = useLocation();
    const classes = `min-h-screen relative overflow-hidden font-sans p-8 transition-all \
		duration-500 ease-in-out ${className}`;
    const footerClasses = `flex justify-center mt-4 items-center text-sm \
		transition-colors duration-300 ease-in-out ${footerThemeClasses[theme]}`;
    const linkClasses = `transition-colors duration-300 ease-in-out hover:underline \
		uppercase font-semibold text-center ${footerLinkClasses[theme]}`;
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
                        Privacy Policy
                    </a>
                    <span className="mx-2 select-none">|</span>
                    <a href="" className={linkClasses}>
                        Terms of Service
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
        </div>
    );
}
