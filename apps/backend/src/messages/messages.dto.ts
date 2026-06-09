import { IsString, IsNotEmpty, MaxLength } from "class-validator";
import { CreateMessagePayload } from "@chad/types";

export class CreateMessageDto implements CreateMessagePayload {
    @IsString()
    @IsNotEmpty()
    @MaxLength(2000)
    content!: string;
}
