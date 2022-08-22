import { HttpException, Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../PrismaService";
import { catchError, map } from "rxjs/operators";

@Injectable()
export class ExamService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
    private prisma: PrismaService
  ) {
  }

  async registerSms(data: any, string, id): Promise<any> {
    let status = 404;
    console.log({ data });
    let resp = this.httpService.post(`${this.configService.get<string>("UCI_URL")}/message/send`, data).pipe(map((response: any) => {
      response.data;
      status = response.data.status;
    }), catchError(e => {
      throw new HttpException(e.response.data, e.response.status);
    })).subscribe();
    if (status === 200) {
      const res = await this.updateSubmissionStatus(id);
    }
    return resp;
  }

  async updateSubmissionStatus(id): Promise<any> {
    return this.prisma.submission.updateMany({
      where: { id: id },
      data: { status: "sent" }
    });
  }
}
