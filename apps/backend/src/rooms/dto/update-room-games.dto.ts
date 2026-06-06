import { IsArray, IsString } from "class-validator";

export class UpdateRoomGamesDto {
    @IsArray()
    @IsString({ each: true })
    selectedGames!: string[];
}
