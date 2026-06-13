import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { socket } from "../services/socket";

interface PresenceContextType {
    onlineUsers: Record<string, "online" | "offline">;
    isUserOnline: (userId: string) => boolean;
}

const PresenceContext = createContext<PresenceContextType | undefined>(
    undefined,
);

export function PresenceProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [onlineUsers, setOnlineUsers] = useState<
        Record<string, "online" | "offline">
    >({});

    useEffect(() => {
        if (!user) {
            socket.disconnect();
            return;
        }

        socket.connect();

        const handleUserStatus = ({
            userId,
            status,
        }: {
            userId: string;
            status: "online" | "offline";
        }) => {
            setOnlineUsers((prev) => ({
                ...prev,
                [userId]: status,
            }));
        };

        socket.on("user_status", handleUserStatus);

        return () => {
            socket.off("user_status", handleUserStatus);
        };
    }, [user]);

    const displayedOnlineUsers = user ? onlineUsers : {};

    return (
        <PresenceContext.Provider
            value={{
                onlineUsers: displayedOnlineUsers,
                isUserOnline: (userId) =>
                    displayedOnlineUsers[userId] === "online",
            }}
        >
            {children}
        </PresenceContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePresence = () => {
    const context = useContext(PresenceContext);
    if (context === undefined) {
        throw new Error(
            "usePresence doit être utilisé dans un PresenceProvider",
        );
    }
    return context;
};
