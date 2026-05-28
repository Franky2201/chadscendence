import type { AnchorHTMLAttributes } from 'react';
import type { ItemColor, ItemSize } from './unified';
import { getItemColorStyle, getItemColorTextStyle } from './unified';

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  size?: ItemSize;
  color?: ItemColor;
};

const sizeClasses: Record<ItemSize, string> = {
  small: 'text-2xl',
  medium: 'text-3xl',
  large: 'text-4xl',
};

export function Anchor({
  size = 'medium',
  color = 'grey',
  children,
  className = '',
  style,
  ...props
}: AnchorProps) {
  const textClasses = [
    'font-energy font-bold leading-none group-active:translate-y-0 \
	transition-transform duration-100 ease-in-out',
    sizeClasses[size as ItemSize],
    'text-[color:var(--ui-color)]',
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
  const colorStyle = getItemColorTextStyle(color, 80);
  const topColorStyle = getItemColorStyle(color);
  return (
    <a className={anchorClasses} style={{ ...style, ...colorStyle }} {...props}>
      <span
        className={`${shadowClasses}`}
        style={{ ...colorStyle }}
        aria-hidden="true"
      >
        {children}
      </span>
      <span
        className={`translate-y-[-1px] ${shadowClasses}`}
        style={{ ...colorStyle }}
        aria-hidden="true"
      >
        {children}
      </span>
      <span
        className={`translate-y-[-2px] ${shadowClasses}`}
        style={{ ...colorStyle }}
        aria-hidden="true"
      >
        {children}
      </span>
      <span
        className={`translate-y-[-3px] ${shadowClasses}`}
        style={{ ...colorStyle }}
        aria-hidden="true"
      >
        {children}
      </span>
      <span
        className={`translate-y-[-4px] ${shadowClasses}`}
        style={{ ...colorStyle }}
        aria-hidden="true"
      >
        {children}
      </span>
      <span
        className={`translate-y-[-5px] ${topTextClasses}`}
        style={topColorStyle}
      >
        {children}
      </span>
    </a>
  );
}
