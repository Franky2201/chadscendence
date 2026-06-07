import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from 'src/common/entities/role.entity';
import { Permission } from 'src/common/entities/permission.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Role, Permission]),
		forwardRef(() => UsersModule),
	],
	controllers: [RolesController],
	providers: [RolesService],
	exports: [RolesService],
})
export class RolesModule { }
