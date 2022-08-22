import { Module } from '@nestjs/common';
import { ImportantAnnouncementController } from './important_announcement.controller';
import { ImportantAnnouncementService } from './important_announcement.service';
import { BullModule } from "@nestjs/bull";
import { HttpModule } from "@nestjs/axios";
import { ImportantAnnouncementProcessor } from "./important_announcement.processor";
import { PrismaService } from "../PrismaService";

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'important-announcement'
    }),
    HttpModule
  ],
  controllers: [ImportantAnnouncementController],
  providers: [ImportantAnnouncementService, ImportantAnnouncementProcessor, PrismaService]
})
export class ImportantAnnouncementModule {}
