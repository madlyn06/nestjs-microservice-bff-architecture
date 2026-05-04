import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpMessage } from '@common/constant/enum/httpMessage.constant';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ExceptionInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request: Request & { process_id: string; start_time: number } =
      ctx.getRequest();

    const { process_id, start_time } = request;

    return next.handle().pipe(
      map((data: ResponseDto<unknown>) => {
        const durationMs = Date.now() - start_time;

        data.processID = process_id;
        data.durationMs = durationMs;
        return data;
      }),
      catchError((error) => {
        this.logger.error({ error });
        const durationMs = Date.now() - start_time;

        const message =
          error?.response?.message ||
          error?.message ||
          error ||
          HttpMessage.INTERNAL_SERVER_ERROR;

        console.log(
          'status code ',
          error?.code || error?.statusCode || error?.response?.statusCode,
        );

        const statusCode =
          error?.code ||
          error?.statusCode ||
          error?.response?.statusCode ||
          HttpStatus.INTERNAL_SERVER_ERROR;

        throw new HttpException(
          new ResponseDto({
            data: null,
            message,
            statusCode,
            processID: process_id,
            durationMs,
          }),
          statusCode,
        );
      }),
    );
  }
}
