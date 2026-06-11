import { WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { RoomSession } from "@chad/types";

@WebSocketGateway({
	cors: {
		origin: process.env.FRONTEND_URL || "http://localhost:5173",
		credentials: true,
	},
	namespace: "/rooms"
})
export class RoomsGateway {
	@WebSocketServer()
	server!: Server;

	@SubscribeMessage("joinRoomChannel")
	handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() roomCode: string) {
		client.join(roomCode);
	}

	@SubscribeMessage("leaveRoomChannel")
	handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() roomCode: string) {
		client.leave(roomCode);
	}

	broadcastSessionUpdate(roomCode: string, session: RoomSession) {
		this.server.to(roomCode).emit("session_updated", session);
	}

	broadcastRoundStarted(roomCode: string, prompt: any, endsAt: string | Date) {
		this.server.to(roomCode).emit("round_started", { prompt, endsAt });
	}

	broadcastRoundEnded(roomCode: string, session: RoomSession) {
		this.server.to(roomCode).emit("round_ended", session);
	}
}
