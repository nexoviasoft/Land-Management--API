import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanddocService } from './landdoc.service';
import { LanddocController } from './landdoc.controller';
import { LandDoc } from './entities/landdoc.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LandDoc])],
  controllers: [LanddocController],
  providers: [LanddocService],
})
export class LanddocModule {}
