import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RanksController } from "./ranks.controller";
import { RanksService } from "./ranks.service";
import { Rank } from "../common/entities/rank.entity";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [TypeOrmModule.forFeature([Rank]), forwardRef(() => UsersModule)],
    controllers: [RanksController],
    providers: [RanksService],
    exports: [RanksService],
})
export class RanksModule {}
