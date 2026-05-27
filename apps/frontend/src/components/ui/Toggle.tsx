import type { InputHTMLAttributes } from 'react';
import type { ItemColor, ItemSize } from './unified';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  size?: ItemSize;
  color?: ItemColor;
  label?: string;
};

const sizeClasses: Record<ItemSize, string> = {
  small: 'h-4 w-8 after:h-3 after:w-3 peer-checked:after:translate-x-4',
  medium: 'h-5 w-10 after:h-4 after:w-4 peer-checked:after:translate-x-5',
  large: 'h-6 w-12 after:h-5 after:w-5 peer-checked:after:translate-x-6',
};

const activeColorClasses: Record<ItemColor, string> = {
  grey: `peer-checked:bg-[color:var(--color-grey)]`,
  red: `peer-checked:bg-[color:var(--color-red)]`,
  orange: `peer-checked:bg-[color:var(--color-orange)]`,
  yellow: `peer-checked:bg-[color:var(--color-yellow)]`,
  green: `peer-checked:bg-[color:var(--color-green)]`,
  blue: `peer-checked:bg-[color:var(--color-blue)]`,
  purple: `peer-checked:bg-[color:var(--color-purple)]`,
  pink: `peer-checked:bg-[color:var(--color-pink)]`,
  violet: `peer-checked:bg-[color:var(--color-violet)]`,
  white: `peer-checked:bg-[color:var(--color-white)]`,
};

const topOffset: Record<ItemSize, string> = {
  small: 'translate-y-[-3px] peer-hover:translate-y-[-5px]',
  medium: 'translate-y-[-4px] peer-hover:translate-y-[-6px]',
  large: 'translate-y-[-5px] peer-hover:translate-y-[-7px]',
};

export function Toggle({
  size = 'medium',
  color = 'grey',
  className = '',
  label = '',
  ...props
}: CheckboxProps) {
  const commonClasses = [
    'bg-[#bfbfbf]  transition-transform duration-100 \
	rounded-full peer-active:translate-y-[0px]',
  ];
  const topClass = [
    className,
    commonClasses,
    'relative peer peer-checked:after:border-buffer after:content-[""] \
	after:absolute after:bg-white after:rounded-full after:top-[2px] \
	after:start-[2px] after:transition-all ',
    sizeClasses[size],
    activeColorClasses[color],
    topOffset[size],
  ]
    .filter(Boolean)
    .join(' ');
  const botClass = [
    className,
    commonClasses,
    'absolute',
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
      <div
        className={`${botClass}`}
        style={{ filter: 'brightness(0.8)' }}
      ></div>
      <div
        className={`translate-y-[-2px] ${botClass}`}
        style={{ filter: 'brightness(0.8)' }}
      ></div>
      <div className={`${topClass}`}></div>
      <span className={`${className} select-none ms-3 text-md font-bold`}>
        {label}
      </span>
    </label>
  );
}
