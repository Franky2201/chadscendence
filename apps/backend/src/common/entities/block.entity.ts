import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from "typeorm";
import { User } from "../entities/user.entity";

@Entity("blocks")
export class Block {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "blocker_id" })
    blocker: User;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "blocked_id" })
    blocked: User;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
}
