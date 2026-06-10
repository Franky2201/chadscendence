import type { AnchorHTMLAttributes } from "react";
import { Link } from "react-router-dom";
import { Title } from "./index";
import {
    type ItemSize,
    type ItemColor,
    getItemMixedColorStyle,
    getItemColorStyle,
} from "./unified";

type CardProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    className?: string;
    title?: string;
    description?: string;
    contentClassName?: string;
    titleClassName?: string;
    size?: ItemSize;
    color?: ItemColor;
};

const titleSizeClasses: Record<ItemSize, string> = {
    small: "text-xl",
    medium: "text-2xl",
    large: "text-3xl",
};

const sizeClasses: Record<ItemSize, string> = {
    small: "py-1 px-2",
    medium: "py-4 px-5",
    large: "py-5 px-6",
};

export function Card({
    children,
    className = "",
    title = "",
    description = "",
    contentClassName = "",
    size = "medium",
    color = "white",
    ...props
}: CardProps) {
    const classes = [
        `rounded-3xl transition-colors duration-300 ease-in-out 
		justify-center bg-black/60 backdrop-blur-sm
		bg-white/5 backdrop-blur-[8px] border-1 border-white/20
		${sizeClasses[size]} \
		${className}`,
    ];
    const clickable = props.href || props.onClick;
    const commonLinkClass = `shrink-0 whitespace-nowrap font-semibold
		${clickable ? "hover:underline hover:cursor-pointer" : ""} 
		text-[var(--ui-color)] self-center`;
    return (
        <div
            className={`flex flex-col ${classes}`}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
                ...getItemMixedColorStyle(color, "--alt-color"),
                ...getItemColorStyle(color),
            }}
        >
            {title && (
                <>
                    <div className="flex w-full items-start gap-2">
                        <Title
                            className={`min-w-0 flex-1 ${titleSizeClasses[size]}`}
                            color={color}
                        >
                            {title}
                        </Title>
                        {clickable &&
                            (props.href && !props.href.startsWith("http") ? (
                                <Link
                                    className={commonLinkClass}
                                    {...props}
                                    to={props.href}
                                    ref={undefined}
                                >
                                    {description} ⮕
                                </Link>
                            ) : (
                                <a className={commonLinkClass} {...props}>
                                    {description} ⮕
                                </a>
                            ))}
                    </div>
                    <hr
                        className={`w-full mt-2 mb-4 text-[var(--ui-color)]/30`}
                        style={{ ...getItemColorStyle(color) }}
                    />
                </>
            )}
            <div className={`w-full h-full ${contentClassName} `}>
                {children}
            </div>
        </div>
    );
}
