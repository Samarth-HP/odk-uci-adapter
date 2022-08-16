import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HolidayModule } from './holiday/holiday.module';
import { ExamModule } from './exam/exam.module';

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
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
