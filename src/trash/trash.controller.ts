import { Controller, Get, Param, Post, UseGuards, HttpStatus } from '@nestjs/common';
import { TrashService } from './trash.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('trash')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN) // Only admins can access trash
export class TrashController {
  constructor(private readonly trashService: TrashService) {}

  @Get('users')
  async getDeletedUsers() {
    const data = await this.trashService.getDeletedUsers();
    return {
      statusCode: HttpStatus.OK,
      message: 'Deleted users retrieved successfully',
      data,
    };
  }

  @Get('notices')
  async getDeletedNotices() {
    const data = await this.trashService.getDeletedNotices();
    return {
      statusCode: HttpStatus.OK,
      message: 'Deleted notices retrieved successfully',
      data,
    };
  }

  @Get('landdocs')
  async getDeletedLandDocs() {
    const data = await this.trashService.getDeletedLandDocs();
    return {
      statusCode: HttpStatus.OK,
      message: 'Deleted land documents retrieved successfully',
      data,
    };
  }

  @Post('users/:id/recover')
  async recoverUser(@Param('id') id: string) {
    const data = await this.trashService.recoverUser(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User recovered successfully',
      data,
    };
  }

  @Post('notices/:id/recover')
  async recoverNotice(@Param('id') id: string) {
    const data = await this.trashService.recoverNotice(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Notice recovered successfully',
      data,
    };
  }

  @Post('landdocs/:id/recover')
  async recoverLandDoc(@Param('id') id: string) {
    const data = await this.trashService.recoverLandDoc(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Land document recovered successfully',
      data,
    };
  }
}
