import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Rank as IRank } from "@chad/types";

@Entity("ranks")
export class Rank implements IRank {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ name: "rating_min" })
    ratingMin: number;

    @Column({ nullable: false })
    icon: string;
}
