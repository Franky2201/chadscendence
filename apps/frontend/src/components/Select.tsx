import type { SelectHTMLAttributes } from 'react';
import { type ThemeName, useTheme } from '../themeContext';

type SelectSize = 'small' | 'medium' | 'large';

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> & {
  size?: SelectSize;
};

const baseClasses =
  '\
	block \
	rounded-full \
	border \
	appearance-none \
	font-bold \
	transition-all \
	shadow-lg \
	focus-visible:outline-none \
	focus-visible:ring-2 \
	focus-visible:ring-offset-2 \
	disabled:cursor-not-allowed \
	disabled:opacity-60\
	active:scale-95';

const sizeClasses: Record<SelectSize, string> = {
  small: 'pl-4 pr-12 py-2 text-sm',
  medium: 'pl-6 pr-14 py-3 text-base',
  large: 'pl-8 pr-16 py-4 text-lg',
};

const themeClasses: Record<ThemeName, string> = {
  light:
    'bg-white text-slate-900 border-slate-200 focus-visible:ring-slate-300',
  dark: 'bg-slate-900 text-slate-100 border-slate-700 focus-visible:ring-slate-600',
};

const baseIconClass = 'pointer-events-none absolute h-6 w-6 -translate-y-1/2';

const iconSizeClasses: Record<SelectSize, string> = {
  small: 'top-8.5 right-4',
  medium: 'top-10 right-6',
  large: 'top-12 right-8',
};

const iconColorClasses: Record<ThemeName, string> = {
  light: '',
  dark: 'filter brightness-0 invert',
};

export function Select({
  size = 'medium',
  className = '',
  ...props
}: SelectProps) {
  const { theme } = useTheme();
  const classes = [
    baseClasses,
    sizeClasses[size],
    themeClasses[theme],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="relative inline-block">
      <select className={classes} {...props} />
      <img
        src="/selector.svg"
        alt=""
        aria-hidden="true"
        className={`${baseIconClass} ${iconSizeClasses[size]} ${iconColorClasses[theme]}`}
      />
    </div>
  );
}
