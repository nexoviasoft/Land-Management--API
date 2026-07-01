import { Controller, Get, HttpStatus } from '@nestjs/common';
import { OverviewService } from './overview.service';

@Controller('overview')
export class OverviewController {
  constructor(private readonly overviewService: OverviewService) {}

  @Get()
  async getOverview() {
    const data = await this.overviewService.getOverview();
    return {
      statusCode: HttpStatus.OK,
      message: 'Overview data retrieved successfully',
      data,
    };
  }
}
