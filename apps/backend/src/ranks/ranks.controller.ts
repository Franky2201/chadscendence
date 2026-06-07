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
import { CreateRankDto, UpdateRankDto } from "../common/dto/ranks.dto";
import { PermissionsGuard } from "src/common/guards/permissions.guard";
import { Permissions } from "src/common/decorators/permissions.decorator";
import { PermissionAction } from "@chad/types";

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
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions(PermissionAction.MANAGE_RANKS)
    createRank(@Body() body: CreateRankDto) {
        return this.ranksService.createRank(body);
    }

    @Patch(":id")
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions(PermissionAction.MANAGE_RANKS)
    updateRank(@Param("id") id: string, @Body() body: UpdateRankDto) {
        return this.ranksService.updateRank(id, body);
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions(PermissionAction.MANAGE_RANKS)
    deleteRank(@Param("id") id: string) {
        return this.ranksService.deleteRank(id);
    }
}
