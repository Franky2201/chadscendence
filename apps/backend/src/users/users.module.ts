import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { User } from "../common/entities/user.entity";
import { Rank } from "../common/entities/rank.entity";
import { RanksModule } from "../ranks/ranks.module";
import { Block } from "../common/entities/block.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Rank, User, Block]), RanksModule],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
