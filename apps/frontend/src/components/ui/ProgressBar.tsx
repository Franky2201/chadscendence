import type { HTMLAttributes } from "react";
import { getItemMixedColorStyle, type ItemColor } from "./unified";
import { getItemColorStyle } from "./unified";

type BadgeProps = HTMLAttributes<HTMLDivElement> & {
    color?: ItemColor;
    bg?: ItemColor;
    objective?: number;
    progress?: number;
};

export function ProgressBar({
    children,
    className = "",
    color = "grey",
    bg = color,
    objective = 100,
    progress = 0,
    ...props
}: BadgeProps) {
    const commonClasses = `${className} rounded-full bg-[var(--ui-color)]`;
    const ratio = ((progress / objective) * 100).toPrecision(3);
    return (
        <div className={`relative rounded-full overflow-hidden`} {...props}>
            <div
                className={`${commonClasses} w-full`}
                style={{ ...getItemMixedColorStyle(bg, "--ui-color", 60) }}
            ></div>
            <div
                className={`${commonClasses} absolute inset-0`}
                style={{
                    ...getItemColorStyle(color),
                    width: `${ratio}%`,
                }}
            ></div>
            {children}
        </div>
    );
}
