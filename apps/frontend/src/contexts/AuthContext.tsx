import type { ReactNode } from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { checkAuthStatus, logout as logoutAuth } from "../services/auth";
import type { User } from "@chad/types";
import { socket } from "../services/socket";
import { useCallback } from "react";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (userData: User) => void;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { t } = useTranslation();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = (userData: User) => {
        if (userData && userData.id && userData.username) {
            setUser(userData);
        }
    };

    const logout = useCallback(async () => {
        try {
            await logoutAuth();
            setUser(null);
        } catch (error) {
            console.error("Erreur lors de la déconnexion", error);
        }
    }, []);

    const refreshUser = useCallback(async () => {
        try {
            const data = await checkAuthStatus();
            if (data.isAuthenticated && data.user) {
                setUser(data.user);
                if (data.user.accountStatus === "banned") {
                    await logout();
                    if (window.location.pathname !== "/banned") {
                        window.location.href = "/banned";
                    }
                    // // Stop socket if banned
                    // if (socket.connected)
                    //     socket.disconnect();
                } else if (!socket.connected) {
                    socket.connect();
                }
            } else {
                setUser(null);
                socket.disconnect();
            }
        } catch {
            setUser(null);
            socket.disconnect();
        }
    }, [logout]);

    useEffect(() => {
        socket.on("banned", () => {
            window.location.href = "/banned";
        });

        return () => {
            socket.off("banned");
        };
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("error") === "banned") {
            toast.error(t("auth.bannedError"));
            window.history.replaceState({}, "", window.location.pathname);
            window.location.href = "/banned";
        }

        const initAuth = async () => {
            await refreshUser();
            setIsLoading(false);
        };

        void initAuth();
    }, [t, refreshUser]);

    return (
        <AuthContext.Provider
            value={{ user, isLoading, login, logout, refreshUser }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth doit être utilisé dans un AuthProvider");
    }
    return context;
};
