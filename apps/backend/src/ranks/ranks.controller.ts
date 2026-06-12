import { Controller, Get, Param } from "@nestjs/common";
import { RanksService } from "./ranks.service";
import { Rank } from "@chad/types";

@Controller("ranks")
export class RanksController {
    constructor(private readonly ranksService: RanksService) {}

    @Get("")
    getRanks(): Promise<Rank[]> {
        return this.ranksService.getRanks();
    }

    @Get(":id")
    getRank(@Param("id") id: string): Promise<Rank> {
        return this.ranksService.getRank(id);
    }
}
