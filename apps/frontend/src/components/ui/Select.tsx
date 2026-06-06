import type { SelectHTMLAttributes } from "react";

type SelectSize = "small" | "medium" | "large";

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> & {
    size?: SelectSize;
};

const sizeClasses: Record<SelectSize, string> = {
    small: "pl-4 pr-12 py-2 text-sm",
    medium: "pl-6 pr-14 py-3 text-base",
    large: "pl-8 pr-16 py-4 text-lg",
};

export function Select({
    size = "medium",
    className = "",
    ...props
}: SelectProps) {
    return (
        <div className={`flex flex-row items-center`}>
            <select
                className={`rounded-xl bg-black/70 hover:cursor-pointer font-bold ${sizeClasses[size]} ${className}`}
                {...props}
            />
        </div>
    );
}
