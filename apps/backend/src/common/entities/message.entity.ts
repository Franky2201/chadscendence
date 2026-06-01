import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('messages')
export class Message {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'sender_id' })
	sender: User;

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'receiver_id' })
	receiver: User;

	@Column('text')
	content: string;

	@Column({ default: false, name: 'is_read' })
	isRead: boolean;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;
}
