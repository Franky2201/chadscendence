export enum PermissionAction {
	BAN_USER = 'BAN_USER',
	MANAGE_USERS = 'MANAGE_USERS',
	MANAGE_ROLES = 'MANAGE_ROLES',
	MANAGE_RANKS = 'MANAGE_RANKS',
}

export interface Permission {
	id: string;
	action: PermissionAction;
}

export interface Role {
	id: string;
	name: string;
	permissions: Permission[];
	userCount?: number;
}
