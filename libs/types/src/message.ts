export interface MessageSender {
	id: string;
	username: string;
	avatarUrl: string;
}

export interface Message {
	id: string;
	content: string;
	createdAt: string | Date;
	isRead: boolean;
	sender: MessageSender;
}

export interface CreateMessagePayload {
	content: string;
}

export type UnreadCountsResponse = Record<string, number>;
