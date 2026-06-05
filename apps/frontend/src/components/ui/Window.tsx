import { type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { type ItemColor } from "./unified";
import AnimatedBackground from "./AnimatedBackground";
import { useTheme } from "../../contexts/ThemeContext";

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
    speed = 3,
    angle = 45,
    size = 30,
    color = null,
}: WindowProps) {
    const { theme } = useTheme();
    const location = useLocation();
    const classes = `min-h-screen relative overflow-hidden font-sans p-8 transition-all \
		duration-500 ease-in-out ${className}`;
    const footerClasses = `flex justify-center mt-4 items-center text-sm gap-1 \
		transition-colors duration-50 ease-in-out`;
    const linkClasses = `transition-all duration-300 ease-in-out \
		uppercase text-center hover:font-bold`;
    return (
        <div className={classes}>
            <AnimatedBackground
                color={color === null ? theme : color}
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
                    <span className={linkClasses}>|</span>
                    <a href="" className={linkClasses}>
                        Terms of Service
                    </a>
                    {location.pathname !== "/about" && (
                        <>
                            <span className={linkClasses}>|</span>
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
