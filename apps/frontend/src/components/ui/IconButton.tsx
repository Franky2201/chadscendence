import type { ButtonHTMLAttributes } from "react";
import type { ItemColor, ItemSize } from "./unified";
import { Button } from "./Button";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    size?: ItemSize;
    color?: ItemColor;
    img?: string;
    borderRadius?: string;
    buttonClassName?: string;
    imgClassName?: string;
};

export function IconButton({
    size = "medium",
    color = "white",
    img = "",
    borderRadius = "rounded-xl",
    children,
    className = "",
    imgClassName = "w-15 h-15",
    style,
    ...props
}: ButtonProps) {
    return (
        <Button
            size={size}
            color={color}
            borderRadius={borderRadius}
            className={`${className} flex justify-center`}
            style={style}
            {...props}
        >
            <span
                aria-hidden="true"
                className={`block bg-current ${imgClassName}`}
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
