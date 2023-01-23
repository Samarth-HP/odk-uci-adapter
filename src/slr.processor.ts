import { Process, Processor } from '@nestjs/bull';
import { xml2json } from 'xml-js';
import { Job } from 'bull';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { slrTemplate } from './sms.templates';
import { getStudentForSLC } from './queries';
import { Logger } from '@nestjs/common';

@Processor('slr')
export class SLRProcessor {
  private readonly logger = new Logger(SLRProcessor.name);
  constructor(
    private configService: ConfigService,
    private readonly appService: AppService,
  ) {}

  @Process('slrSubmission')
  async handleSubmit(job: Job) {
    this.logger.debug(`Processing id: ${job.data.data.id}...`);
    try {
      const respObj: {
        data: {
          class: { _text?: string };
          session: { _text?: string };
          district: { _text?: string };
        };
      } = JSON.parse(xml2json(job.data.data.xml_string, { compact: true }));
      this.logger.debug(
        `id: ${job.data.data.id}: xml2json: ${JSON.stringify(respObj)}`,
      );

      const classList: number[] = <number[]>(
        (<unknown>respObj.data.class._text?.split(' '))
      );
      const sessionList: string[] = respObj.data.session._text?.split(' ');
      const districtList: string[] = respObj.data.district._text?.split(' ');

      const query = getStudentForSLC(classList, sessionList, districtList);
      const resp = await this.appService.sendGqlRequest(query);
      console.log('resp', resp);
      if (resp['errors'] !== undefined) {
        console.log({ response: resp['errors'][0]['message'] });
        await this.appService.updateSubmissionStatus(
          job.data.data.id,
          'FAILED',
          resp['errors'][0]['message'],
        );
      } else if (resp['data']['data'] !== undefined) {
        await this.appService.updateSubmissionStatus(
          job.data.data.id,
          'PROCESSED',
        );
        for (const element of resp.data.data) {
          const payload = slrTemplate(element.name);
          const templateId = this.configService.get<string>('SLR_TEMPLATE_ID');
          const resp = await this.appService.registerSms(
            element.phone,
            templateId,
            payload,
          );
          await this.appService.insertSmsTrackEntry({
            type: job.data.data.type,
            user_id: job.data.data.user_id,
            phone_no: String(element.phone),
            instance_id: job.data.data.instance_id,
            created_at: job.data.data.created_at,
            status: resp.message || resp.error,
            message_id: resp?.result?.messageId || '',
          });
        }
        await this.appService.updateSubmissionStatus(job.data.data.id, 'DONE');
      }
    } catch (error) {
      this.logger.error(`id: ${job.data.data.id}: ERROR:`, error);
      await this.appService.updateSubmissionStatus(
        job.data.data.id,
        'FAILED',
        error.message,
      );
    }

    return 'OK';
  }
}
