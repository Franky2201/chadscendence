import type { ReactNode } from 'react';
import { type ThemeName, useTheme } from '../themeContext';

type WindowProps = {
  children: ReactNode;
  className?: string;
};

const baseClasses = 'min-h-screen font-sans p-8';

const themeClasses: Record<ThemeName, string> = {
  light: 'bg-slate-50 text-slate-900',
  dark: 'bg-slate-950 text-slate-100',
};

const themeButtonBaseClasses =
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
	cursor-pointer';

const themeButtonClasses: Record<ThemeName, string> = {
  light:
    'bg-slate-900 text-white border-slate-800 hover:bg-slate-800 \
		focus-visible:ring-slate-400 focus-visible:ring-offset-slate-50',
  dark: 'bg-slate-100 text-slate-900 border-slate-200 hover:bg-white \
		focus-visible:ring-slate-500 focus-visible:ring-offset-slate-950',
};

export function Window({ children, className = '' }: WindowProps) {
  const { theme, toggleTheme } = useTheme();
  const classes = [baseClasses, themeClasses[theme], className]
    .filter(Boolean)
    .join(' ');
  const buttonClasses = [themeButtonBaseClasses, themeButtonClasses[theme]]
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
