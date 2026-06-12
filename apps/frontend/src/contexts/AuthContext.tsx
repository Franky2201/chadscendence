import type { ReactNode } from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { checkAuthStatus, logout as logoutAuth } from "../services/auth";
import type { User } from "@chad/types";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (userData: User) => void;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const data = await checkAuthStatus();
            if (data.isAuthenticated && data.user) {
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("error") === "banned") {
            toast.error("Vous ne pouvez pas vous connecter.");
            window.history.replaceState({}, "", window.location.pathname);
        }

        const initAuth = async () => {
            await refreshUser();
            setIsLoading(false);
        };

        void initAuth();
    }, []);

    const login = (userData: User) => setUser(userData);

    const logout = async () => {
        try {
            await logoutAuth();
            setUser(null);
        } catch (error) {
            console.error("Erreur lors de la déconnexion", error);
        }
    };

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
