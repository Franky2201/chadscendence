import { Controller, Get, Param } from '@nestjs/common';
import { RanksService } from './ranks.service';

@Controller('ranks')
export class RanksController {
  constructor(private readonly ranksService: RanksService) { }

  @Get('')
  getRanks() {
    return this.ranksService.getRanks();
  }

  @Get(':id')
  getRank(@Param('id') id: string) {
    return this.ranksService.getRank(id);
  }
}
