import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LanddocModule } from './landdoc/landdoc.module';
import { OverviewModule } from './overview/overview.module';
import { NotificationsModule } from './notifications/notifications.module';
import { NoticeModule } from './notice/notice.module';
import { TrashModule } from './trash/trash.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        ssl: true, // Neon DB requires SSL
        autoLoadEntities: true,
        synchronize: true, // Note: Set to false in production
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    LanddocModule,
    OverviewModule,
    NotificationsModule,
    NoticeModule,
    TrashModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
