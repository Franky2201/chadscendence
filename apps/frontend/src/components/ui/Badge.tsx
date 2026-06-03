import type { CSSProperties, HTMLAttributes } from "react";
import { type ThemeName, useTheme } from "../../contexts/ThemeContext";
import { type ItemColor } from "./unified";
import { getItemColorStyle } from "./unified";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
    color?: ItemColor;
};

type BadgeStyle = CSSProperties & {
    "--badge-bg": string;
    "--badge-fg": string;
    "--badge-border": string;
};

const themeStyles: Record<ThemeName, BadgeStyle> = {
    light: {
        "--badge-bg": "var(--ui-color)",
        "--badge-fg":
            "color-mix(in srgb, var(--ui-color) 20%, var(--color-black))",
        "--badge-border":
            "color-mix(in srgb, var(--ui-color) 70%, var(--color-black))",
    },
    dark: {
        "--badge-bg": "var(--ui-color)",
        "--badge-fg":
            "color-mix(in srgb, var(--ui-color) 20%, var(--color-black))",
        "--badge-border":
            "color-mix(in srgb, var(--ui-color) 70%, var(--color-black))",
    },
};

export function Badge({
    children,
    className = "",
    color = "grey",
    style,
    ...props
}: BadgeProps) {
    const { theme } = useTheme();
    const colorStyle = getItemColorStyle(color);
    return (
        <span
            className={`rounded-lg border-2 border-[color:var(--badge-border)] 
				bg-[color:var(--badge-bg)] px-2 py-1 font-lexend 
				text-[color:var(--badge-fg)] ${className}`}
            {...props}
            style={{ ...style, ...colorStyle, ...themeStyles[theme] }}
        >
            {children}
        </span>
    );
}
