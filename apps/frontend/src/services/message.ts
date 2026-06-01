import api from './api';

export interface MessageSender {
	id: string;
	username: string;
	avatarUrl: string;
}

export interface Message {
	id: string;
	content: string;
	createdAt: string;
	isRead: boolean;
	sender: MessageSender;
}

export const getConversation = async (friendId: string, page: number = 1): Promise<Message[]> => {
	const res = await api.get<Message[]>(`/messages/${friendId}?page=${page}`);
	return res.data;
};

export const sendMessage = async (friendId: string, content: string): Promise<Message> => {
	const res = await api.post<Message>(`/messages/${friendId}`, { content });
	return res.data;
};

export const markAsRead = async (friendId: string): Promise<void> => {
	await api.patch(`/messages/${friendId}/read`);
};
