import React, { type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { type ItemColor } from "./unified";
import AnimatedBackground from "./AnimatedBackground";
import { useTheme } from "../../contexts/ThemeContext";
import LanguageSwitcher from "../LanguageSwitcher";

type WindowProps = {
    children: ReactNode;
    className?: string;
    speed?: number;
    angle?: number;
    size?: number;
    color?: ItemColor | null;
};

export function Window({
    children,
    className = "",
    speed = 8,
    angle = 45,
    size = 30,
    color = null,
}: WindowProps) {
    const { theme } = useTheme();
    const location = useLocation();
    const links = [
        location.pathname !== "/privacypolicy" && {
            to: "/privacypolicy",
            label: "Privacy Policy",
        },
        location.pathname !== "/termsofservice" && {
            to: "/termsofservice",
            label: "Terms of Service",
        },
        location.pathname !== "/about" && {
            to: "/about",
            label: "About Us",
        },
    ].filter((link): link is { to: string; label: string } => Boolean(link));
    const classes = `min-h-screen relative overflow-hidden font-sans p-8 transition-all \
		duration-500 ease-in-out ${className}`;
    const footerClasses = `flex justify-center mt-4 items-center text-sm gap-1 \
		transition-colors duration-50 ease-in-out`;
    const linkClasses = `select-none transition-all duration-300 ease-in-out \
		uppercase text-center hover:font-bold`;
    return (
        <div className={classes}>
            <AnimatedBackground
                color={color === null ? theme : color}
                speed={speed}
                angle={angle}
                size={size}
            />
            <div className="absolute top-4 right-4 z-50">
                <LanguageSwitcher />
            </div>
            <div className="relative z-10">
                {children}
                <footer className={footerClasses}>
                    {links.map((link, index) => (
                        <React.Fragment key={link.to}>
                            {index > 0 && (
                                <span className={linkClasses}>|</span>
                            )}
                            <Link to={link.to} className={linkClasses}>
                                {link.label}
                            </Link>
                        </React.Fragment>
                    ))}
                </footer>
            </div>
        </div>
    );
}
