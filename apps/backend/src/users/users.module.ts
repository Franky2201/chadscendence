import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { User } from "../common/entities/user.entity";
import { Rank } from "../common/entities/rank.entity";
import { RanksModule } from "../ranks/ranks.module";
import { RolesModule } from "src/roles/roles.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Rank]),
        forwardRef(() => RanksModule),
        forwardRef(() => RolesModule),
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { }
