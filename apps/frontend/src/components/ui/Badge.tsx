import type { HTMLAttributes } from "react";
import { getItemMixedColorStyle, type ItemColor } from "./unified";
import { getItemColorStyle } from "./unified";

export type BadgeType = "default" | "translation" | "rotation";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
    text?: string;
    color?: ItemColor;
    color2?: ItemColor;
    borderColor?: ItemColor | null;
    borderBright?: number;
    textColor?: ItemColor | null;
    textBright?: number;
    type?: BadgeType;
    angle?: number;
    freq?: number;
    interpolation?: string;
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
    angle = 0,
    freq = 3,
    interpolation = "srgb",
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
            {type === "rotation" && (
                <div
                    className={`${commonClasses}
                        bg-conic/${interpolation} w-full h-[225%]
                        from-[var(--bg-color)]
                        via-[var(--bg-color2)]
                        to-[var(--bg-color)]
                        rotate-${angle}
                        scale-200
                        `}
                    style={{
                        animation: `rotation ${freq}s linear infinite`,
                    }}
                />
            )}
            {type === "translation" && (
                <div
                    className={`${commonClasses}
                        bg-linear-to-r/${interpolation}
                        from-[var(--bg-color)]
                        via-[var(--bg-color2)]
                        to-[var(--bg-color)]
                        rotate-${angle}
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
