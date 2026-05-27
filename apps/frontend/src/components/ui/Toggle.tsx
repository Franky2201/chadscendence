import type { InputHTMLAttributes } from 'react';
import type { ItemColor, ItemSize } from './unified';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  size?: ItemSize;
  color?: ItemColor;
  label?: string;
};

const sizeClasses: Record<ItemSize, string> = {
  small: 'h-6 w-12 after:h-4 after:w-4 peer-checked:after:translate-x-6',
  medium: 'h-7 w-14 after:h-5 after:w-5 peer-checked:after:translate-x-7',
  large: 'h-8 w-16 after:h-6 after:w-6 peer-checked:after:translate-x-8',
};

const activeColorClasses: Record<ItemColor, string> = {
  grey: 'peer-checked:bg-[color:var(--color-grey)] ring-[color:var(--color-grey)]',
  red: 'peer-checked:bg-[color:var(--color-red)] ring-[color:var(--color-red)]',
  orange:
    'peer-checked:bg-[color:var(--color-orange)] ring-[color:var(--color-orange)]',
  yellow:
    'peer-checked:bg-[color:var(--color-yellow)] ring-[color:var(--color-yellow)]',
  green:
    'peer-checked:bg-[color:var(--color-green)] ring-[color:var(--color-green)]',
  blue: 'peer-checked:bg-[color:var(--color-blue)] ring-[color:var(--color-blue)]',
  purple:
    'peer-checked:bg-[color:var(--color-purple)] ring-[color:var(--color-purple)]',
  pink: 'peer-checked:bg-[color:var(--color-pink)] ring-[color:var(--color-pink)]',
  violet:
    'peer-checked:bg-[color:var(--color-violet)] ring-[color:var(--color-violet)]',
  white:
    'peer-checked:bg-[color:var(--color-white)] ring-[color:var(--color-white)]',
};

const spanSizeClasses: Record<ItemSize, string> = {
  small: 'text-sm',
  medium: 'text-md',
  large: 'text-lg',
};

export function Toggle({
  size = 'medium',
  color = 'grey',
  className = '',
  label = '',
  ...props
}: CheckboxProps) {
  const topClass = [
    className,
    'relative peer peer-checked:after:border-buffer after:content-[""] \
	after:absolute after:bg-white after:rounded-full after:top-[2px] \
	after:start-[2px] after:transition-all transition-transform duration-100 \
	bg-[#bfbfbf] rounded-full peer-hover:ring-1 peer-hover:ring-offset-1 \
	after:translate-y-[2px] after:translate-x-[2px]',
    sizeClasses[size],
    activeColorClasses[color],
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        value=""
        className={`sr-only peer group ${className}`}
        {...props}
      />
      <div className={`${topClass}`}></div>
      <span
        className={`${className} ${spanSizeClasses[size]} select-none ms-3 font-bold`}
      >
        {label}
      </span>
    </label>
  );
}
