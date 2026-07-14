import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Notice } from '../notice/entities/notice.entity';
import { LandDoc } from '../landdoc/entities/landdoc.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TrashService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
    @InjectRepository(LandDoc)
    private readonly landDocRepository: Repository<LandDoc>,
  ) {}

  async getDeletedUsers(): Promise<User[]> {
    return this.userRepository.find({
      withDeleted: true,
      where: { deletedAt: Not(IsNull()) },
      order: { deletedAt: 'DESC' }
    });
  }

  async getDeletedNotices(): Promise<Notice[]> {
    return this.noticeRepository.find({
      withDeleted: true,
      where: { deletedAt: Not(IsNull()) },
      order: { deletedAt: 'DESC' }
    });
  }

  async getDeletedLandDocs(): Promise<LandDoc[]> {
    return this.landDocRepository.find({
      withDeleted: true,
      where: { deletedAt: Not(IsNull()) },
      order: { deletedAt: 'DESC' }
    });
  }

  async recoverUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id }, withDeleted: true });
    if (!user || !user.deletedAt) throw new NotFoundException('Deleted user not found');
    return this.userRepository.recover(user);
  }

  async recoverNotice(id: string): Promise<Notice> {
    const notice = await this.noticeRepository.findOne({ where: { id }, withDeleted: true });
    if (!notice || !notice.deletedAt) throw new NotFoundException('Deleted notice not found');
    return this.noticeRepository.recover(notice);
  }

  async recoverLandDoc(id: string): Promise<LandDoc> {
    const doc = await this.landDocRepository.findOne({ where: { id }, withDeleted: true });
    if (!doc || !doc.deletedAt) throw new NotFoundException('Deleted land document not found');
    return this.landDocRepository.recover(doc);
  }

  async permanentlyDeleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id }, withDeleted: true });
    if (!user || !user.deletedAt) throw new NotFoundException('Deleted user not found');
    await this.userRepository.remove(user);
  }

  async permanentlyDeleteNotice(id: string): Promise<void> {
    const notice = await this.noticeRepository.findOne({ where: { id }, withDeleted: true });
    if (!notice || !notice.deletedAt) throw new NotFoundException('Deleted notice not found');
    await this.noticeRepository.remove(notice);
  }

  async permanentlyDeleteLandDoc(id: string): Promise<void> {
    const doc = await this.landDocRepository.findOne({ where: { id }, withDeleted: true });
    if (!doc || !doc.deletedAt) throw new NotFoundException('Deleted land document not found');
    await this.landDocRepository.remove(doc);
  }

  // Run daily at midnight to permanently delete items older than 30 days
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldTrash() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const deleteOldItems = async (repository: Repository<any>) => {
      const items = await repository.find({
        withDeleted: true,
      });
      const oldDeletedItems = items.filter(
        item => item.deletedAt && item.deletedAt < thirtyDaysAgo
      );
      if (oldDeletedItems.length > 0) {
        await repository.remove(oldDeletedItems);
      }
    };

    await deleteOldItems(this.userRepository);
    await deleteOldItems(this.noticeRepository);
    await deleteOldItems(this.landDocRepository);
  }
}
