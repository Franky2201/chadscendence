import { IsString, IsOptional, Allow, IsInt, Min } from "class-validator";
import { UpdateMePayload, AdminUpdateDataPayload } from "@chad/types";

export class UpdateUserDto implements UpdateMePayload {
    @IsString()
    @IsOptional()
    username?: string;

    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    oldPassword?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    avatarUrl?: string;

    @IsString()
    @IsOptional()
    @Allow()
    bio?: string | null;
}

export class UpdateAdminUserDto implements AdminUpdateDataPayload {
    @IsString()
    @IsOptional()
    username?: string;

    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    avatarUrl?: string;

    @IsString()
    @IsOptional()
    @Allow()
    bio?: string | null;

    @IsInt()
    @Min(0)
    @IsOptional()
    rating?: number;

    @IsString()
    @IsOptional()
    roleId?: string;
}
