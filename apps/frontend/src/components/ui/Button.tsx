import type { ButtonHTMLAttributes } from 'react';

type ButtonSize = 'small' | 'medium' | 'large';
type ButtonColor =
  | 'grey'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'violet'
  | 'white';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ButtonSize;
  color?: ButtonColor;
  borderRadius?: string;
  buttonClassName?: string;
};

const sizeClasses: Record<ButtonSize, string> = {
  small: 'px-2 py-1 text-md',
  medium: 'px-4 py-2 text-lg',
  large: 'px-6 py-3 text-xl',
};

const baseOffsetClasses: Record<ButtonSize, string> = {
  small: 'translate-y-[3px]',
  medium: 'translate-y-[4px]',
  large: 'translate-y-[5px]',
};

const topOffsetClasses: Record<ButtonSize, string> = {
  small:
    'translate-y-[-1px] group-hover:translate-y-[-3px] group-active:translate-y-[+3px]',
  medium:
    'translate-y-[-2px] group-hover:translate-y-[-4px] group-active:translate-y-[+4px]',
  large:
    'translate-y-[-3px] group-hover:translate-y-[-5px] group-active:translate-y-[+5px]',
};

const colorClasses: Record<ButtonColor, string> = {
  grey: 'bg-[#bfbfbf]',
  red: 'bg-[#ff9191]',
  orange: 'bg-[#ffc780]',
  yellow: 'bg-[#fff190]',
  green: 'bg-[#daffb6]',
  blue: 'bg-[#6dd8fe]',
  purple: 'bg-[#d791ff]',
  pink: 'bg-[#ffbfff]',
  violet: 'bg-[#a9a3ff]',
  white: 'bg-[#f8f8f8]',
};

export function Button({
  size = 'medium',
  color = 'grey',
  borderRadius = 'rounded-xl',
  children,
  buttonClassName = '',
  className = '',
  ...props
}: ButtonProps) {
  const buttonClasses = [
    '\
    group \
    relative \
    overflow-visible \
    font-bold \
    border-none \
	select-none \
    cursor-pointer',
    borderRadius,
    buttonClassName,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const spanTopClasses = [
    '\
	absolute \
	inset-0 \
	pointer-events-none',
    borderRadius,
    colorClasses[color],
    baseOffsetClasses[size],
  ]
    .filter(Boolean)
    .join(' ');
  const spanBotClasses = [
    '\
    relative \
    inline-flex \
    items-center \
    justify-center \
    text-black \
    transition-transform \
    duration-100 \
    ease-in-out \
  	select-none',
    borderRadius,
    colorClasses[color],
    sizeClasses[size],
    topOffsetClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button type="button" className={buttonClasses} {...props}>
      <span className={spanTopClasses} style={{ filter: 'brightness(0.8)' }} />
      <span className={spanBotClasses}>{children}</span>
    </button>
  );
}
