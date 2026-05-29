import type { InputHTMLAttributes } from 'react';
import {
  getItemColorTextStyle,
  getItemColorStyle,
  type ItemSize,
  type ItemColor,
} from './unified';

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
	text-center focus-visible:outline-none disabled:cursor-not-allowed \
    focus-visible:ring-2 translate-y-[-2px] active:scale-95 \
	transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-in-out select-none hover:ring-1 \
    bg-[color:var(--ui-color)]/30',
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <input
      type={type}
      className={inputClasses}
      style={{
        ...style,
        ...getItemColorStyle(color),
        ...getItemColorTextStyle(color, 80),
      }}
      {...props}
    />
  );
}
