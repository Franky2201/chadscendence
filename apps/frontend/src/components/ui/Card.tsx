import type { HTMLAttributes } from 'react';
import { Title } from './index';
import { type ThemeName, useTheme } from '../../contexts/theme-context';

type CardProps = HTMLAttributes<HTMLElement> & {
  className?: string;
  title?: string;
  contentClassName?: string;
};

const themeClasses: Record<ThemeName, string> = {
  light: 'bg-neutral-200 border-neutral-300 text-neutral-900',
  dark: 'bg-neutral-800 border-neutral-500 text-neutral-200',
};

export function Card({
  children,
  className = '',
  title = '',
  contentClassName = 'justify-center',
  ...props
}: CardProps) {
  const { theme } = useTheme();
  const classes = [
    'rounded-3xl border border-3 px-4 py-4 transition-colors duration-300 \
	ease-in-out justify-center',
    themeClasses[theme],
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <section className={classes} {...props}>
      <Title className="mb-3 self-start">{title}</Title>
      <div className={`${contentClassName} flex flex-col gap-3 w-full h-full`}>
        {children}
      </div>
    </section>
  );
}
