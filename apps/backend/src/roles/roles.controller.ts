import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDto, UpdateRoleDto } from "./roles.dto";
import { JwtAuthGuard } from "../common/guards/jwt.guard";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { Permissions } from "../common/decorators/permissions.decorator";
import { PermissionAction } from "@chad/types";

@Controller("roles")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Get()
    findAll() {
        return this.rolesService.findAll();
    }

    @Get("permissions")
    getPermissions() {
        return this.rolesService.getPermissions();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.rolesService.findOne(id);
    }

    @Post()
    @Permissions(PermissionAction.MANAGE_ROLES)
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.rolesService.create(createRoleDto);
    }

    @Patch(":id")
    @Permissions(PermissionAction.MANAGE_ROLES)
    update(@Param("id") id: string, @Body() updateRoleDto: UpdateRoleDto) {
        return this.rolesService.update(id, updateRoleDto);
    }

    @Delete(":id")
    @Permissions(PermissionAction.MANAGE_ROLES)
    remove(@Param("id") id: string) {
        return this.rolesService.remove(id);
    }
}
