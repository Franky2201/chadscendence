import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('grades')
export class Grade {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ name: 'min_score' })
    minScore: number;

    @Column({ name: 'max_score' })
    maxScore: number;

    @Column({ nullable: true })
    icon?: string;
}
