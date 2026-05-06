import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RpcException } from '@nestjs/microservices';
import { HttpMessage } from '@common/constant/enum/httpMessage.constant';
@Injectable()
export class TcpLoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const handler = context.getHandler();
    const handlerName = handler.name;

    const args = context.getArgs();
    const param = args[0];
    const processID = param.processID;

    Logger.log(
      `TCP start processing with process id ${processID} >> method: ${handlerName} at ${startTime} >> with body: ${JSON.stringify(param)}`,
    );

    return next.handle().pipe(
      tap(() => {
        const durationMs = Date.now() - startTime;
        Logger.log(
          `TCP end processing with process id ${processID} >> method: ${handlerName} affter ${durationMs}ms`,
        );
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        Logger.error(
          `TCP » Error process '${processID}': ${error.message} >> data: ${JSON.stringify(
            error,
          )}, after: '${duration}ms'`,
        );

        throw new RpcException({
          code:
            error.status ||
            error.code ||
            error.error?.code ||
            HttpStatus.INTERNAL_SERVER_ERROR,
          message:
            error?.response?.message ||
            error?.message ||
            HttpMessage.INTERNAL_SERVER_ERROR,
        });
      }),
    );
  }
}
