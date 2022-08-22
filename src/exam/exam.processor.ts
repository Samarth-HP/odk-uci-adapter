import { Process, Processor } from "@nestjs/bull";
import { ExamService } from "./exam.service";
import { Job } from "bull";

@Processor('exam')
export class ExamProcessor {
  constructor(private readonly examService: ExamService){}

  @Process('submit')
  handleSubmit(job: Job){
    console.log('Start transcoding...');
    // console.log({ex: job.data.data.xml_string});
    console.log('Transcoding completed');
    let dummyBody;

    dummyBody = {
      "adapterId": "4e0c568c-7c42-4f88-b1d6-392ad16b8546",
      "to": {
        "userID": "8054307708",
        "deviceType": "PHONE",
        "meta": {
          "templateId": "1007822688560433203"
        }
      },
      "payload": {
        "text": `नमस्कार, प्रिय अभिभावकस्कूल की छुट्टियां 2022-08-11 से 2022-08-11 तक हैं। कृपया {#var#} को {#var#} से रोज़ स्कूल भेजें। - e-Samwad`
      }
    }

    console.log('Sending')
    return this.examService.registerSms(dummyBody,job.data.data.xml_string, job.data.data.id);
  }
}
