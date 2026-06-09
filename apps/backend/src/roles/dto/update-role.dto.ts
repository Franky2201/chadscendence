import { IsString, IsArray, IsEnum, IsOptional } from "class-validator";
import { PermissionAction } from "@chad/types";

export class UpdateRoleDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsArray()
    @IsEnum(PermissionAction, { each: true })
    permissions?: PermissionAction[];
}
