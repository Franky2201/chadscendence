import type { ButtonHTMLAttributes } from 'react';
import type { ItemColor, ItemSize } from './unified';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ItemSize;
  color?: ItemColor;
  borderRadius?: string;
  buttonClassName?: string;
};

const sizeClasses: Record<ItemSize, string> = {
  small: 'px-2 py-1 text-md',
  medium: 'px-4 py-2 text-lg',
  large: 'px-6 py-3 text-xl',
};

const baseOffsetClasses: Record<ItemSize, string> = {
  small: 'translate-y-[3px]',
  medium: 'translate-y-[4px]',
  large: 'translate-y-[5px]',
};

const topOffsetClasses: Record<ItemSize, string> = {
  small:
    'translate-y-[-1px] group-hover:translate-y-[-3px] group-active:translate-y-[+3px]',
  medium:
    'translate-y-[-2px] group-hover:translate-y-[-4px] group-active:translate-y-[+4px]',
  large:
    'translate-y-[-3px] group-hover:translate-y-[-5px] group-active:translate-y-[+5px]',
};

const colorClasses: Record<ItemColor, string> = {
  grey: `bg-[color:var(--color-grey)]`,
  red: `bg-[color:var(--color-red)]`,
  orange: `bg-[color:var(--color-orange)]`,
  yellow: `bg-[color:var(--color-yellow)]`,
  green: `bg-[color:var(--color-green)]`,
  blue: `bg-[color:var(--color-blue)]`,
  purple: `bg-[color:var(--color-purple)]`,
  pink: `bg-[color:var(--color-pink)]`,
  violet: `bg-[color:var(--color-violet)]`,
  white: `bg-[color:var(--color-white)]`,
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
    colorClasses[color as ItemColor],
    baseOffsetClasses[size as ItemSize],
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
    colorClasses[color as ItemColor],
    sizeClasses[size as ItemSize],
    topOffsetClasses[size as ItemSize],
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
