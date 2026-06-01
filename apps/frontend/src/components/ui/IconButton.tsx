import type { ButtonHTMLAttributes } from "react";
import type { ItemColor, ItemSize } from "./unified";
import { Button } from "./Button";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    size?: ItemSize;
    color?: ItemColor;
    img?: string;
    borderRadius?: string;
    buttonClassName?: string;
};

export function IconButton({
    size = "medium",
    color = "grey",
    img = "",
    borderRadius = "rounded-xl",
    children,
    className = "",
    style,
    ...props
}: ButtonProps) {
    return (
        <Button
            size={size}
            color={color}
            borderRadius={borderRadius}
            className={`${className} flex flex-col justify-center`}
            style={style}
            {...props}
        >
            <span
                aria-hidden="true"
                className="mb-1 block h-15 w-15 bg-current"
                style={{
                    maskImage: `url('/${img}')`,
                    WebkitMaskImage: `url('/${img}')`,
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                }}
            />
            {children}
        </Button>
    );
}
