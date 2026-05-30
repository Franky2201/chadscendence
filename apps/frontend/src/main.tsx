import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./index.css";
import { ModalProvider } from "./contexts/ModalContext";
import { FriendsProvider } from "./contexts/FriendsContext";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <AuthProvider>
                <ModalProvider>
                    <FriendsProvider>
                        <RouterProvider router={router} />
                    </FriendsProvider>
                </ModalProvider>
            </AuthProvider>
        </ThemeProvider>
    </StrictMode>,
);
