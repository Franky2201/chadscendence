import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { type JwtPayload } from 'src/common/dto/auth.dto';

@Controller('blocks')
@UseGuards(JwtAuthGuard)
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Get()
  getBlockedUsers(@GetUser() body: JwtPayload) {
    return this.blocksService.getBlockedUsers(body.sub);
  }

  @Post(':blockedId')
  blockUser(
    @GetUser() body: JwtPayload,
    @Param('blockedId') blockedId: string,
  ) {
    return this.blocksService.blockUser(body.sub, blockedId);
  }

  @Delete(':blockedId')
  unblockUser(
    @GetUser() body: JwtPayload,
    @Param('blockedId') blockedId: string,
  ) {
    return this.blocksService.unblockUser(body.sub, blockedId);
  }
}
