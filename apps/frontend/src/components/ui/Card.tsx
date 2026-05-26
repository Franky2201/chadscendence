import type { ReactNode } from 'react';
import { type ThemeName, useTheme } from '../../contexts/theme-context';

type CardProps = {
  children: ReactNode;
  className?: string;
};

const baseClasses = 'rounded-3xl shadow-2xl border px-8 py-12';

const themeClasses: Record<ThemeName, string> = {
  light: 'bg-neutral-50 border-neutral-200 text-neutral-900',
  dark: 'bg-neutral-950 border-neutral-800 text-neutral-100',
};

export function Card({ children, className = '' }: CardProps) {
  const { theme } = useTheme();
  const classes = [baseClasses, themeClasses[theme], className]
    .filter(Boolean)
    .join(' ');
  return <section className={classes}> {children} </section>;
}
