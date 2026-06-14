import {
    IsString,
    MinLength,
    MaxLength,
    IsEmail,
    Matches,
    IsOptional,
} from "class-validator";
import { LoginPayload, RegisterPayload } from "@chad/types";

export class LoginUserDto implements LoginPayload {
    @IsString()
    identifier!: string;

    @IsString()
    @MinLength(8)
    password!: string;
}

export class CreateUserDto implements RegisterPayload {
    @IsString()
    @MinLength(3)
    @MaxLength(32)
    username!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
            "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre",
    })
    password!: string;
}

export class CreateOAuthUserDto {
    @IsString()
    email!: string;

    @IsString()
    username!: string;

    @IsString()
    @IsOptional()
    avatarUrl?: string;
}

export interface JwtPayload {
    sub: string;
    username: string;
    email: string;
}
