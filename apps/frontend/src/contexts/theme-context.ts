import { createContext, useContext } from 'react';

export type ThemeName = 'light' | 'dark';

export type ThemeContextValue = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export const themeOrder: ThemeName[] = ['light', 'dark'];

export function getNextTheme(theme: ThemeName) {
  const currentIndex = themeOrder.indexOf(theme);
  const nextIndex =
    currentIndex === -1 ? 0 : (currentIndex + 1) % themeOrder.length;
  return themeOrder[nextIndex];
}
