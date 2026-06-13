import type { SelectHTMLAttributes } from "react";
import type { ItemSize, ItemColor } from "./unified";
import { getItemColorStyle } from "./unified";

type SelectorProps = SelectHTMLAttributes<HTMLSelectElement> & {
    customSize?: ItemSize;
    color?: ItemColor;
};

const sizeClasses: Record<ItemSize, string> = {
    small: "px-2 py-1 text-sm",
    medium: "px-3 py-2 text-md",
    large: "px-4 py-3 text-lg",
};

export function Select({
    customSize = "medium",
    color = "white",
    className = "",
    ...props
}: SelectorProps) {
    return (
        <div className="relative inline-block group">
            <select
                className={`appearance-none pr-12 rounded-xl
					font-bold font-mona-sans-light
					bg-[var(--ui-color)]/20 bg-white/10 border-white/20
					text-white ring-white
					hover:cursor-pointer hover:ring-1
					focus-visible:outline-none focus-visible:ring-2
            		${className}
					${sizeClasses[customSize]}
        		`}
                style={{
                    ...getItemColorStyle(color),
                }}
                {...props}
            />
            <img
                src="/selector.svg"
                className=" absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 
					invert group-active:scale-0 duration-300 pointer-events-none"
            />
        </div>
    );
}
