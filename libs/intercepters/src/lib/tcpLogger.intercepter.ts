import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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
    );
  }
}
