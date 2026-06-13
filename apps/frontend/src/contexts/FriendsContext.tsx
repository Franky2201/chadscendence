import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
    useCallback,
} from "react";
import {
    getFriends,
    getPendingRequests,
    getSentRequests,
    acceptFriendRequest,
    removeFriend,
    sendFriendRequest,
} from "../services/friends";
import type { Friend, FriendRequest, SentRequest } from "@chad/types";
import { useAuth } from "./AuthContext";
import { socket } from "../services/socket";

interface FriendsContextType {
    friends: Friend[];
    requests: FriendRequest[];
    sentRequests: SentRequest[];
    isLoading: boolean;
    refreshFriends: () => Promise<void>;
    acceptRequest: (friendshipId: string) => Promise<void>;
    declineRequest: (friendshipId: string) => Promise<void>;
    removeFriend: (friendshipId: string) => Promise<void>;
    sendRequest: (userId: string) => Promise<void>;
}

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

export function FriendsProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();

    const [friends, setFriends] = useState<Friend[]>([]);
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [sentRequests, setSentRequests] = useState<SentRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refreshFriends = useCallback(async () => {
        if (!user) {
            setFriends([]);
            setRequests([]);
            setSentRequests([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const [friendsData, requestsData, sentRequestsData] =
                await Promise.all([
                    getFriends(),
                    getPendingRequests(),
                    getSentRequests(),
                ]);
            setFriends(Array.isArray(friendsData) ? friendsData : []);
            setRequests(Array.isArray(requestsData) ? requestsData : []);
            setSentRequests(
                Array.isArray(sentRequestsData) ? sentRequestsData : [],
            );
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        refreshFriends();
    }, [refreshFriends]);

    useEffect(() => {
        if (!user) {
            socket.disconnect();
            return;
        }

        socket.connect();

        socket.on(
            "user_status",
            ({
                userId,
                status,
            }: {
                userId: string;
                status: "online" | "offline";
            }) => {
                setFriends((prevFriends) => {
                    if (!Array.isArray(prevFriends)) return [];
                    return prevFriends.map((friend) =>
                        friend.id === userId ? { ...friend, status } : friend,
                    );
                });
            },
        );

        socket.on("friendship_updated", () => {
            void refreshFriends();
        });

        return () => {
            socket.off("user_status");
            socket.off("friendship_updated");
        };
    }, [user, refreshFriends]);

    const acceptRequest = async (friendshipId: string) => {
        await acceptFriendRequest(friendshipId);
        await refreshFriends();
    };

    const declineRequest = async (friendshipId: string) => {
        await removeFriend(friendshipId);
        await refreshFriends();
    };

    const handleRemoveFriend = async (friendshipId: string) => {
        await removeFriend(friendshipId);
        await refreshFriends();
    };

    const handleSendRequest = async (userId: string) => {
        await sendFriendRequest(userId);
        await refreshFriends();
    };

    return (
        <FriendsContext.Provider
            value={{
                friends,
                requests,
                sentRequests,
                isLoading,
                refreshFriends,
                acceptRequest,
                declineRequest,
                removeFriend: handleRemoveFriend,
                sendRequest: handleSendRequest,
            }}
        >
            {children}
        </FriendsContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFriends = () => {
    const context = useContext(FriendsContext);
    if (context === undefined) {
        throw new Error("useFriends doit être utilisé dans un FriendsProvider");
    }
    return context;
};
