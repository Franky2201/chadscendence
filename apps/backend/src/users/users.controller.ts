import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { UpdateUserDto } from 'src/common/dto/users.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import type { JwtPayload } from 'src/common/dto/auth.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@GetUser() payload: JwtPayload) {
    return this.usersService.getUser(payload.sub);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateUser(
    @GetUser() payload: JwtPayload,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(payload.sub, updateUserDto);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  deleteUser(@GetUser() payload: JwtPayload) {
    return this.usersService.deleteUser(payload.sub);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  searchUsers(@Query('q') query: string, @GetUser() body: JwtPayload) {
    if (!query) return [];
    return this.usersService.searchUsers(query, body.sub);
  }

  @Get('leaderboard')
  getGlobalLeaderboard(@Query('count') count: string = '10') {
    return this.usersService.getGlobalLeaderboard(Number(count));
  }
}
