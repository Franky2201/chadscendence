import { IsString, IsNotEmpty, IsArray, IsEnum, IsOptional } from "class-validator";
import { PermissionAction } from "@chad/types";

export class CreateRoleDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    @IsEnum(PermissionAction, { each: true })
    permissions: PermissionAction[];
}

export class UpdateRoleDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsArray()
    @IsEnum(PermissionAction, { each: true })
    permissions?: PermissionAction[];
}
