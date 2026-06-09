import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";
import { Role } from "./role.entity";
import { Permission } from "../common/entities/permission.entity";
import { User } from "../common/entities/user.entity";
import { UsersModule } from "src/users/users.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Role, Permission, User]),
        forwardRef(() => UsersModule),
    ],
    controllers: [RolesController],
    providers: [RolesService],
    exports: [RolesService],
})
export class RolesModule { }
