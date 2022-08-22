import { Module } from '@nestjs/common';
import { HomeworkController } from './homework.controller';
import { HomeworkService } from './homework.service';
import { BullModule } from "@nestjs/bull";
import { HomeworkProcessor } from "./homework.processor";
import { PrismaService } from "../PrismaService";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'homework'
    }),
    HttpModule
  ],
  controllers: [HomeworkController],
  providers: [HomeworkService, HomeworkProcessor, PrismaService]
})
export class HomeworkModule {}
