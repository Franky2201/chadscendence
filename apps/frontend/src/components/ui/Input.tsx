import type { InputHTMLAttributes } from 'react';
import type { ItemSize, ItemColor } from './unified';

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  size?: ItemSize;
  color?: ItemColor;
};

const sizeClasses: Record<ItemSize, string> = {
  small: 'py-2 text-sm',
  medium: 'py-3 text-md',
  large: 'py-4 text-lg',
};

const colorClasses: Record<ItemColor, string> = {
  grey: 'ring-[color:var(--color-grey)] focus:ring-[color:var(--color-grey)] \
    bg-[color:var(--color-grey)]/20',
  red: 'ring-[color:var(--color-red)] focus:ring-[color:var(--color-red)] \
    bg-[color:var(--color-red)]/20',
  orange:
    'ring-[color:var(--color-orange)] focus:ring-[color:var(--color-orange)] \
	bg-[color:var(--color-orange)]/20',
  yellow:
    'ring-[color:var(--color-yellow)] focus:ring-[color:var(--color-yellow)] \
	bg-[color:var(--color-yellow)]/20',
  green:
    'ring-[color:var(--color-green)] focus:ring-[color:var(--color-green)] \
	bg-[color:var(--color-green)]/20',
  blue: 'ring-[color:var(--color-blue)] focus:ring-[color:var(--color-blue)] \
    bg-[color:var(--color-blue)]/20',
  purple:
    'ring-[color:var(--color-purple)] focus:ring-[color:var(--color-purple)] \
	bg-[color:var(--color-purple)]/20',
  pink: 'ring-[color:var(--color-pink)] focus:ring-[color:var(--color-pink)] \
    bg-[color:var(--color-pink)]/20',
  violet:
    'ring-[color:var(--color-violet)] focus:ring-[color:var(--color-violet)] \
	bg-[color:var(--color-violet)]/20',
  white:
    'ring-[color:var(--color-white)] focus:ring-[color:var(--color-white)] \
	bg-[color:var(--color-white)]/20',
};

export function Input({
  size = 'medium',
  color = 'grey',
  className = '',
  type = 'text',
  ...props
}: InputProps) {
  const commonClasses = [
    'inline-flex items-center justify-center text-center \
	rounded-xl font-bold focus-visible:outline-none \
 	disabled:cursor-not-allowed',
  ];
  const inputClasses = [
    commonClasses,
    'relative inline-flex items-center justify-center bg-[color:var(--color-red)\
	ring-1 focus-visible:ring-offset-3 focus-visible:ring-2 \
	active:scale-95 transition-transform duration-100 ease-in-out select-none',
    colorClasses[color],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return <input type={type} className={inputClasses} {...props} />;
}
