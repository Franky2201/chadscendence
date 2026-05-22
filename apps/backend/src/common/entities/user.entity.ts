import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Grade } from 'src/common/entities/grade.entity';

export enum UserStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash', nullable: true, select: false })
  password?: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.OFFLINE,
  })
  status: UserStatus;

  @Column({ type: 'int', default: 0 })
  score: number;

  @Column({ name: 'grade_id', nullable: true })
  gradeId?: string;

  @ManyToOne(() => Grade, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'grade_id' })
  grade?: Grade;

  @Column({ name: 'intra_id', nullable: true, unique: true })
  intraId?: string;

  @Column({ name: 'github_id', nullable: true, unique: true })
  githubId?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
