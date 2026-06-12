import { IsArray, IsNumber, IsString, Min } from "class-validator";

export class CreateSessionDto {
	@IsArray()
	@IsString({ each: true })
	selectedGames!: string[];

	@IsNumber()
	@Min(1)
	repetitions!: number;
}
