import type { ReactNode } from 'react';
import { type ThemeName, useTheme } from '../../contexts/theme-context';

type CardProps = {
  children: ReactNode;
  className?: string;
};

const themeClasses: Record<ThemeName, string> = {
  light: 'bg-neutral-200 border-neutral-300 text-neutral-900',
  dark: 'bg-neutral-800 border-neutral-500 text-neutral-200',
};

export function Card({ children, className = '' }: CardProps) {
  const { theme } = useTheme();
  const classes = [
    'rounded-3xl border border-3 px-4 py-8 transition-colors duration-300 \
	ease-in-out',
    themeClasses[theme],
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return <section className={classes}> {children} </section>;
}
