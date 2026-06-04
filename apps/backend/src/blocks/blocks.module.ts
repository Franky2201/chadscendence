import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlocksController } from "./blocks.controller";
import { BlocksService } from "./blocks.service";
import { Friendship } from "../common/entities/friendship.entity";
import { Block } from "../common/entities/block.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Friendship, Block])],
    controllers: [BlocksController],
    providers: [BlocksService],
    exports: [BlocksService],
})
export class BlocksModule {}
