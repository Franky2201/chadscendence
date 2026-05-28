import { useCallback, useMemo, useState, type ReactNode } from "react";

import { ThemeContext, type ThemeName } from "./themeContext";

const themeOrder: ThemeName[] = ["light", "dark"];

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
    defaultTheme = "dark",
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
