import type { InputHTMLAttributes } from 'react';
import { type ThemeName, useTheme } from '../../contexts/theme-context';

type InputSize = 'small' | 'medium' | 'large';

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  size?: InputSize;
};

const baseClasses =
  '\
	inline-flex \
	items-center \
	justify-center \
	rounded-xl \
	font-bold \
	transition-all \
	shadow-lg \
	border \
	focus-visible:outline-none \
	focus-visible:ring-2 \
	focus-visible:ring-offset-2 \
	active:scale-95 \
	disabled:cursor-not-allowed \
	disabled:opacity-60';

const sizeClasses: Record<InputSize, string> = {
  small: 'px-4 py-2 text-sm',
  medium: 'px-6 py-3 text-base',
  large: 'px-8 py-4 text-lg',
};

const themeClasses: Record<ThemeName, string> = {
  light:
    'bg-zinc-50 text-zinc-900 border-zinc-200 placeholder:text-zinc-400 focus-visible:ring-zinc-300 focus-visible:ring-offset-zinc-50',
  dark: 'bg-zinc-900 text-zinc-100 border-zinc-700 placeholder:text-zinc-500 focus-visible:ring-zinc-500 focus-visible:ring-offset-zinc-950',
};

export function Input({
  size = 'medium',
  className = '',
  type = 'text',
  ...props
}: InputProps) {
  const { theme } = useTheme();
  const classes = [
    baseClasses,
    themeClasses[theme],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <input type={type} className={classes} {...props} />;
}
