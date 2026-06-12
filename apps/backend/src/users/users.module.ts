import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { Rank } from "../ranks/rank.entity";
import { RanksModule } from "../ranks/ranks.module";
import { RolesModule } from "src/roles/roles.module";
import { GameAnalytics } from "src/users/analytics.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Rank, GameAnalytics]),
        forwardRef(() => RanksModule),
        forwardRef(() => RolesModule),
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
