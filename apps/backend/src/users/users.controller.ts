import { Controller, Get, Patch, Delete, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { UpdateUserDto } from 'src/common/dto/users.dto'
import { GetUser } from 'src/common/decorators/get-user.decorator';
import type { JwtPayload } from 'src/common/dto/auth.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me')
    getCurrentUser(@GetUser() payload: JwtPayload) {
        return this.usersService.getUser(payload.sub);
    }

    @Patch('me')
    updateUser(@GetUser() payload: JwtPayload, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.updateUser(payload.sub, updateUserDto);
    }

    @Delete('me')
    deleteUser(@GetUser() payload: JwtPayload) {
        return this.usersService.deleteUser(payload.sub);
    }
}
