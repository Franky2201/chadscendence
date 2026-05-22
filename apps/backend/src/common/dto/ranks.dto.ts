import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRankDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  minScore: number;

  @IsString()
  @IsOptional()
  icon?: string;
}

export class UpdateRankDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  minScore?: number;

  @IsString()
  @IsOptional()
  icon?: string;
}
