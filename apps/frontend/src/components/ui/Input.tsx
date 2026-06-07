import type { InputHTMLAttributes } from "react";
import { getItemColorStyle, type ItemSize, type ItemColor } from "./unified";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
    size?: ItemSize;
    color?: ItemColor;
};

const sizeClasses: Record<ItemSize, string> = {
    small: "px-2 py-1 text-sm",
    medium: "px-3 py-2 text-md",
    large: "px-4 py-3 text-lg",
};

export function Input({
    size = "medium",
    color = "grey",
    className = "",
    type = "text",
    style,
    ...props
}: InputProps) {
    const inputClasses = [
        "relative inline-flex items-center justify-center rounded-xl font-bold \
        text-center focus-visible:outline-none disabled:cursor-not-allowed \
        focus-visible:ring-2 translate-y-[-2px] active:scale-95 \
        transition-all duration-100 ease-in-out select-none hover:ring-1 \
        bg-[color:var(--ui-color)]/50 ring-[color:var(--ui-color)]",
        sizeClasses[size],
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (
        <input
            type={type}
            className={inputClasses}
            style={{
                ...style,
                ...getItemColorStyle(color),
            }}
            {...props}
        />
    );
}
