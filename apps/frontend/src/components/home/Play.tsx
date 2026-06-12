import { Card, Button } from "../ui";
import { useTheme } from "../../contexts/ThemeContext";
import { getItemColorStyle, type ItemColor } from "../ui/unified";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const colorThemes: { name: ItemColor }[] = [
    { name: "grey" },
    { name: "red" },
    { name: "orange" },
    { name: "yellow" },
    { name: "green" },
    { name: "blue" },
    { name: "purple" },
    { name: "pink" },
    { name: "violet" },
];

export function Play({ className = "" }: { className?: string }) {
    const { theme, setTheme } = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Card
            className={className}
            contentClassName={`flex flex-col justify-center items-center gap-3`}
            title={t("home.play.title")}
        >
            <Button
                onClick={() => navigate("/games")}
                color={theme}
                className="w-full flex flex-col"
            >
                {t("home.play.title")}
            </Button>
            <p className="text-xs uppercase text-center">
                {t("home.play.colorTheme")}
            </p>
            <div className="flex flex-wrap gap-x-1 gap-y-2 justify-center">
                {colorThemes.map((cTheme) => (
                    <Button
                        className="h-7 w-7 bg-[var(--ui-color)]"
                        color={cTheme.name}
                        key={cTheme.name}
                        disabled={theme === cTheme.name}
                        onClick={() => setTheme(cTheme.name)}
                        style={{
                            ...getItemColorStyle(cTheme.name),
                        }}
                    >
                        {}
                    </Button>
                ))}
            </div>
        </Card>
    );
}
