import { IsString, IsOptional, IsNotEmpty, IsNumber } from "class-validator";
import { CreateRankPayload, UpdateRankPayload } from "@chad/types";

export class CreateRankDto implements CreateRankPayload {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsNumber()
    @IsNotEmpty()
    ratingMin!: number;

    @IsString()
    @IsNotEmpty()
    icon!: string;
}

export class UpdateRankDto implements UpdateRankPayload {
    @IsString()
    @IsOptional()
    name?: string;

    @IsNumber()
    @IsOptional()
    ratingMin?: number;

    @IsString()
    @IsOptional()
    icon?: string;
}
