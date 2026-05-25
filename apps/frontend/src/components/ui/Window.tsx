import type { ReactNode } from 'react';
import { type ThemeName, useTheme } from '../../contexts/ThemeContext';

type WindowProps = {
  children: ReactNode;
  className?: string;
};

const themeClasses: Record<ThemeName, string> = {
  light: 'text-neutral-900',
  dark: 'text-neutral-100',
};

const themeButtonClasses: Record<ThemeName, string> = {
  light:
    'bg-zinc-900 text-zinc-50 border-zinc-800 hover:bg-zinc-800 \
		focus-visible:ring-zinc-400 focus-visible:ring-offset-zinc-100',
  dark: 'bg-zinc-100 text-zinc-900 border-zinc-200 hover:bg-white \
		focus-visible:ring-zinc-500 focus-visible:ring-offset-zinc-950',
};

export function Window({ children, className = '' }: WindowProps) {
  const { theme, toggleTheme } = useTheme();
  const classes = [
    '\
	min-h-screen \
	bg-linear-110 \
	from-neutral-100 \
	to-neutral-900 \
	font-sans p-8',
    themeClasses[theme],
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const buttonClasses = [
    '\
	fixed \
	bottom-6 \
	right-6 \
	inline-flex \
	h-12 \
	w-12 \
	items-center \
	justify-center \
	rounded-full \
	border \
	shadow-lg \
	transition-all \
	focus-visible:outline-none \
	focus-visible:ring-2 \
	focus-visible:ring-offset-2 \
	active:scale-95 \
	cursor-pointer \
	select-none',
    themeButtonClasses[theme],
  ]
    .filter(Boolean)
    .join(' ');
  const isDark = theme === 'dark';
  const iconSrc = isDark ? '/light.svg' : '/dark.svg';
  const iconSizeClasses = 'h-8 w-8';
  const iconClasses = isDark
    ? iconSizeClasses
    : `${iconSizeClasses} filter brightness-0 invert`;
  return (
    <div className={classes}>
      {children}
      <button
        type="button"
        className={buttonClasses}
        onClick={toggleTheme}
        aria-label=""
      >
        <img src={iconSrc} alt="" aria-hidden="true" className={iconClasses} />
      </button>
    </div>
  );
}
