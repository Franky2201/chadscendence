import { Injectable } from "@nestjs/common";

@Injectable()
export class PresenceService {
    private activeUsers = new Map<string, Set<string>>();
    private clientToUser = new Map<string, string>();

    addClient(userId: string, clientId: string) {
        this.clientToUser.set(clientId, userId);

        let userClients = this.activeUsers.get(userId);
        if (!userClients) {
            userClients = new Set<string>();
            this.activeUsers.set(userId, userClients);
        }
        userClients.add(clientId);
    }

    removeClient(clientId: string): string | null {
        const userId = this.clientToUser.get(clientId);
        if (!userId) return null;

        this.clientToUser.delete(clientId);
        const userClients = this.activeUsers.get(userId);

        if (userClients) {
            userClients.delete(clientId);
            if (userClients.size === 0) {
                this.activeUsers.delete(userId);
                return userId;
            }
        }
        return null;
    }

    isUserOnline(userId: string): boolean {
        return this.activeUsers.has(userId);
    }

    getUserClients(userId: string): string[] {
        const clients = this.activeUsers.get(userId);
        return clients ? Array.from(clients) : [];
    }
}
