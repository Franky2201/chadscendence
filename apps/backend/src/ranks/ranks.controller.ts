import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from "@nestjs/common";
import { RanksService } from "./ranks.service";
import { JwtAuthGuard } from "../common/guards/jwt.guard";
import { UserRole } from "../common/entities/user.entity";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { CreateRankDto, UpdateRankDto } from "../common/dto/ranks.dto";

@Controller("ranks")
export class RanksController {
    constructor(private readonly ranksService: RanksService) {}

    @Get("")
    getRanks() {
        return this.ranksService.getRanks();
    }

    @Get(":id")
    getRank(@Param("id") id: string) {
        return this.ranksService.getRank(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    createRank(@Body() body: CreateRankDto) {
        return this.ranksService.createRank(body);
    }

    @Patch(":id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    updateRank(@Param("id") id: string, @Body() body: UpdateRankDto) {
        return this.ranksService.updateRank(id, body);
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    deleteRank(@Param("id") id: string) {
        return this.ranksService.deleteRank(id);
    }
}
