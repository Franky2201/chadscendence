import { IsArray, IsInt, IsString, Min } from "class-validator";

export class LaunchRoomDto {
    @IsArray()
    @IsString({ each: true })
    selectedGames!: string[];

    @IsInt()
    @Min(1)
    repetitions!: number;
}