import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum PermissionAction {
	BAN_USER = 'BAN_USER',
	UNBAN_USER = 'UNBAN_USER',
	EDIT_USER_AVATAR = 'EDIT_USER_AVATAR',
	EDIT_USER_USERNAME = 'EDIT_USER_USERNAME',
	EDIT_USER_BIO = 'EDIT_USER_BIO',
	EDIT_USER_SCORE = 'EDIT_USER_SCORE',
	MANAGE_ROLES = 'MANAGE_ROLES',
	CREATE_RANK = 'CREATE_RANK',
	EDIT_RANK = 'EDIT_RANK',
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
