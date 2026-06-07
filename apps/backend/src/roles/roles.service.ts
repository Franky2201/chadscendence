import { Injectable, ForbiddenException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from 'src/common/entities/role.entity';
import { Permission } from 'src/common/entities/permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PermissionAction } from '@chad/types';

@Injectable()
export class RolesService {
	private readonly IMMUTABLE_ROLES = ['USER', 'ADMIN'];

	constructor(
		@InjectRepository(Role)
		private readonly roleRepository: Repository<Role>,
		@InjectRepository(Permission)
		private readonly permissionRepository: Repository<Permission>,
	) { }

	async onModuleInit() {
		await this.seedRoles();
	}

	async seedRoles() {
		const allPermissions: Permission[] = [];

		for (const action of Object.values(PermissionAction)) {
			let permission = await this.permissionRepository.findOne({
				where: { action },
			});
			if (!permission) {
				permission = this.permissionRepository.create({ action });
				await this.permissionRepository.save(permission);
			}
			allPermissions.push(permission);
		}

		let userRole = await this.roleRepository.findOne({
			where: { name: "User" },
		});
		if (!userRole) {
			userRole = this.roleRepository.create({
				name: "User",
				permissions: [],
			});
			await this.roleRepository.save(userRole);
		}

		let adminRole = await this.roleRepository.findOne({
			where: { name: "Admin" },
		});
		if (!adminRole) {
			adminRole = this.roleRepository.create({
				name: "Admin",
				permissions: allPermissions,
			});
			await this.roleRepository.save(adminRole);
		} else {
			adminRole.permissions = allPermissions;
			await this.roleRepository.save(adminRole);
		}

		return { userRole, adminRole };
	}

	async findAll() {
		return this.roleRepository.find({
			relations: { permissions: true },
		});
	}

	async findOne(id: string) {
		const role = await this.roleRepository.findOne({
			where: { id },
			relations: { permissions: true },
		});
		if (!role) throw new NotFoundException();
		return role;
	}

	async getPermissions() {
		return this.permissionRepository.find();
	}

	async create(createRoleDto: CreateRoleDto) {
		const existingRole = await this.roleRepository.findOne({
			where: { name: createRoleDto.name },
		});
		if (existingRole) throw new ConflictException();

		const permissions = await this.permissionRepository.find({
			where: { action: In(createRoleDto.permissions) },
		});

		const role = this.roleRepository.create({
			name: createRoleDto.name,
			permissions,
		});

		return this.roleRepository.save(role);
	}

	async update(id: string, updateRoleDto: UpdateRoleDto) {
		const role = await this.findOne(id);

		if (this.IMMUTABLE_ROLES.includes(role.name.toUpperCase())) {
			throw new ForbiddenException();
		}

		if (updateRoleDto.name) {
			const existingRole = await this.roleRepository.findOne({
				where: { name: updateRoleDto.name },
			});
			if (existingRole && existingRole.id !== id) throw new ConflictException();
			role.name = updateRoleDto.name;
		}

		if (updateRoleDto.permissions) {
			role.permissions = await this.permissionRepository.find({
				where: { action: In(updateRoleDto.permissions) },
			});
		}

		return this.roleRepository.save(role);
	}

	async remove(id: string) {
		const role = await this.findOne(id);

		if (this.IMMUTABLE_ROLES.includes(role.name.toUpperCase())) {
			throw new ForbiddenException();
		}

		return this.roleRepository.remove(role);
	}
}
