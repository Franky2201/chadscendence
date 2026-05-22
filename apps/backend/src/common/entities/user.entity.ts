import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Rank } from 'src/common/entities/rank.entity';

export enum UserStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
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

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ type: 'int', default: 0 })
  score: number;

  @Column({ name: 'rank_id', nullable: true })
  rankId?: string;

  @ManyToOne(() => Rank, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'rank_id' })
  rank?: Rank;

  @Column({ name: 'intra_id', nullable: true, unique: true })
  intraId?: string;

  @Column({ name: 'github_id', nullable: true, unique: true })
  githubId?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
