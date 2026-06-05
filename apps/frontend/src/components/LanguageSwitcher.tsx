import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const handleLanguageChange = (lng: "fr" | "en") => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
            <button
                onClick={() => handleLanguageChange("fr")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    i18n.resolvedLanguage === "fr"
                        ? `text-white`
                        : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
            >
                FR
            </button>
            <button
                onClick={() => handleLanguageChange("en")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    i18n.resolvedLanguage === "en"
                        ? `text-white`
                        : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
            >
                EN
            </button>
        </div>
    );
}
