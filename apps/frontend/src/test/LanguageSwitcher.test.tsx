import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LanguageSwitcher from "../components/LanguageSwitcher";

const mockChangeLanguage = vi.fn();

vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        i18n: {
            changeLanguage: mockChangeLanguage,
            resolvedLanguage: "en",
        },
    }),
}));

describe("LanguageSwitcher Component", () => {
    it("renders all language buttons", () => {
        render(<LanguageSwitcher />);
        expect(screen.getByText("FR")).toBeDefined();
        expect(screen.getByText("EN")).toBeDefined();
        expect(screen.getByText("NL")).toBeDefined();
    });

    it("calls changeLanguage('fr') when FR button is clicked", () => {
        render(<LanguageSwitcher />);
        const frButton = screen.getByText("FR");
        fireEvent.click(frButton);
        expect(mockChangeLanguage).toHaveBeenCalledWith("fr");
    });

    it("calls changeLanguage('du') when NL button is clicked", () => {
        render(<LanguageSwitcher />);
        const nlButton = screen.getByText("NL");
        fireEvent.click(nlButton);
        expect(mockChangeLanguage).toHaveBeenCalledWith("du");
    });
});
