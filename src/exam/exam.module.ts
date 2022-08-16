import { Module } from '@nestjs/common';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { ExamProcessor } from "./exam.processor";
import { PrismaService } from "../PrismaService";
import { BullModule } from "@nestjs/bull";
import { HttpModule } from "@nestjs/axios";

@Module({

  imports: [
    BullModule.registerQueue({
      name: 'exam'
    }),
    HttpModule
  ],
  controllers: [ExamController],
  providers: [ExamService, ExamProcessor, PrismaService]
})
export class ExamModule {}
