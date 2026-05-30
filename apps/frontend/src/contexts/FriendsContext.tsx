import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
    useCallback,
} from "react";
import {
    type Friend,
    type FriendRequest,
    type SentRequest,
    getFriends,
    getPendingRequests,
    getSentRequests,
    acceptFriendRequest,
    removeFriend,
    sendFriendRequest,
} from "../services/friends";
import { useAuth } from "./AuthContext";
import { socket } from "../services/socket";
import {
    type BlockedUser,
    getBlockedUsers,
    blockUser as apiBlockUser,
    unblockUser as apiUnblockUser,
} from "../services/blocks";

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
    blockUser: (userId: string) => Promise<void>;
    blockedUsers: BlockedUser[];
    unblockUser: (userId: string) => Promise<void>;
}

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

export function FriendsProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();

    const [friends, setFriends] = useState<Friend[]>([]);
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [sentRequests, setSentRequests] = useState<SentRequest[]>([]);
    const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refreshFriends = useCallback(async () => {
        if (!user) {
            setFriends([]);
            setRequests([]);
            setSentRequests([]);
            setBlockedUsers([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const [
                friendsData,
                requestsData,
                sentRequestsData,
                blockedUsersData,
            ] = await Promise.all([
                getFriends(),
                getPendingRequests(),
                getSentRequests(),
                getBlockedUsers(),
            ]);
            setFriends(friendsData);
            setRequests(requestsData);
            setSentRequests(sentRequestsData);
            setBlockedUsers(blockedUsersData);
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
                setFriends((prevFriends) =>
                    prevFriends.map((friend) =>
                        friend.id === userId ? { ...friend, status } : friend,
                    ),
                );
            },
        );

        return () => {
            socket.off("user_status");
        };
    }, [user]);

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

    const handleBlockUser = async (userId: string) => {
        await apiBlockUser(userId);
        await refreshFriends();
    };

    const handleUnblockUser = async (userId: string) => {
        await apiUnblockUser(userId);
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
                blockUser: handleBlockUser,
                blockedUsers,
                unblockUser: handleUnblockUser,
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
