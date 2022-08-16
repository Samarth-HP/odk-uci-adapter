import { Processor } from "@nestjs/bull";
import { ExamService } from "./exam.service";

@Processor('exam')
export class ExamProcessor {
  constructor(private readonly examService: ExamService){}

}
