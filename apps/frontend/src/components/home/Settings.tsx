import { Card, IconButton } from "../ui";
import { useTheme } from "../../contexts/ThemeContext";

export function Settings({ className = "" }: { className?: string }) {
    const { theme, toggleTheme } = useTheme();
    return (
        <Card className={className} title="Settings" href="/settings">
            <IconButton
                className=""
                color={theme === "dark" ? "yellow" : "blue"}
                img={theme === "dark" ? "./light.svg" : "./dark.svg"}
                imgClassName="duration-200 group-active:scale-75"
                onClick={toggleTheme}
            ></IconButton>
        </Card>
    );
}
