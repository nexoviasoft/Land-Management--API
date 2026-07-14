import { Controller, Get, Patch, Param, UseGuards, Req, HttpStatus } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: { id: string, email: string, role: string };
}

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getMyNotifications(@Req() req: AuthenticatedRequest) {
    const notifications = await this.notificationsService.getUserNotifications(req.user.id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Notifications retrieved successfully',
      data: notifications,
    };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const notification = await this.notificationsService.markAsRead(id, req.user.id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Notification marked as read',
      data: notification,
    };
  }
}
