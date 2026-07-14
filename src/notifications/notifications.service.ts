import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createForAdmins(message: string): Promise<void> {
    const admins = await this.userRepository.find({ where: { role: UserRole.ADMIN } });
    const notifications = admins.map(admin => 
      this.notificationRepository.create({
        recipientId: admin.id,
        message,
      })
    );
    if (notifications.length > 0) {
      await this.notificationRepository.save(notifications);
    }
  }

  async createForPartners(message: string): Promise<void> {
    const partners = await this.userRepository.find({ where: { role: UserRole.PARTNER } });
    const notifications = partners.map(partner => 
      this.notificationRepository.create({
        recipientId: partner.id,
        message,
      })
    );
    if (notifications.length > 0) {
      await this.notificationRepository.save(notifications);
    }
  }

  async createForUser(userId: string, message: string): Promise<void> {
    const notification = this.notificationRepository.create({
      recipientId: userId,
      message,
    });
    await this.notificationRepository.save(notification);
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { recipientId: userId },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(notificationId: string, userId: string): Promise<Notification | null> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, recipientId: userId },
    });
    
    if (notification) {
      notification.isRead = true;
      return this.notificationRepository.save(notification);
    }
    return null;
  }
}
