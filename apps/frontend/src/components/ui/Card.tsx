import type { AnchorHTMLAttributes } from "react";
import { Link } from "react-router-dom";
import { Title } from "./index";
import { type ThemeName, useTheme } from "../../contexts/ThemeContext";
import { type ItemSize } from "./unified";

type CardProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    className?: string;
    title?: string;
    description?: string;
    contentClassName?: string;
    titleClassName?: string;
    size?: ItemSize;
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

const themeClasses: Record<ThemeName, string> = {
    light: "bg-neutral-300 border-neutral-300 text-neutral-900",
    dark: "bg-neutral-800 border-neutral-600 text-neutral-200",
};

export function Card({
    children,
    className = "",
    title = "",
    description = "",
    contentClassName = "",
    size = "medium",
    ...props
}: CardProps) {
    const { theme } = useTheme();
    const classes = [
        "rounded-3xl border border-1 transition-colors duration-300 \
		ease-in-out justify-center ",
        themeClasses[theme],
        sizeClasses[size],
        className,
    ]
        .filter(Boolean)
        .join(" ");
    const clickable = props.href || props.onClick;
    const linkClass = clickable ? "hover:underline hover:cursor-pointer" : "";
    return (
        <div
            className={`flex flex-col ${classes}`}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 0 10px 0 rgba(0,0,0,0.5)",
            }}
        >
            {title && (
                <div className="flex w-full items-start gap-2">
                    <Title
                        className={`min-w-0 flex-1 mb-2 ${titleSizeClasses[size]}`}
                    >
                        {title}
                    </Title>
                    {clickable &&
                        (props.href && !props.href.startsWith("http") ? (
                            <Link
                                className={`${linkClass} ml-auto shrink-0 whitespace-nowrap self-start`}
                                {...props}
                                to={props.href}
                                ref={undefined}
                            >
                                {description} →
                            </Link>
                        ) : (
                            <a
                                className={`${linkClass} ml-auto shrink-0 whitespace-nowrap self-start`}
                                {...props}
                            >
                                {description} →
                            </a>
                        ))}
                </div>
            )}
            <div className={`w-full h-full p-2 ${contentClassName} `}>
                {children}
            </div>
        </div>
    );
}
