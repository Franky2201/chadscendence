import { useMemo, type ReactNode } from 'react';
import { type ThemeName, useTheme } from '../../contexts/theme-context';
import { type ItemColor, resolveItemColor } from './unified';
import FlickeringGrid from '../download/flickering-pattern';

type WindowProps = {
  children: ReactNode;
  className?: string;
  gridColor?: ItemColor;
};

const themeBackgroundClasses: Record<ThemeName, string> = {
  light: 'bg-neutral-100',
  dark: 'bg-neutral-900',
};

const themeButtonClasses: Record<ThemeName, string> = {
  light:
    'bg-zinc-900 text-zinc-50 border-zinc-800 hover:bg-zinc-800 \
		focus-visible:ring-zinc-400 focus-visible:ring-offset-zinc-100',
  dark: 'bg-zinc-100 text-zinc-900 border-zinc-200 hover:bg-white \
		focus-visible:ring-zinc-500 focus-visible:ring-offset-zinc-950',
};

export function Window({
  children,
  className = '',
  gridColor = 'grey',
}: WindowProps) {
  const { theme, toggleTheme } = useTheme();
  const resolvedGridColor = useMemo(() => resolveItemColor(gridColor), [gridColor]);
  const classes = [
    'min-h-screen relative overflow-hidden font-sans p-8',
	themeBackgroundClasses[theme],
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const buttonClasses = [
    'z-10 fixed bottom-6 right-6 inline-flex h-12 w-12 items-center \
	justify-center rounded-full border shadow-lg transition-all \
	focus-visible:outline-none focus-visible:ring-2 \
	focus-visible:ring-offset-2 active:scale-95 cursor-pointer \
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
	  <FlickeringGrid
        className="pointer-events-none absolute inset-0 z-0 size-full"
        squareSize={4}
        gridGap={6}
        color={resolvedGridColor}
        maxOpacity={0.5}
        flickerChance={1}
      />
	  <div className="relative z-10">{children}</div>
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
