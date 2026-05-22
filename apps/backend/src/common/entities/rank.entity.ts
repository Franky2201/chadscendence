import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ranks')
export class Rank {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ name: 'min_score' })
  minScore: number;

  @Column({ nullable: true })
  icon?: string;
}
