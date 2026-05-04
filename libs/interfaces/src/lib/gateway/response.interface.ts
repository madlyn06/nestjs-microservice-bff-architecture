import { HttpStatus } from '@nestjs/common';
import { HttpMessage } from '@common/constant/enum/httpMessage.constant';

export class ResponseDto<T> {
  message = HttpMessage.OK;
  data?: T;
  statusCode = HttpStatus.OK;
  processID?: string;
  durationMs?: number;

  constructor(partial: Partial<ResponseDto<T>>) {
    Object.assign(this, partial);
  }
}
