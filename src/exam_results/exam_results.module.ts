import { Module } from '@nestjs/common';
import { ExamResultsService } from './exam_results.service';
import { BullModule } from "@nestjs/bull";
import { HttpModule } from "@nestjs/axios";
import { ExamResultsController } from "./exam_results.controller";
import { ExamResultsProcessor } from "./exam_results.processor";
import { PrismaService } from "../PrismaService";

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'exam-results'
    }),
    HttpModule
  ],
  controllers: [ExamResultsController],
  providers: [ExamResultsService, ExamResultsProcessor, PrismaService]
})
export class ExamResultsModule {}
