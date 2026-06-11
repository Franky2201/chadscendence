export interface RoomPlayer {
	id: string;
	username: string;
	host: boolean;
	status: "online" | "pending";
}

export interface Room {
	code: string;
	hostId: string;
	selectedGames: string[];
	players: RoomPlayer[];
	createdAt: string | Date;
	updatedAt: string | Date;
}
