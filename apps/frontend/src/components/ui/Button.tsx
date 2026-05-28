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

const textColorStyles: Record<ItemColor, string> = {
  grey: 'color-mix(in srgb, var(--color-grey) 65%, black)',
  red: 'color-mix(in srgb, var(--color-red) 65%, black)',
  orange: 'color-mix(in srgb, var(--color-orange) 65%, black)',
  yellow: 'color-mix(in srgb, var(--color-yellow) 65%, black)',
  green: 'color-mix(in srgb, var(--color-green) 65%, black)',
  blue: 'color-mix(in srgb, var(--color-blue) 65%, black)',
  purple: 'color-mix(in srgb, var(--color-purple) 65%, black)',
  pink: 'color-mix(in srgb, var(--color-pink) 65%, black)',
  violet: 'color-mix(in srgb, var(--color-violet) 65%, black)',
  white: 'color-mix(in srgb, var(--color-white) 65%, black)',
};

export function Button({
  size = 'medium',
  color = 'grey',
  borderRadius = 'rounded-xl',
  children,
  className = '',
  style,
  ...props
}: ButtonProps) {
  const divClasses = [
    'group relative overflow-visible border-none select-none',
    borderRadius,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const buttonClasses = [
    'inline-flex items-center justify-center \
	transition-transform duration-100 ease-in-out select-none \
	group-active:translate-y-0 font-bold',
    borderRadius,
    props.disabled ? 'bg-[color:var(--color-grey)]' : colorClasses[color],
    sizeClasses[size],
    className,
    props.disabled
      ? 'translate-y-0 cursor-not-allowed'
      : 'translate-y-[-5px] group-hover:translate-y-[-7px] cursor-pointer',
  ]
    .filter(Boolean)
    .join(' ');
  const spanBotClasses = [
    'absolute inset-0 pointer-events-none',
    borderRadius,
    props.disabled ? 'bg-[color:var(--color-grey)]' : colorClasses[color],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const buttonStyle = {
    ...style,
    color: textColorStyles[color],
  };
  return (
    <div className={divClasses}>
      <span className={spanBotClasses} style={{ filter: 'brightness(0.8)' }} />
      <button
        type="button"
        className={`${buttonClasses}`}
        style={buttonStyle}
        {...props}
      >
        {children}
      </button>
    </div>
  );
}
