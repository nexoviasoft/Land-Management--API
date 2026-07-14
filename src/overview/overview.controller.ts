import { Controller, Get, Param, HttpStatus } from '@nestjs/common';
import { OverviewService } from './overview.service';

@Controller('overview')
export class OverviewController {
  constructor(private readonly overviewService: OverviewService) {}

  @Get('superadmin')
  async getSuperAdminOverview() {
    const data = await this.overviewService.getSuperAdminOverview();
    return {
      statusCode: HttpStatus.OK,
      message: 'Super Admin overview data retrieved successfully',
      data,
    };
  }

  @Get('user/:userId')
  async getUserOverview(@Param('userId') userId: string) {
    const data = await this.overviewService.getUserOverview(userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'User overview data retrieved successfully',
      data,
    };
  }

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
