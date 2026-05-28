import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { Friendship } from 'src/common/entities/friendship.entity';
import { User } from 'src/common/entities/user.entity';
import { Block } from 'src/common/entities/block.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship, User, Block])],
  controllers: [FriendsController],
  providers: [FriendsService],
  exports: [FriendsService],
})
export class FriendsModule { }
