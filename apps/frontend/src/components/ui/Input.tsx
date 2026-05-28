import type { InputHTMLAttributes } from 'react';
import type { ItemSize, ItemColor } from './unified';
import { getItemColorStyle } from './unified';

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  size?: ItemSize;
  color?: ItemColor;
};

const sizeClasses: Record<ItemSize, string> = {
  small: 'py-2 text-sm',
  medium: 'py-3 text-md',
  large: 'py-4 text-lg',
};

export function Input({
  size = 'medium',
  color = 'grey',
  className = '',
  type = 'text',
  style,
  ...props
}: InputProps) {
  const inputClasses = [
    'relative inline-flex items-center justify-center rounded-xl font-bold \
	text-center focus-visible:outline-none disabled:cursor-not-allowed ring-1 \
	focus-visible:ring-offset-3 focus-visible:ring-2 translate-y-[-3px] \
	active:scale-95 transition-transform duration-100 ease-in-out select-none',
    'ring-[color:var(--ui-color)]',
    'focus-visible:ring-[color:var(--ui-color)]',
    'bg-[color:var(--ui-color)]/20',
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <input
      type={type}
      className={inputClasses}
      style={{ ...style, ...getItemColorStyle(color) }}
      {...props}
    />
  );
}
