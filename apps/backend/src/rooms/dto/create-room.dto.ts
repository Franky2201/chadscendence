import { IsArray, IsOptional, IsString } from "class-validator";

export class CreateRoomDto {
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    selectedGames?: string[];
}
