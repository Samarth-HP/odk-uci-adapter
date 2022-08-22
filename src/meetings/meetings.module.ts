import { Module } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { MeetingsController } from './meetings.controller';
import { BullModule } from "@nestjs/bull";
import { HttpModule } from "@nestjs/axios";
import { MeetingsProcessor } from "./meetings.processor";
import { PrismaService } from "../PrismaService";

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'meetings'
    }),
    HttpModule
  ],
  providers: [MeetingsService, MeetingsProcessor, PrismaService],
  controllers: [MeetingsController]
})
export class MeetingsModule {}
