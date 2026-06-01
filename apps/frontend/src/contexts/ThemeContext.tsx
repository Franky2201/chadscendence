import type { ReactNode } from "react";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

export type ThemeName = "light" | "dark";

interface ThemeContextType {
    theme: ThemeName;
    setTheme: (theme: ThemeName) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeOrder: ThemeName[] = ["light", "dark"];

function getNextTheme(theme: ThemeName): ThemeName {
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex =
        currentIndex === -1 ? 0 : (currentIndex + 1) % themeOrder.length;
    return themeOrder[nextIndex];
}

interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: ThemeName;
}

export function ThemeProvider({
    children,
    defaultTheme = "light",
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<ThemeName>(() => {
        const stored = localStorage.getItem("theme");
        if (stored === "light" || stored === "dark") {
            return stored as ThemeName;
        }
        return defaultTheme;
    });

    useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);

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

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme doit être utilisé dans un ThemeProvider");
    }
    return context;
};
