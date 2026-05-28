export type ItemSize = 'small' | 'medium' | 'large';

export type ItemColor =
  | 'grey'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'violet'
  | 'white';

export const itemColorVariables: Record<ItemColor, string> = {
  grey: '--color-grey',
  red: '--color-red',
  orange: '--color-orange',
  yellow: '--color-yellow',
  green: '--color-green',
  blue: '--color-blue',
  purple: '--color-purple',
  pink: '--color-pink',
  violet: '--color-violet',
  white: '--color-white',
};

export function resolveItemColor(color: ItemColor) {
  if (typeof window === 'undefined') {
    return '';
  }

  const variableName = itemColorVariables[color];
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
}
