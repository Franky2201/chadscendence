import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { ThemeContext, getNextTheme, type ThemeName } from './theme-context';

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: ThemeName;
};

export function ThemeProvider({
  children,
  defaultTheme = 'light',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeName>(defaultTheme);
  const toggleTheme = useCallback(() => {
    setTheme((current) => getNextTheme(current));
  }, []);
  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, toggleTheme],
  );
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
