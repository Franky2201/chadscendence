import { IsArray, IsOptional, IsString } from "class-validator";

export class CreateRoomDto {
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    selectedGames?: string[];
}

export class UpdateRoomGamesDto {
    @IsArray()
    @IsString({ each: true })
    selectedGames!: string[];
}
