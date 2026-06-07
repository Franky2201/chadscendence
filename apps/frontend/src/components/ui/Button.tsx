import type { ButtonHTMLAttributes } from "react";
import type { ItemColor, ItemSize } from "./unified";
import { getItemColorStyle, getItemColorTextStyle } from "./unified";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    size?: ItemSize;
    color?: ItemColor;
    borderRadius?: string;
    buttonClassName?: string;
};

const sizeClasses: Record<ItemSize, string> = {
    small: "px-2 py-1 text-sm",
    medium: "px-3 py-2 text-md",
    large: "px-4 py-3 text-lg",
};

export function Button({
    size = "medium",
    color = "white",
    borderRadius = "rounded-xl",
    children,
    className = "",
    style,
    ...props
}: ButtonProps) {
    const divClasses = [
        "group relative border-none select-none",
        borderRadius,
        className,
    ]
        .filter(Boolean)
        .join(" ");
    const buttonClasses = [
        "items-center justify-center transition-all duration-100 ease-in-out h-full w-full\
		select-none group-active:translate-y-0 font-bold bg-[color:var(--ui-color)] font-mona-sans",
        borderRadius,
        sizeClasses[size],
        className,
        props.disabled
            ? "translate-y-0 cursor-not-allowed"
            : "translate-y-[-5px] group-hover:translate-y-[-7px] cursor-pointer",
    ]
        .filter(Boolean)
        .join(" ");
    const spanBotClasses = [
        "absolute inset-0 bg-[color:var(--ui-color)] transition-all duration-100",
        borderRadius,
        sizeClasses[size],
        className,
    ]
        .filter(Boolean)
        .join(" ");
    const colorStyle = getItemColorStyle(color);
    const textStyle = getItemColorTextStyle(color, 65);
    return (
        <div className={divClasses}>
            <span
                className={spanBotClasses}
                style={{ ...colorStyle, filter: "brightness(0.8)" }}
            />
            <button
                type="button"
                className={buttonClasses}
                style={{
                    ...style,
                    ...textStyle,
                    ...colorStyle,
                }}
                {...props}
            >
                {children}
            </button>
        </div>
    );
}
