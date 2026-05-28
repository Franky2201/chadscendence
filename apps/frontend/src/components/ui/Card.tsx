import type { ReactNode } from "react";
import { type ThemeName, useTheme } from "../../themeContext";

type CardProps = {
    children: ReactNode;
    className?: string;
};

const baseClasses = "rounded-3xl shadow-xl border px-8 py-12";

const themeClasses: Record<ThemeName, string> = {
    light: "bg-white border-slate-200 text-slate-900",
    dark: "bg-slate-900 border-slate-800 text-slate-100",
};

export function Card({ children, className = "" }: CardProps) {
    const { theme } = useTheme();
    const classes = [baseClasses, themeClasses[theme], className]
        .filter(Boolean)
        .join(" ");
    return <section className={classes}>{children}</section>;
}
