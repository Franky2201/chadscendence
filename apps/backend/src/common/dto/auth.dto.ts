import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  Matches,
  IsOptional,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  role: UserRole;
}

export class LoginUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
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
      'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
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

export interface OAuthProfile {
  provider: '42' | 'github';
  providerId: string;
  username: string | null;
  email: string | null;
  avatarUrl: string | null;
}
