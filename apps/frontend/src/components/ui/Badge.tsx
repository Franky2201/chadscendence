import type { HTMLAttributes } from "react";
import { getItemMixedColorStyle, type ItemColor } from "./unified";
import { getItemColorStyle } from "./unified";

export type BadgeType = "default" | "translation";

type BadgeProps = HTMLAttributes<HTMLDivElement> & {
    text?: string;
    color?: ItemColor;
    color2?: ItemColor;
    borderColor?: ItemColor | null;
    borderBright?: number;
    textColor?: ItemColor | null;
    textBright?: number;
    type?: BadgeType;
    freq?: string;
};

export function Badge({
    children,
    className = "",
    color = "grey",
    color2 = "white",
    borderColor = null,
    borderBright = 75,
    textColor = null,
    textBright = 60,
    type = "default",
    freq = "3",
    style,
    ...props
}: BadgeProps) {
    const commonClasses = "absolute pointer-events-none inset-0";
    return (
        <div
            className={`
                relative overflow-hidden rounded-lg px-2 py-1 shadow-sm
                font-mona-sans border-[var(--border-color)]
                bg-[var(--bg-color)] ring-[var(--border-color)]
                text-[var(--text-color)]
                ${color === "black" ? (textColor = "white") : ""}
                ${color === "black" ? (textBright = 100) : ""}
                ${className}
            `}
            {...props}
            style={{
                ...style,
                ...getItemColorStyle(color, "--bg-color"),
                ...getItemColorStyle(color2, "--bg-color2"),
                ...getItemMixedColorStyle(
                    borderColor ? borderColor : color,
                    "--border-color",
                    borderBright,
                ),
                ...getItemMixedColorStyle(
                    textColor ? textColor : color,
                    "--text-color",
                    textBright,
                ),
            }}
        >
            {type === "translation" && (
                <div
                    className={`${commonClasses}
                        bg-linear-to-r
                        from-[var(--bg-color)]
                        via-[var(--bg-color2)]
                        to-[var(--bg-color)]
                        rotate-320
                        scale-300
                        `}
                    style={{
                        animation: `translation ${freq}s linear infinite`,
                    }}
                />
            )}

            <div className={`${type !== "default" ? "p-0.5" : ""} relative`}>
                {children}
            </div>
        </div>
    );
}
