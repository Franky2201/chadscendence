import type { ButtonHTMLAttributes } from 'react';
import { type ThemeName, useTheme } from '../../themeContext';

type ButtonSize = 'small' | 'medium' | 'large';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ButtonSize;
};

const baseClasses =
  '\
	inline-flex \
	items-center \
	justify-center \
	rounded-full \
	font-bold \
	transition-all \
	shadow-lg \
	focus-visible:outline-none \
	focus-visible:ring-2 \
	focus-visible:ring-slate-400 \
	focus-visible:ring-offset-2 \
	active:scale-95 \
	disabled:cursor-not-allowed \
	disabled:opacity-60 \
	cursor-pointer';

const sizeClasses: Record<ButtonSize, string> = {
  small: 'px-4 py-2 text-sm',
  medium: 'px-6 py-3 text-base',
  large: 'px-8 py-4 text-lg',
};

const themeClasses: Record<ThemeName, string> = {
  light: 'bg-slate-900 text-white hover:bg-slate-800',
  dark: 'bg-slate-100 text-slate-900 hover:bg-white',
};

export function Button({
  size = 'medium',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  const { theme } = useTheme();
  const classes = [
    baseClasses,
    themeClasses[theme],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <button type={type} className={classes} {...props} />;
}
