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
  small: 'text-2xl',
  medium: 'text-3xl',
  large: 'text-4xl',
};

const colorClasses: Record<ButtonColor, string> = {
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
  const textClasses = [
    'font-energy font-bold leading-none group-active:translate-y-0 \
	transition-transform duration-100 ease-in-out',
    sizeClasses[size],
    colorClasses[color],
  ]
    .filter(Boolean)
    .join(' ');
  const anchorClasses = [
    'group relative inline-block select-none cursor-pointer',
    'transition-transform duration-100 ease-in-out hover:scale-120',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const shadowClasses = [
    'absolute left-0 top-0 pointer-events-none',
    textClasses,
  ]
    .filter(Boolean)
    .join(' ');
  const topTextClasses = ['relative inline-block ease-in-out', textClasses]
    .filter(Boolean)
    .join(' ');
  return (
    <a className={anchorClasses} {...props}>
      <span
        className={`${shadowClasses}`}
        style={{ filter: 'brightness(0.8)' }}
        aria-hidden="true"
      >
        {children}
      </span>
      <span
        className={`translate-y-[-1px] ${shadowClasses}`}
        style={{ filter: 'brightness(0.8)' }}
        aria-hidden="true"
      >
        {children}
      </span>
      <span
        className={`translate-y-[-2px] ${shadowClasses}`}
        style={{ filter: 'brightness(0.8)' }}
        aria-hidden="true"
      >
        {children}
      </span>
      <span
        className={`translate-y-[-3px] ${shadowClasses}`}
        style={{ filter: 'brightness(0.8)' }}
        aria-hidden="true"
      >
        {children}
      </span>
      <span
        className={`translate-y-[-4px] ${shadowClasses}`}
        style={{ filter: 'brightness(0.8)' }}
        aria-hidden="true"
      >
        {children}
      </span>
      <span className={`translate-y-[-5px] ${topTextClasses}`}>{children}</span>
    </a>
  );
}
