import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";

@Injectable()
export class AppService {
    getHello(): string {
        return "Hello World!";
    }

    generateProblem(): { id: string; delay: number } {
        return {
            id: randomUUID(),
            delay: Math.floor(Math.random() * 4000) + 1000, // 1000–5000ms
        };
    }

    getRating(reactionTime: number): { rating: string; message: string } {
        if (reactionTime < 150)
            return {
                rating: "GIGA CHAD",
                message: `${reactionTime}ms — T'as probablement triché.`,
            };
        if (reactionTime < 250)
            return {
                rating: "Solide",
                message: `${reactionTime}ms — aspirant Giga Chad.`,
            };
        if (reactionTime < 350)
            return {
                rating: "Bien joué",
                message: `${reactionTime}ms — mais t'emballes pas.`,
            };
        if (reactionTime < 500)
            return {
                rating: "C'est pas ouf",
                message: `${reactionTime}ms — Peut mieux faire.`,
            };
        return {
            rating: "Trop lent",
            message: `${reactionTime}ms — Tu fais la sieste ?`,
        };
    }
}
