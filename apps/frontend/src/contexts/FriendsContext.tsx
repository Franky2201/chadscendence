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
    refreshFriends: (silent?: boolean) => Promise<void>;
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

    const refreshFriends = useCallback(
        async (silent = false) => {
            if (!user) {
                setFriends([]);
                setRequests([]);
                setSentRequests([]);
                if (!silent) setIsLoading(false);
                return;
            }

            try {
                if (!silent) setIsLoading(true);
                const [friendsData, requestsData, sentRequestsData] =
                    await Promise.all([
                        getFriends(),
                        getPendingRequests(),
                        getSentRequests(),
                    ]);
                setFriends(friendsData);
                setRequests(requestsData);
                setSentRequests(sentRequestsData);
            } catch (error) {
                console.error(error);
            } finally {
                if (!silent) setIsLoading(false);
            }
        },
        [user],
    );

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void refreshFriends();
    }, [refreshFriends]);

    useEffect(() => {
        if (!user) return;

        const handleFriendshipUpdated = () => {
            void refreshFriends(true);
        };

        socket.on("friendship_updated", handleFriendshipUpdated);

        return () => {
            socket.off("friendship_updated", handleFriendshipUpdated);
        };
    }, [user, refreshFriends]);

    const acceptRequest = async (friendshipId: string) => {
        const req = requests.find((r) => r.friendshipId === friendshipId);
        if (req) {
            setRequests((prev) =>
                prev.filter((r) => r.friendshipId !== friendshipId),
            );
            setFriends((prev) => [
                ...prev,
                {
                    friendshipId: req.friendshipId,
                    id: req.requesterId,
                    username: req.username,
                    avatarUrl: req.avatarUrl,
                    status: "offline",
                },
            ]);
        }
        await acceptFriendRequest(friendshipId);
        void refreshFriends(true);
    };

    const declineRequest = async (friendshipId: string) => {
        setRequests((prev) =>
            prev.filter((r) => r.friendshipId !== friendshipId),
        );
        await removeFriend(friendshipId);
        void refreshFriends(true);
    };

    const handleRemoveFriend = async (friendshipId: string) => {
        setFriends((prev) =>
            prev.filter((f) => f.friendshipId !== friendshipId),
        );
        await removeFriend(friendshipId);
        void refreshFriends(true);
    };

    const handleSendRequest = async (userId: string) => {
        setSentRequests((prev) => [
            ...prev,
            {
                friendshipId: `temp-${Date.now()}`,
                addresseeId: userId,
                username: "...",
                avatarUrl: "",
            },
        ]);
        await sendFriendRequest(userId);
        void refreshFriends(true);
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
