import {
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { parse } from "cookie";
import { PresenceService } from "./presence.service";
import type { JwtPayload } from "@chad/types";

@WebSocketGateway({
    cors: {
        origin: (origin, callback) => {
            const frontendUrl =
                process.env.FRONTEND_URL ||
                `https://${process.env.DOMAIN_NAME || "localhost"}`;
            const allowedOrigins = frontendUrl
                .split(",")
                .map((url) => url.trim());
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        },
        credentials: true,
    },
})
export class PresenceGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly presenceService: PresenceService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    handleConnection(client: Socket) {
        try {
            const cookieHeader = client.handshake.headers.cookie;
            if (!cookieHeader) throw new Error();

            const parsedCookies = parse(cookieHeader) as Record<string, string>;
            const access_token = parsedCookies["access_token"];
            if (!access_token) throw new Error();

            const payload = this.jwtService.verify<JwtPayload>(access_token, {
                secret: this.configService.get<string>("JWT_SECRET"),
            });

            if (
                typeof payload !== "object" ||
                payload === null ||
                typeof payload.sub !== "string"
            ) {
                throw new Error("Invalid token payload");
            }

            const userId: string = payload.sub;
            const wasOffline = !this.presenceService.isUserOnline(userId);

            this.presenceService.addClient(userId, client.id);

            if (wasOffline) {
                this.server.emit("user_status", { userId, status: "online" });
            }
        } catch {
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        const userId = this.presenceService.removeClient(client.id);

        if (userId) {
            this.server.emit("user_status", { userId, status: "offline" });
        }
    }

    notifyUserBanned(userId: string) {
        const clients = this.presenceService.getClients(userId);
        if (clients && clients.length > 0) {
            this.server.to(clients).emit("banned");
            // Optionally force disconnect after a short delay
            setTimeout(() => {
                for (const clientId of clients) {
                    const socket = this.server.sockets.sockets.get(clientId);
                    if (socket) socket.disconnect();
                }
            }, 1000);
        }
    }
}
