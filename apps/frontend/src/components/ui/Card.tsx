import type { AnchorHTMLAttributes } from "react";
import { Title } from "./index";
import { type ThemeName, useTheme } from "../../contexts/theme-context";

type CardProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    className?: string;
    title?: string;
    description?: string;
    contentClassName?: string;
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
    ...props
}: CardProps) {
    const { theme } = useTheme();
    const classes = [
        "rounded-3xl border border-1 px-3 py-3 transition-colors duration-300 \
		ease-in-out justify-center ",
        themeClasses[theme],
        className,
    ]
        .filter(Boolean)
        .join(" ");
    const clickable = props.href || props.onClick;
    const titleClasses = [
        clickable ? "hover:underline hover:cursor-pointer" : "",
    ];
    return (
        <div
            className={`flex flex-col ${classes}`}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 0 10px 0 rgba(0,0,0,0.5)",
            }}
        >
            {title && (
                <div className="flex flex-wrap w-full justify-between">
                    {title && (
                        <a {...props}>
                            <Title
                                className={`self-start flex flex-row items-center ${titleClasses}`}
                            >
                                {clickable && "⎋ "}
                                {title}
                            </Title>
                        </a>
                    )}
                    {description && (
                        <p className="ml-4 text-sm">{description}</p>
                    )}
                </div>
            )}
            <div className={`w-full h-full p-2 ${contentClassName} `}>
                {children}
            </div>
        </div>
    );
}
