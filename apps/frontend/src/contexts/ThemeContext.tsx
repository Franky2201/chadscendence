import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
  createContext,
  useContext,
} from 'react';

export type ThemeName = 'light' | 'dark';

type ThemeContextValue = {
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

const themeOrder: ThemeName[] = ['light', 'dark'];

function getNextTheme(theme: ThemeName) {
  const currentIndex = themeOrder.indexOf(theme);
  const nextIndex =
    currentIndex === -1 ? 0 : (currentIndex + 1) % themeOrder.length;
  return themeOrder[nextIndex];
}

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
