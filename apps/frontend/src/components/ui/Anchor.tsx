import type { AnchorHTMLAttributes } from 'react';

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

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  size?: ButtonSize;
  color?: ButtonColor;
};

const sizeClasses: Record<ButtonSize, string> = {
  small: 'text-lg',
  medium: 'text-xl',
  large: 'text-2xl',
};

const colorHoverClasses: Record<ButtonColor, string> = {
  grey: 'text-[#bfbfbf]',
  red: 'text-[#ff9191]',
  orange: 'text-[#ffc780]',
  yellow: 'text-[#fff190]',
  green: 'text-[#daffb6]',
  blue: 'text-[#6dd8fe]',
  purple: 'text-[#d791ff]',
  pink: 'text-[#ffbfff]',
  violet: 'text-[#a9a3ff]',
  white: 'text-[#f8f8f8]',
};

export function Anchor({
  size = 'medium',
  color = 'grey',
  children,
  className = '',
  ...props
}: AnchorProps) {
  const anchorClasses = [
    '\
    select-none \
    cursor-pointer \
    font-bold \
    transition-colors \
    transition-transform \
    duration-100 \
    ease-in-out \
	hover:scale-130 \
    text-shadow-md/100 \
	hover:text-shadow-lg/100 \
    active:translate-y-[+3px] \
	active:select-none',
    sizeClasses[size],
    colorHoverClasses[color],
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <a className={anchorClasses} {...props}>
      {children}
    </a>
  );
}
