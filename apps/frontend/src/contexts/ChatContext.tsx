import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { type Message, getConversation, sendMessage as apiSendMessage, markAsRead } from '../services/message';
import { useAuth } from './AuthContext';
import { socket } from '../services/socket';

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

	const fetchMessages = useCallback(async (friendId: string, pageNum: number, append: boolean = false) => {
		try {
			setIsLoading(true);
			const data = await getConversation(friendId, pageNum);
			if (data.length < 50) setHasMore(false);

			setMessages(prev => append ? [...prev, ...data] : data);
			await markAsRead(friendId);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const openChat = (friend: ActiveChat) => {
		console.log("Opening chat with", friend);
		setActiveChat(friend);
		setIsOpen(true);
		setPage(1);
		setHasMore(true);
		fetchMessages(friend.id, 1);
		console.log("Messages loaded", messages);
	};

	const closeChat = () => {
		setIsOpen(false);
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
			setMessages(prev => [newMessage, ...prev]);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (!user || !isOpen || !activeChat) return;

		const handleNewMessage = (message: Message) => {
			if (message.sender.id === activeChat.id) {
				setMessages(prev => [message, ...prev]);
				markAsRead(activeChat.id).catch(console.error);
			}
		};

		socket.on('new_message', handleNewMessage);

		return () => {
			socket.off('new_message', handleNewMessage);
		};
	}, [user, isOpen, activeChat]);

	return (
		<ChatContext.Provider value={{ isOpen, activeChat, messages, isLoading, openChat, closeChat, sendMessage, loadMore }}>
			{children}
		</ChatContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => {
	const context = useContext(ChatContext);
	if (context === undefined) {
		throw new Error('useChat doit être utilisé dans un ChatProvider');
	}
	return context;
};
