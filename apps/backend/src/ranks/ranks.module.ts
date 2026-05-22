import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RanksController } from './ranks.controller';
import { RanksService } from './ranks.service';
import { Rank } from 'src/common/entities/rank.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rank])],
  controllers: [RanksController],
  providers: [RanksService],
  exports: [RanksService],
})

export class RanksModule { }
