import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    UseGuards,
} from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDto, UpdateRoleDto } from "./roles.dto";
import { JwtAuthGuard } from "../common/guards/jwt.guard";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { Permissions } from "../common/decorators/permissions.decorator";
import { PermissionAction, Role, Permission } from "@chad/types";

@Controller("roles")
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Get()
    findAll(): Promise<Role[]> {
        return this.rolesService.findAll();
    }

    @Get("permissions")
    getPermissions(): Promise<Permission[]> {
        return this.rolesService.getPermissions();
    }

    @Get(":id")
    findOne(@Param("id") id: string): Promise<Role> {
        return this.rolesService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions(PermissionAction.MANAGE_ROLES)
    create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
        return this.rolesService.create(createRoleDto);
    }

    @Patch(":id")
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions(PermissionAction.MANAGE_ROLES)
    update(
        @Param("id") id: string,
        @Body() updateRoleDto: UpdateRoleDto,
    ): Promise<Role> {
        return this.rolesService.update(id, updateRoleDto);
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions(PermissionAction.MANAGE_ROLES)
    remove(@Param("id") id: string): Promise<Role> {
        return this.rolesService.remove(id);
    }
}
