import { Module } from '@nestjs/common';
import { TrashController } from './trash.controller';
import { TrashService } from './trash.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Notice } from '../notice/entities/notice.entity';
import { LandDoc } from '../landdoc/entities/landdoc.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Notice, LandDoc])],
  controllers: [TrashController],
  providers: [TrashService]
})
export class TrashModule {}
