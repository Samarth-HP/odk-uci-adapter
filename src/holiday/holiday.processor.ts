import { Process, Processor } from '@nestjs/bull';
import { parseString } from "xml2js";
import { Job } from 'bull';
import { Post } from '@nestjs/common';
import { parse } from 'path';
import { HolidayService } from './holiday.service';

@Processor('holiday')
export class HolidayProcessor {
//   private readonly logger = new Logger(HolidayProcessor.name);
constructor(private readonly holidayService: HolidayService){}

  @Process('submit')
  handleSubmit(job: Job) {
    console.log('Start transcoding...');
    // console.log({ex: job.data.data.xml_string});
    console.log('Transcoding completed');
    let dummyBody;
    parseString(job.data.data.xml_string, function (err, results) {
      // console.log({results: results.data})
        // let data = JSON.stringify(results['h:html']['h:head'][0]['model'][0]['instance'][0]['data'][0]);
        console.log({results: results.data['holiday_date'][0]['phone'][0]});
        // add api for UCI
        dummyBody = {
          "adapterId": "64036edb-e763-44b1-99b8-37b6c7b292c5",
          "to": {
              "userID": results.data['holiday_date'][0]['phone'][0],
              "deviceType": "PHONE"
          },
          "payload": {
            "text": `नमस्कार, प्रिय अभिभावकस्कूल की छुट्टियां 2022-08-11 से 2022-08-11 तक हैं। कृपया {#var#} को {#var#} से रोज़ स्कूल भेजें। - e-Samwad`
              // "text": "Kindly note your OTP @123@. Submission of the OTP will be taken as authentication that you have personally verified and overseen the distribution of smartphone to the mentioned student ID of your school. Thank you! - Samagra Shiksha, Himachal Pradesh"
          }
      }
    });

    dummyBody = {
      "adapterId": "4e0c568c-7c42-4f88-b1d6-392ad16b8546",
      "to": {
        "userID": "7982852223",
        "deviceType": "PHONE",
        "meta": {
          "templateId": "1007352034734612528"
        }
      },
      "payload": {
        "text": `नमस्कार, प्रिय अभिभावकस्कूल की छुट्टियां 2022-08-11 से 2022-08-11 तक हैं। कृपया {#var#} को {#var#} से रोज़ स्कूल भेजें। - e-Samwad`
        // "text": "Kindly note your OTP @123@. Submission of the OTP will be taken as authentication that you have personally verified and overseen the distribution of smartphone to the mentioned student ID of your school. Thank you! - Samagra Shiksha, Himachal Pradesh"
      }
    }

    // const res = this.holidayService.updateSubmissionStatus(job.data.data.xml_string);
    // console.log(res)
    console.log({dummyBody})
    console.log('Sending')
    // const res =
    console.log('Done')
    return this.holidayService.registerSms(dummyBody,job.data.data.xml_string, job.data.data.id);
  }
}
