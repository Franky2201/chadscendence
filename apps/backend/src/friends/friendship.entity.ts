import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { User } from "../users/user.entity";
import { FriendshipStatus } from "@chad/types";

@Entity("friendships")
export class Friendship {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "requester_id" })
    requester: User;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "addressee_id" })
    addressee: User;

    @Column({
        type: "enum",
        enum: FriendshipStatus,
        default: FriendshipStatus.PENDING,
    })
    status: FriendshipStatus;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}
