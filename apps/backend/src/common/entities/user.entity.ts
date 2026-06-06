import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { UserStatus } from "@chad/types";
import type { Rank as IRank } from "@chad/types";
import { Rank } from "./rank.entity";
import { Role } from "./role.entity";

export { UserStatus };

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column({ name: "password_hash", nullable: true, select: false })
    password?: string;

    @Column({ name: "avatar_url", nullable: true })
    avatarUrl?: string;

    @Column({ type: "text", nullable: true })
    bio?: string | null;

    @Column({
        type: "enum",
        enum: UserStatus,
        default: UserStatus.OFFLINE,
    })
    status: UserStatus;

    @ManyToOne(() => Role, (role) => role.users, {
        nullable: false,
        onDelete: "RESTRICT",
    })
    @JoinColumn({ name: "role_id" })
    role: Role;

    @Column({ type: "int", default: 0 })
    score: number;

    @Column({ name: "rank_id", nullable: true })
    rankId?: string;

    @ManyToOne(() => Rank, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "rank_id" })
    rank?: IRank;

    @Column({ name: "intra_id", nullable: true, unique: true })
    intraId?: string;

    @Column({ name: "github_id", nullable: true, unique: true })
    githubId?: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}
