import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { PresenceService } from "../presence/presence.service";
import { Message } from "src/common/entities/message.entity";

@WebSocketGateway({
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
})
export class MessagesGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly presenceService: PresenceService) {}

    notifyNewMessage(receiverId: string, message: Message) {
        const clients = this.presenceService.getUserClients(receiverId);
        clients.forEach((clientId) => {
            this.server.to(clientId).emit("new_message", message);
        });
    }
}
