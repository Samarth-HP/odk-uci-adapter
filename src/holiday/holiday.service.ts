import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { catchError, map, tap } from "rxjs/operators";
import { PrismaService } from "../PrismaService";

@Injectable()
export class HolidayService {
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
      console.log(response.data.status);
      console.log(response);
      status = response.data.status;
      if (status === 200) {
        this.updateSubmissionStatus(id);
        console.log("message sent");
      }
    }), catchError(e => {
      throw new HttpException(e.response.data, e.response.status);
    })).subscribe();

    return resp;
  }

  async updateSubmissionStatus(id): Promise<any> {
    return this.prisma.submission.update({
      where: { id: id },
      data: { status: "sent" }
    });
  }
}
