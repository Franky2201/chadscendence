import type { AnchorHTMLAttributes } from 'react';
import type { ItemColor, ItemSize } from './unified';

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  size?: ItemSize;
  color?: ItemColor;
};

const sizeClasses: Record<ItemSize, string> = {
  small: 'text-2xl',
  medium: 'text-3xl',
  large: 'text-4xl',
};

const colorClasses: Record<ItemColor, string> = {
  grey: `text-[color:var(--color-grey)]`,
  red: `text-[color:var(--color-red)]`,
  orange: `text-[color:var(--color-orange)]`,
  yellow: `text-[color:var(--color-yellow)]`,
  green: `text-[color:var(--color-green)]`,
  blue: `text-[color:var(--color-blue)]`,
  purple: `text-[color:var(--color-purple)]`,
  pink: `text-[color:var(--color-pink)]`,
  violet: `text-[color:var(--color-violet)]`,
  white: `text-[color:var(--color-white)]`,
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
    sizeClasses[size as ItemSize],
    colorClasses[color as ItemColor],
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
