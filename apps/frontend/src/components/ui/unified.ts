import type { CSSProperties } from "react";

export type ItemSize = "small" | "medium" | "large";

export type ItemColor =
    | "grey"
    | "red"
    | "orange"
    | "yellow"
    | "green"
    | "blue"
    | "purple"
    | "pink"
    | "violet"
    | "white";

const colorVariables: Record<ItemColor, string> = {
    grey: "var(--color-grey)",
    red: "var(--color-red)",
    orange: "var(--color-orange)",
    yellow: "var(--color-yellow)",
    green: "var(--color-green)",
    blue: "var(--color-blue)",
    purple: "var(--color-purple)",
    pink: "var(--color-pink)",
    violet: "var(--color-violet)",
    white: "var(--color-white)",
};

export function getItemColorVariable(color: ItemColor) {
    return colorVariables[color];
}

export function getItemColorStyle(color: ItemColor): CSSProperties {
    return {
        "--ui-color": getItemColorVariable(color),
    } as CSSProperties;
}

export function getItemColorMix(color: ItemColor, percentage = 80) {
    return `color-mix(in srgb, ${getItemColorVariable(color)} ${percentage}%, black)`;
}

export function getItemColorTextStyle(color: ItemColor, percentage = 80) {
    return {
        color: getItemColorMix(color, percentage),
    };
}
