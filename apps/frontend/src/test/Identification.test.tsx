import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Identification } from "../components/home/Identification";
import { ModalProvider } from "../contexts/ModalContext";

// Mock services and contexts
vi.mock("../services/auth", () => ({
    withGithub: vi.fn(),
    withIntra: vi.fn(),
}));

vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

const mockOpenModal = vi.fn();

vi.mock("../contexts/ModalContext", async () => {
    const actual = await vi.importActual("../contexts/ModalContext");
    return {
        ...actual,
        useModal: () => ({
            openModal: mockOpenModal,
        }),
    };
});

describe("Identification Component", () => {
    it("renders login and register buttons", () => {
        render(
            <ModalProvider>
                <Identification />
            </ModalProvider>,
        );

        expect(
            screen.getByText("home.identification.login.title"),
        ).toBeDefined();
        expect(
            screen.getByText("home.identification.register.title"),
        ).toBeDefined();
    });

    it("calls openModal('LOGIN') when login button is clicked", () => {
        render(
            <ModalProvider>
                <Identification />
            </ModalProvider>,
        );

        const loginButton = screen.getByText("home.identification.login.title");
        fireEvent.click(loginButton);

        expect(mockOpenModal).toHaveBeenCalledWith("LOGIN");
    });

    it("calls openModal('REGISTER') when register button is clicked", () => {
        render(
            <ModalProvider>
                <Identification />
            </ModalProvider>,
        );

        const registerButton = screen.getByText(
            "home.identification.register.title",
        );
        fireEvent.click(registerButton);

        expect(mockOpenModal).toHaveBeenCalledWith("REGISTER");
    });
});
