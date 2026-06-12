export enum PermissionAction {
	BAN_USER = 'BAN_USER',
	MANAGE_USERS = 'MANAGE_USERS',
	MANAGE_ROLES = 'MANAGE_ROLES',
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
	createdAt?: string | Date;
	updatedAt?: string | Date;
}

export interface CreateRolePayload {
	name: string;
	permissions: PermissionAction[];
}

export interface UpdateRolePayload {
	name?: string;
	permissions?: PermissionAction[];
}
