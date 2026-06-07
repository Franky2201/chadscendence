import { IsString, IsOptional, Allow, IsInt, Min } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    username?: string;

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

    @IsInt()
    @Min(0)
    @IsOptional()
    score?: number;
}
