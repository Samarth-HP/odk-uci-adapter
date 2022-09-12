import { InjectQueue } from '@nestjs/bull';
import { Body, Controller, Post } from '@nestjs/common';
import { Queue } from 'bull';
import { ExamService } from './exam.service';

@Controller('exam')
export class ExamController {
  constructor(
    @InjectQueue('exam') private readonly submissionQueue: Queue,
    private readonly examService: ExamService,
  ) {}

  @Post('submit')
  async submit(@Body() sub: any): Promise<any> {
    console.log({ subBody: sub.event.data.new });
    try {
      await this.submissionQueue.add('submit', {
        data: sub.event.data.new,
      });
      return 'Successfully Submitted!!';
    } catch (e) {
      return `Submission failed: ${e.message}`;
    }
  }

  @Post('test')
  async eventTest(@Body() body: any): Promise<any> {
    console.log('in event test');
    let dummyBody;

    dummyBody = {
      adapterId: '4e0c568c-7c42-4f88-b1d6-392ad16b8546',
      to: {
        userID: '8054307708',
        deviceType: 'PHONE',
        meta: {
          templateId: '1007822688560433203',
        },
      },
      payload: {
        text: `नमस्कार, प्रिय अभिभावकस्कूल की छुट्टियां 2022-08-11 से 2022-08-11 तक हैं। कृपया {#var#} को {#var#} से रोज़ स्कूल भेजें। - e-Samwad`,
      },
    };

    console.log('Sending');
    return this.examService.registerSms(
      dummyBody,
      body.xml_string,
      body.data.id,
    );
  }
}
