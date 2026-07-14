import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notice } from './entities/notice.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createNotice(title: string, content: string): Promise<Notice> {
    // Deactivate all existing active notices
    await this.noticeRepository.update({ isActive: true }, { isActive: false });
    
    // Create and save new active notice
    const notice = this.noticeRepository.create({ title, content, isActive: true });
    const savedNotice = await this.noticeRepository.save(notice);
    
    // Notify all partners
    await this.notificationsService.createForPartners(`New Notice: ${title} | ID:${savedNotice.id}`);
    
    return savedNotice;
  }

  async getActiveNotice(): Promise<Notice | null> {
    return this.noticeRepository.findOne({
      where: { isActive: true },
      order: { createdAt: 'DESC' }
    });
  }

  async getAllNotices(): Promise<Notice[]> {
    return this.noticeRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async getNoticeById(id: string): Promise<Notice | null> {
    return this.noticeRepository.findOne({
      where: { id }
    });
  }

  async remove(id: string): Promise<void> {
    const notice = await this.getNoticeById(id);
    if (notice) {
      await this.noticeRepository.softRemove(notice);
    }
  }
}
