import { Process, Processor } from '@nestjs/bull';
import { xml2json } from "xml-js";
import { Job } from 'bull';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { announcementTemplate } from './sms.templates';
import { getStudentFromUdiseAndClass } from './queries';

@Processor('announcement')
export class AnnouncementProcessor {
//   private readonly logger = new Logger(HolidayProcessor.name);
constructor(
  private configService: ConfigService,
  private readonly appService: AppService){}

  @Process('announcementSubmission')
  async handleSubmit(job: Job) {
    try {
      const respObj = JSON.parse(xml2json(job.data.data.xml_string, {compact: true}));
      console.log({respObj: JSON.stringify(respObj)});
      const udise = respObj.data.important_announcements.udise._text;
      const classList = respObj.data.important_announcements.class._text;
      const event = respObj.data.important_announcements.Event._text;
      const event_date = respObj.data.formatted_event_date._text;
      console.log(udise, classList, event, event_date);
      const query = getStudentFromUdiseAndClass(udise, classList);
      const resp = await this.appService.sendGqlRequest(query)
      if( resp['errors'] !== undefined){
        console.log({response: resp['errors'][0]['message']});
        this.appService.updateSubmissionStatus(job.data.data.id, "FAILED", resp['errors'][0]['message']);
      }else if(resp['data']['data'] !== undefined){
        this.appService.updateSubmissionStatus(job.data.data.id, "PROCESSED")
        resp.data.data.forEach(async element => {
          const payload = announcementTemplate(event_date, event);
          const templateId = this.configService.get<string>('ANNOUNCEMENT_TEMPLATE_ID');
          let resp = await this.appService.registerSms(element.phone, templateId, payload);
          if (resp.status === 200) {
            this.appService.insertSmsTrackEntry({type: job.data.data.type, user_id: job.data.data.user_id, phone_no: String(element.phone), instance_id: job.data.data.instance_id, created_at: job.data.data.created_at, status: resp.message || resp.error, message_id: resp.result.messageId})
          }
        });
        this.appService.updateSubmissionStatus(job.data.data.id, "DONE")
      }
    } catch (error) {
      console.log({error});
      this.appService.updateSubmissionStatus(job.data.data.id, "FAILED", error.message)
    } 
    return "OK";
  }
}