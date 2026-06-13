import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { User } from "./user.entity";
import type { RoundDetail } from "@chad/types";

@Entity("game_analytics")
export class GameAnalytics {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column({ name: "user_id" })
    userId: string;

    @Column({ type: "numeric", precision: 10, scale: 2, default: 0 })
    totalScore: number;

    @Column({ type: "int", default: 0 })
    ratingDelta: number;

    @Column({ type: "int", default: 0 })
    newRating: number;

    @Column({ type: "json", nullable: true })
    roundsDetails: RoundDetail[];

    @CreateDateColumn({ name: "played_at" })
    playedAt: Date;
}
