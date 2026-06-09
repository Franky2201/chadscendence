export enum FriendshipStatus {
	PENDING = "pending",
	ACCEPTED = "accepted",
}

export interface Friend {
	friendshipId: string;
	id: string;
	username: string;
	avatarUrl: string;
	status: "online" | "offline";
}

export interface FriendRequest {
	friendshipId: string;
	requesterId: string;
	username: string;
	avatarUrl: string;
}

export interface SentRequest {
	friendshipId: string;
	addresseeId: string;
	username: string;
	avatarUrl: string;
}

export interface MessageResponse {
	message: string;
}
