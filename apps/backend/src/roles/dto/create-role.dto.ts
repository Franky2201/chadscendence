import { IsString, IsNotEmpty, IsArray, IsEnum } from "class-validator";
import { PermissionAction } from "@chad/types";

export class CreateRoleDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    @IsEnum(PermissionAction, { each: true })
    permissions: PermissionAction[];
}
