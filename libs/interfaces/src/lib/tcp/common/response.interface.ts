import { HttpMessage } from '@common/constant/enum/httpMessage.constant';
import { HttpStatus } from '@nestjs/common';

export class Response<T> {
  code: string;
  data?: T;
  error?: string;
  statusCode: number;

  constructor(data: Partial<Response<T>>) {
    this.code = data.code ?? HttpMessage.OK;
    this.data = data.data;
    this.error = data.error;
    this.statusCode = data.statusCode ?? HttpStatus.OK;
  }

  static success<T>(data: T) {
    return new Response<T>({
      data,
      code: HttpMessage.OK,
      statusCode: HttpStatus.OK,
    });
  }
}

export type ResponseType<T> = Response<T>;
