import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';
import { Notice } from './entities/notice.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notice]), NotificationsModule],
  controllers: [NoticeController],
  providers: [NoticeService],
})
export class NoticeModule {}
