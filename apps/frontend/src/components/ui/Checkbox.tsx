import { type ButtonHTMLAttributes } from "react";
import {
    type ItemSize,
    type ItemColor,
    getItemMixedColorStyle,
} from "./unified";
import { Button } from "./index";

type CheckboxProps = Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onChange"
> & {
    size?: ItemSize;
    color?: ItemColor;
    label?: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
};

export function Checkbox({
    size = "medium",
    color = "pink",
    label = "",
    className = "",
    checked = false,
    children,
    onClick,
    onChange,
    ...props
}: CheckboxProps) {
    return (
        <Button
            color={checked ? color : "grey"}
            size={size}
            {...props}
            className={className}
            aria-pressed={checked}
            onClick={(e) => {
                onChange?.(!checked);
                onClick?.(e);
            }}
        >
            <div className="flex flex-col items-start w-full p-1">
                <div className="flex justify-center items-center w-full gap-3">
                    <span
                        className={`w-6 h-6 bg-white/50 rounded-full flex items-center justify-center text-sm shadow-sm
                            ${checked ? "text-[var(--ui-color)]" : "text-grey"}`}
                        style={{
                            ...getItemMixedColorStyle(color, "--ui-color", 60),
                        }}
                    >
                        {checked ? "✓" : ""}
                    </span>

                    <span className="text-xl font-bold">{label}</span>
                </div>

                <p className="text-sm font-normal opacity-90 text-left line-clamp-3 leading-tight whitespace-normal break-words">
                    {children}
                </p>
            </div>
        </Button>
    );
}
