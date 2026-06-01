import type { InputHTMLAttributes } from "react";
import type { ItemColor, ItemSize } from "./unified";
import { getItemColorStyle } from "./unified";
import { type ThemeName, useTheme } from "../../contexts/ThemeContext";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
    size?: ItemSize;
    color?: ItemColor;
    label?: string;
};

const sizeClasses: Record<ItemSize, string> = {
    small: "h-6 w-12 after:h-4 after:w-4 peer-checked:after:translate-x-6",
    medium: "h-7 w-14 after:h-5 after:w-5 peer-checked:after:translate-x-7",
    large: "h-8 w-16 after:h-6 after:w-6 peer-checked:after:translate-x-8",
};

const spanSizeClasses: Record<ItemSize, string> = {
    small: "text-sm",
    medium: "text-md",
    large: "text-lg",
};

const themeClasses: Record<ThemeName, string> = {
    light: "after:bg-neutral-200",
    dark: "after:bg-neutral-800",
};

export function Toggle({
    size = "medium",
    color = "grey",
    className = "",
    label = "",
    style,
    ...props
}: CheckboxProps) {
    const { theme } = useTheme();
    const topClass = [
        className,
        'relative peer peer-checked:after:border-buffer after:content-[""] \
    after:absolute after:rounded-full after:top-[2px] active:scale-95 \
    after:start-[2px] after:transition-all after:duration-100 transition-all \
    duration-100 rounded-full after:translate-y-[2px] after:translate-x-[2px] \
	peer-checked:bg-[color:var(--ui-color)] bg-[color:var(--color-grey)] \
	transition-[background-color,color,border-color,box-shadow,transform] ease-in-out',
        themeClasses[theme],
        sizeClasses[size],
    ]
        .filter(Boolean)
        .join(" ");
    const colorStyle = getItemColorStyle(color);
    return (
        <label className="inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                value=""
                className={`sr-only peer group ${className}`}
                style={{ ...style, ...colorStyle }}
                {...props}
            />
            <div
                className={`${topClass}`}
                style={{ ...style, ...colorStyle }}
            ></div>
            <span
                className={`${className} ${spanSizeClasses[size]} select-none ms-3 font-bold`}
            >
                {label}
            </span>
        </label>
    );
}
