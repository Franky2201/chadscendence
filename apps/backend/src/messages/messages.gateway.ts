import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { PresenceService } from "../presence/presence.service";
import { Message } from "src/messages/message.entity";

@WebSocketGateway({
    cors: {
        origin: (origin, callback) => {
            const frontendUrl =
                process.env.FRONTEND_URL || "http://localhost:5173";
            if (!origin || origin === frontendUrl) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        },
        credentials: true,
    },
})
export class MessagesGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly presenceService: PresenceService) { }

    notifyNewMessage(receiverId: string, message: Message) {
        const clients: string[] =
            this.presenceService.getUserClients(receiverId);

        clients.forEach((clientId) => {
            this.server.to(clientId).emit("new_message", message);
        });
    }
}
