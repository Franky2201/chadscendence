import {
    IsString,
    IsNotEmpty,
    IsArray,
    IsEnum,
    IsOptional,
} from "class-validator";
import {
    PermissionAction,
    CreateRolePayload,
    UpdateRolePayload,
} from "@chad/types";

export class CreateRoleDto implements CreateRolePayload {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsArray()
    @IsEnum(PermissionAction, { each: true })
    permissions!: PermissionAction[];
}

export class UpdateRoleDto implements UpdateRolePayload {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsArray()
    @IsEnum(PermissionAction, { each: true })
    permissions?: PermissionAction[];
}
