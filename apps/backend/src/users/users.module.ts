import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from 'src/common/entities/user.entity';
import { Grade } from 'src/common/entities/grade.entity';

@Module({
    imports: [TypeOrmModule.forFeature([
        Grade,
        User,
    ])],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})

export class UsersModule { }
