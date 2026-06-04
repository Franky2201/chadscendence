import type { ReactNode } from "react";
import { type ThemeName, useTheme } from "../../contexts/theme-context";
import { type ItemSize } from "./unified";

type TitleProps = {
    children: ReactNode;
    className?: string;
    size?: ItemSize;
};

const sizeClasses: Record<ItemSize, string> = {
    small: "text-xl",
    medium: "text-2xl",
    large: "text-3xl",
};

const themeClasses: Record<ThemeName, string> = {
    light: "from-neutral-500 to-neutral-900 drop-shadow-[0_0_8px_rgba(0,0,0,0.4)]",
    dark: "from-neutral-100 to-neutral-400 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]",
};

export function Title({
    children,
    className = "",
    size = "medium",
}: TitleProps) {
    const { theme } = useTheme();

    const classes = [
        "font-bold font-energy text-transparent bg-clip-text bg-linear-80 select-none",
        themeClasses[theme],
        sizeClasses[size],
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return <p className={classes}>{children}</p>;
}
