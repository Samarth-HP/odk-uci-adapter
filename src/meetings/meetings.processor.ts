import { ImportantAnnouncementService } from "../important_announcement/important_announcement.service";
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { parseString } from "xml2js";
import { MeetingsService } from "./meetings.service";

@Processor('meetings')
export class MeetingsProcessor {

  constructor(private readonly meetingService: MeetingsService){}

  @Process('submit')
  handleSubmit(job: Job) {
    console.log('Start transcoding...');
    // console.log({ex: job.data.data.xml_string});
    console.log('Transcoding completed');
    let dummyBody;
    // parseString(job.data.data.xml_string, function (err, results) {
    //   console.log('parse start');
    //   console.log(JSON.stringify(results['h:html']))
    //     // let data = JSON.stringify(results['h:html']['h:head'][0]['model'][0]['instance'][0]['data'][0]);
    //     console.log({results: results.data['holiday_date'][0]['phone'][0]});
    //     // add api for UCI
    //     dummyBody = {
    //       "adapterId": "64036edb-e763-44b1-99b8-37b6c7b292c5",
    //       "to": {
    //           "userID": results.data['holiday_date'][0]['phone'][0],
    //           "deviceType": "PHONE"
    //       },
    //       "payload": {
    //         "text": `प्रिय अभिभावक! कृपया {#var#} को होने वाली {#var#} में अपनी भागीदारी सुनिश्चित करें और अपने पुत्र/पुत्री की पढ़ाई से संबंधित विभिन्न विषयों पर विस्तृत चर्चा करें। समग्र शिक्षा, हिमाचल प्रदेश`
    //           // "text": "Kindly note your OTP @123@. Submission of the OTP will be taken as authentication that you have personally verified and overseen the distribution of smartphone to the mentioned student ID of your school. Thank you! - Samagra Shiksha, Himachal Pradesh"
    //       }
    //   }
    // });

    console.log('Xml parsed');
    dummyBody = {
      "adapterId": "4e0c568c-7c42-4f88-b1d6-392ad16b8546",
      "to": {
        "userID": "7982852223",
        "deviceType": "PHONE",
        "meta": {
          "templateId": "1007000306269990204"
        }
      },
      "payload": {
        "text": `प्रिय अभिभावक! कृपया saturday को होने वाली meeting में अपनी भागीदारी सुनिश्चित करें और अपने पुत्र/पुत्री की पढ़ाई से संबंधित विभिन्न विषयों पर विस्तृत चर्चा करें।  समग्र शिक्षा, हिमाचल प्रदेश`
      }
    }
    console.log('Sending')
    // return this.meetingService.registerSms(dummyBody,job.data.data.xml_string, job.data.data.id);
  }
}
