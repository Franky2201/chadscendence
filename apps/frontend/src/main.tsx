import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./index.css";
import "./i18n/config";
import { ModalProvider } from "./contexts/ModalContext";
import { FriendsProvider } from "./contexts/FriendsContext";
import { ChatProvider } from "./contexts/ChatContext";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <AuthProvider>
                <ModalProvider>
                    <FriendsProvider>
                        <ChatProvider>
                            <RouterProvider router={router} />
                            <Toaster richColors position="top-right" />
                        </ChatProvider>
                    </FriendsProvider>
                </ModalProvider>
            </AuthProvider>
        </ThemeProvider>
    </StrictMode>,
);
