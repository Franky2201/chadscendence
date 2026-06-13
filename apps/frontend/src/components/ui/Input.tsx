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
    return (
        <input
            type={type}
            className={`appearance-none  pr-12 rounded-xl
					font-bold font-mona-sans-light
					bg-[var(--ui-color)]/20 bg-white/10 border-white/20
					text-white ring-white
					hover:cursor-pointer hover:ring-1
					focus-visible:outline-none focus-visible:ring-2
					active:scale-95 transition-all duration-200 ease-in-out
            		${className}
					${sizeClasses[size]}
        		`}
            style={{
                ...style,
                ...getItemColorStyle(color),
            }}
            {...props}
        />
    );
}
