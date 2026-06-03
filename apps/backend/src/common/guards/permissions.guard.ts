import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionAction } from '@chad/types';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { UsersService } from '../../users/users.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private usersService: UsersService,
	) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredPermissions = this.reflector.getAllAndOverride<PermissionAction[]>(
			PERMISSIONS_KEY,
			[context.getHandler(), context.getClass()],
		);

		if (!requiredPermissions) {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const userPayload = request.user;

		if (!userPayload) {
			throw new ForbiddenException();
		}

		const user = await this.usersService.getUser(userPayload.sub);

		if (!user || !user.role) {
			throw new ForbiddenException();
		}

		const userPermissions = user.role.permissions.map((p) => p.action);

		const hasPermission = requiredPermissions.every((permission) =>
			userPermissions.includes(permission),
		);

		if (!hasPermission) {
			throw new ForbiddenException();
		}

		return true;
	}
}
