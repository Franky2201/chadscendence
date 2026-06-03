import type { HTMLAttributes } from "react";
import { type ItemColor } from "./unified";
import { getItemColorStyle } from "./unified";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
    text?: string;
    color?: ItemColor;
    color2?: ItemColor;
    type?: BadgeType;
};

export type BadgeType = "default" | "shine" | "gradient" | "animated";

const defaultStyles: Record<string, string> = {
    "--badge-fg": "color-mix(in srgb, var(--ui-color) 20%, var(--color-black))",
    "--badge-border":
        "color-mix(in srgb, var(--ui-color) 70%, var(--color-black))",
};

const themeStyles: Record<BadgeType, Record<string, string>> = {
    default: {},
    shine: {
        background:
            "radial-gradient(var(--ui-color) 0%, var(--ui-color2) 100%)",
    },
    gradient: {
        background:
            "linear-gradient(var(--ui-color) 0%, var(--ui-color2) 100%)",
        "background-position": "0px -2px",
        "background-size": "100% 115%",
    },
    animated: {
        background:
            "linear-gradient(var(--ui-color) 18%, var(--ui-color2) 50%, var(--ui-color) 82%)",
        animation: "3s linear infinite top-down",
        "background-size": "100% 1000%",
    },
};

export function Badge({
    children,
    className = "",
    color = "grey",
    color2 = "white",
    type = "default",
    style,
    ...props
}: BadgeProps) {
    const colorStyle = getItemColorStyle(color);
    const color2Style = getItemColorStyle(color2, "--ui-color2");
    return (
        <span
            className={`rounded-lg ${type === "default" ? "border-2" : ""} px-2 py-1 shadow-sm font-lexend 
				border-[var(--badge-border)] bg-[color:var(--ui-color)] 
				text-[var(--badge-fg)] ${className} ${color === "black" ? "text-white" : ""}`}
            {...props}
            style={{
                ...style,
                ...colorStyle,
                ...color2Style,
                ...defaultStyles,
                ...themeStyles[type],
            }}
        >
            <p className={`${type !== "default" ? "p-0.5" : ""}`}>{children}</p>
        </span>
    );
}
