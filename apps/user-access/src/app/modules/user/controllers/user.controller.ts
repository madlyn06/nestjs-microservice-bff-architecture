import { Controller, UseInterceptors } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { MessagePattern } from '@nestjs/microservices';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { TcpLoggerInterceptor } from '@common/intercepters/tcpLogger.intercepter';
import { TCP_REQUEST_MESSAGE } from '@common/constant/enum/tcp-request-message';
import { HttpMessage } from '@common/constant/enum/httpMessage.constant';

@Controller()
@UseInterceptors(TcpLoggerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.USER.CREATE)
  async create(@RequestParams() data: CreateUserTcpRequest) {
    await this.userService.create(data);
    return Response.success<string>(HttpMessage.CREATED);
  }
}
