import { Module } from '@nestjs/common';
import { OverviewController } from './overview.controller';
import { OverviewService } from './overview.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { LandDoc } from '../landdoc/entities/landdoc.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, LandDoc])],
  controllers: [OverviewController],
  providers: [OverviewService]
})
export class OverviewModule {}
