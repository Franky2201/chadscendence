import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
    useCallback,
} from "react";
import {
    getConversation,
    sendMessage as apiSendMessage,
    markAsRead,
    getUnreadCounts,
} from "../services/messages";
import type { Message } from "@chad/types";
import { useAuth } from "./AuthContext";
import { socket } from "../services/socket";

export interface ActiveChat {
    id: string;
    username: string;
    avatarUrl: string;
}

interface ChatContextType {
    isOpen: boolean;
    activeChat: ActiveChat | null;
    messages: Message[];
    isLoading: boolean;
    unreadCounts: Record<string, number>;
    openPanel: () => void;
    closePanel: () => void;
    openChat: (friend: ActiveChat) => void;
    closeChat: () => void;
    sendMessage: (content: string) => Promise<void>;
    loadMore: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>(
        {},
    );

    useEffect(() => {
        if (!user) {
            Promise.resolve().then(() => setUnreadCounts({}));
            return;
        }

        getUnreadCounts().then(setUnreadCounts).catch(console.error);
    }, [user]);

    const fetchMessages = useCallback(
        async (friendId: string, pageNum: number, append: boolean = false) => {
            try {
                setIsLoading(true);
                const data = await getConversation(friendId, pageNum);
                if (data.length < 50) setHasMore(false);

                setMessages((prev) => (append ? [...prev, ...data] : data));
                await markAsRead(friendId);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    const openPanel = () => {
        setIsOpen(true);
    };

    const closePanel = () => {
        setIsOpen(false);
    };

    const openChat = (friend: ActiveChat) => {
        setActiveChat(friend);
        setIsOpen(true);
        setPage(1);
        setHasMore(true);
        setUnreadCounts((prev) => {
            if (prev[friend.id]) {
                const newCounts = { ...prev };
                delete newCounts[friend.id];
                return newCounts;
            }
            return prev;
        });
        fetchMessages(friend.id, 1);
    };

    const closeChat = () => {
        setActiveChat(null);
        setMessages([]);
    };

    const loadMore = async () => {
        if (!activeChat || isLoading || !hasMore) return;
        const nextPage = page + 1;
        setPage(nextPage);
        await fetchMessages(activeChat.id, nextPage, true);
    };

    const sendMessage = async (content: string) => {
        if (!activeChat) return;
        try {
            const newMessage = await apiSendMessage(activeChat.id, content);
            setMessages((prev) => [newMessage, ...prev]);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!user) return;

        const handleNewMessage = (message: Message) => {
            if (activeChat && message.sender.id === activeChat.id) {
                setMessages((prev) => [message, ...prev]);
                markAsRead(activeChat.id).catch(console.error);
            } else {
                setUnreadCounts((prev) => ({
                    ...prev,
                    [message.sender.id]: (prev[message.sender.id] || 0) + 1,
                }));
            }
        };

        socket.on("new_message", handleNewMessage);

        return () => {
            socket.off("new_message", handleNewMessage);
        };
    }, [user, activeChat]);

    return (
        <ChatContext.Provider
            value={{
                isOpen,
                activeChat,
                messages,
                isLoading,
                unreadCounts,
                openPanel,
                closePanel,
                openChat,
                closeChat,
                sendMessage,
                loadMore,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error("useChat doit être utilisé dans un ChatProvider");
    }
    return context;
};
