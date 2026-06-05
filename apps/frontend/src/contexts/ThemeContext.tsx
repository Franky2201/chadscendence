import type { ReactNode } from "react";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

export type ThemeName =
    | "grey"
    | "red"
    | "orange"
    | "yellow"
    | "green"
    | "blue"
    | "purple"
    | "pink"
    | "violet"
    | "white"
    | "black";

const themeList: ThemeName[] = [
    "grey",
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "purple",
    "pink",
    "violet",
    "white",
    "black",
];

const themeStorageKey = "theme";

interface ThemeContextType {
    theme: ThemeName;
    setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: ThemeName;
}

export function ThemeProvider({
    children,
    defaultTheme = "grey",
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<ThemeName>(() => {
        if (typeof window === "undefined") {
            return defaultTheme;
        }

        const stored = window.localStorage.getItem(themeStorageKey);
        return (
            themeList.includes(stored as ThemeName) ? stored : defaultTheme
        ) as ThemeName;
    });

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        window.localStorage.setItem(themeStorageKey, theme);
    }, [theme]);

    const updateTheme = useCallback((nextTheme: ThemeName) => {
        setTheme(nextTheme);
    }, []);

    const value = useMemo(
        () => ({ theme, setTheme: updateTheme }),
        [theme, updateTheme],
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
