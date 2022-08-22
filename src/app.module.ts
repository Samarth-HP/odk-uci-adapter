import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HolidayModule } from './holiday/holiday.module';
import { ExamModule } from './exam/exam.module';
import { HomeworkModule } from './homework/homework.module';
import { ExamResultsModule } from './exam_results/exam_results.module';
import { MeetingsModule } from './meetings/meetings.module';
import { ImportantAnnouncementModule } from './important_announcement/important_announcement.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    BullModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      redis: {
        host: configService.get('QUEUE_HOST'),
        port: +configService.get('QUEUE_PORT'),
      },
    }),
    inject: [ConfigService],
  }),
  HolidayModule,
  ExamModule,
  HomeworkModule,
  ExamResultsModule,
  MeetingsModule,
  ImportantAnnouncementModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
