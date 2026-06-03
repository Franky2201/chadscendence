import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum PermissionAction {
	BAN_USER = 'BAN_USER',
	UNBAN_USER = 'UNBAN_USER',
	UPDATE_USER_AVATAR = 'UPDATE_USER_AVATAR',
	UPDATE_USER_USERNAME = 'UPDATE_USER_USERNAME',
	UPDATE_USER_SCORE = 'UPDATE_USER_SCORE',
	MANAGE_ROLES = 'MANAGE_ROLES',
	ADD_RANK = 'ADD_RANK',
	UPDATE_RANK = 'UPDATE_RANK',
	DELETE_RANK = 'DELETE_RANK',
}

@Entity('permissions')
export class Permission {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({
		type: 'enum',
		enum: PermissionAction,
		unique: true,
	})
	action: PermissionAction;
}
