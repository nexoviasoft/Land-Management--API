import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanddocService } from './landdoc.service';
import { LanddocController } from './landdoc.controller';
import { LandDoc } from './entities/landdoc.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([LandDoc]), NotificationsModule],
  controllers: [LanddocController],
  providers: [LanddocService],
  exports: [LanddocService],
})
export class LanddocModule {}
