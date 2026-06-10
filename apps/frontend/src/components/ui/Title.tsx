import type { ReactNode } from "react";
import { type ItemSize, type ItemColor, getItemColorStyle } from "./unified";

type TitleProps = {
    children: ReactNode;
    className?: string;
    size?: ItemSize;
    color?: ItemColor;
};

const sizeClasses: Record<ItemSize, string> = {
    small: "text-xl",
    medium: "text-2xl",
    large: "text-3xl",
};

export function Title({
    children,
    className = "",
    size = "medium",
    color = "grey",
}: TitleProps) {
    const classes = [
        "font-bold font-mona-sans-title text-transparent bg-clip-text bg-[color:var(--ui-color)] select-none",
        sizeClasses[size],
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (
        <p
            className={classes}
            style={{
                ...getItemColorStyle(color),
            }}
        >
            {children}
        </p>
    );
}
