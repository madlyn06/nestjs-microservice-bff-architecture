/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from '@common/utils/index';
import { MetadataKeys } from '@common/constant/index';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { body, method, originalUrl } = req;
    const processId = randomUUID();
    const startTime = Date.now();

    (req as any)[MetadataKeys.PROCESS_ID] = processId;
    (req as any)[MetadataKeys.START_TIME] = startTime;

    Logger.log(
      `HTTP start process => ${processId} method: ${method} url: ${originalUrl} body: ${JSON.stringify(body)} at ${startTime}`,
    );

    const originalSend = res.send.bind(res);

    res.send = function (body) {
      const duration = Date.now() - startTime;
      Logger.log(
        `HTTP end process => ${processId} status: ${res.statusCode} body: ${JSON.stringify(body)} at ${startTime} duration: ${duration}`,
      );
      return originalSend(body);
    };
    next();
  }
}
