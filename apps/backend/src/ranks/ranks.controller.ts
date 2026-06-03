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
import { PermissionAction } from "src/common/entities/permission.entity";

@Controller("ranks")
export class RanksController {
    constructor(private readonly ranksService: RanksService) { }

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
    @Permissions(PermissionAction.ADD_RANK)
    createRank(@Body() body: CreateRankDto) {
        return this.ranksService.createRank(body);
    }

    @Patch(":id")
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions(PermissionAction.UPDATE_RANK)
    updateRank(@Param("id") id: string, @Body() body: UpdateRankDto) {
        return this.ranksService.updateRank(id, body);
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions(PermissionAction.DELETE_RANK)
    deleteRank(@Param("id") id: string) {
        return this.ranksService.deleteRank(id);
    }
}
