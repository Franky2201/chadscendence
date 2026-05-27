import type { ButtonHTMLAttributes } from 'react';
import type { ItemColor, ItemSize } from './unified';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ItemSize;
  color?: ItemColor;
  borderRadius?: string;
  buttonClassName?: string;
};

const sizeClasses: Record<ItemSize, string> = {
  small: 'py-2 text-sm',
  medium: 'py-3 text-md',
  large: 'py-4 text-lg',
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
    'relative inline-flex items-center justify-center text-black \
	transition-transform duration-100 ease-in-out select-none \
	translate-y-[-5px] group-hover:translate-y-[-7px] \
	group-active:translate-y-0',
    borderRadius,
    colorClasses[color],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const spanBotClasses = [
    'absolute inset-0 pointer-events-none',
    borderRadius,
    colorClasses[color],
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button type="button" className={buttonClasses} {...props}>
      <span className={spanBotClasses} style={{ filter: 'brightness(0.8)' }} />
      <span className={spanTopClasses}>{children}</span>
    </button>
  );
}
