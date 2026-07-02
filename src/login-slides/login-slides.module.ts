import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginSlide } from './entities/login-slide.entity';
import { LoginSlidesService } from './login-slides.service';
import { LoginSlidesController } from './login-slides.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LoginSlide])],
  controllers: [LoginSlidesController],
  providers: [LoginSlidesService],
  exports: [LoginSlidesService],
})
export class LoginSlidesModule {}
