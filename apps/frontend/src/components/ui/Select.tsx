import type { SelectHTMLAttributes } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { getItemColorStyle, getItemMixedColorStyle } from "./unified";

export function Select({
    className = "",
    ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
    const { theme } = useTheme();
    return (
        <select
            className={`hover:cursor-pointer bg-[var(--ui-color)] font-bold 
				font-mona-sans-light  text-[var(--text-color)] ${className}`}
            style={{
                ...getItemColorStyle(theme),
                ...getItemMixedColorStyle(theme, "--text-color", 50),
            }}
            {...props}
        />
    );
}
