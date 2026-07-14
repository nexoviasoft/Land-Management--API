import { Controller, Get, Post, Delete, Body, UseGuards, HttpStatus, Param } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get('active')
  async getActiveNotice() {
    const notice = await this.noticeService.getActiveNotice();
    return {
      statusCode: HttpStatus.OK,
      message: 'Active notice retrieved successfully',
      data: notice,
    };
  }

  @Get()
  async getAllNotices() {
    const notices = await this.noticeService.getAllNotices();
    return {
      statusCode: HttpStatus.OK,
      message: 'All notices retrieved successfully',
      data: notices,
    };
  }

  @Get(':id')
  async getNoticeById(@Param('id') id: string) {
    const notice = await this.noticeService.getNoticeById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Notice retrieved successfully',
      data: notice,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createNotice(@Body() createNoticeDto: CreateNoticeDto) {
    const notice = await this.noticeService.createNotice(createNoticeDto.title, createNoticeDto.content);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Notice created successfully',
      data: notice,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async removeNotice(@Param('id') id: string) {
    await this.noticeService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Notice deleted successfully',
    };
  }
}
