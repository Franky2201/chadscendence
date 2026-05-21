import type { InputHTMLAttributes, ReactNode } from 'react';
import { useId } from 'react';
import { type ThemeName, useTheme } from '../../themeContext';

type InputSize = 'small' | 'medium' | 'large';

type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> & {
  size?: InputSize;
  label?: ReactNode;
  containerClassName?: string;
  labelClassName?: string;
};

const baseClasses =
  '\
	inline-flex \
	items-center \
	justify-center \
	gap-2 \
	rounded-full \
	border \
	px-4 \
	py-2 \
	font-bold \
	group \
	relative \
	transition-all \
	shadow-lg \
	active:scale-95 \
	select-none';

const stateClasses =
  '\
	cursor-pointer \
	peer-focus-visible:ring-2 \
	peer-focus-visible:ring-offset-2 \
	peer-checked:shadow-xl \
	peer-disabled:cursor-not-allowed \
	peer-disabled:opacity-60';

const sizeClasses: Record<InputSize, string> = {
  small: 'px-4 py-2 text-sm',
  medium: 'px-6 py-3 text-base',
  large: 'px-8 py-4 text-lg',
};

const iconInsetClasses: Record<InputSize, string> = {
  small: 'pl-10 pr-10',
  medium: 'pl-12 pr-12',
  large: 'pl-14 pr-14',
};

const iconWrapperBaseClasses =
  'absolute inline-flex items-center justify-center';

const iconWrapperSizeClasses: Record<InputSize, string> = {
  small: 'h-5 w-5 left-2',
  medium: 'h-6 w-6 left-3',
  large: 'h-7 w-7 left-4',
};

const iconToggleClasses =
  "[&_[data-icon='checked']]:hidden peer-checked:[&_[data-icon='checked']]:inline-flex peer-checked:[&_[data-icon='unchecked']]:hidden";

const iconImageClasses = 'h-full w-full scale-150 transition';

const iconColorClasses: Record<ThemeName, string> = {
  light: 'filter brightness-0 invert group-hover:invert-0',
  dark: 'filter brightness-0 group-hover:invert',
};

const checkboxThemeClasses: Record<ThemeName, string> = {
  light:
    'bg-rose-600 text-white border-rose-700 \
  		hover:text-slate-900 ring-rose-300 peer-checked:bg-emerald-500 \
		peer-checked:text-white peer-checked:border-emerald-600 \
		peer-checked:ring-emerald-400',
  dark: 'bg-rose-600 text-slate-900 border-rose-700 \
		hover:text-white ring-rose-300 peer-checked:bg-emerald-500 \
		peer-checked:text-slate-900 peer-checked:border-emerald-600 \
		peer-checked:ring-emerald-400',
};

export function Checkbox({
  size = 'medium',
  label = '',
  containerClassName = '',
  labelClassName = '',
  className = '',
  id,
  ...props
}: CheckboxProps) {
  const { theme } = useTheme();
  const reactId = useId();
  const resolvedId = id ?? reactId;
  const containerClasses = ['inline-flex items-center', containerClassName]
    .filter(Boolean)
    .join(' ');
  const buttonClasses = [
    baseClasses,
    sizeClasses[size],
    iconInsetClasses[size],
    stateClasses,
    iconToggleClasses,
    checkboxThemeClasses[theme],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const iconWrapperClasses = [
    iconWrapperBaseClasses,
    iconWrapperSizeClasses[size],
  ]
    .filter(Boolean)
    .join(' ');

  const resolvedLabelClasses = ['flex-1 text-center', labelClassName]
    .filter(Boolean)
    .join(' ');
  const iconClasses = `${iconImageClasses} ${iconColorClasses[theme]}`;

  return (
    <label htmlFor={resolvedId} className={containerClasses}>
      <input
        id={resolvedId}
        type="checkbox"
        className="peer sr-only"
        {...props}
      />
      <span className={buttonClasses}>
        <span className={iconWrapperClasses} data-icon="unchecked">
          <img
            src="/check.svg"
            alt=""
            aria-hidden="true"
            className={iconClasses}
          />
        </span>
        <span className={iconWrapperClasses} data-icon="checked">
          <img
            src="/checked.svg"
            alt=""
            aria-hidden="true"
            className={iconClasses}
          />
        </span>
        {label ? <span className={resolvedLabelClasses}>{label}</span> : null}
      </span>
    </label>
  );
}
