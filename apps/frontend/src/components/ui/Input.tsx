import type { InputHTMLAttributes } from 'react';
import { type ThemeName, useTheme } from '../../themeContext';

type InputSize = 'small' | 'medium' | 'large';

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  size?: InputSize;
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
    'bg-white text-slate-900 border-slate-200 placeholder:text-slate-400 focus-visible:ring-slate-300',
  dark: 'bg-slate-950 text-slate-50 border-slate-500 placeholder:text-slate-400 focus-visible:ring-slate-400',
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
