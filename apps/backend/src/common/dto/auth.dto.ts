import {
    IsString,
    MinLength,
    MaxLength,
    IsEmail,
    Matches,
    IsOptional,
} from "class-validator";
import { JwtPayload, OAuthProfile } from "@chad/types";

export type { JwtPayload, OAuthProfile };

export class LoginUserDto {
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

export class CreateUserDto {
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
