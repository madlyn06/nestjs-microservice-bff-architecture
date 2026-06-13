import { Controller, UseInterceptors } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { MessagePattern } from '@nestjs/microservices';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { TcpLoggerInterceptor } from '@common/intercepters/tcpLogger.intercepter';
import { TCP_REQUEST_MESSAGE } from '@common/constant/enum/tcp-request-message';
import { HttpMessage } from '@common/constant/enum/httpMessage.constant';
import { ProcessId } from '@common/decorators/processId.decorator';
import { User } from '@common/schemas/user.schema';

@Controller()
@UseInterceptors(TcpLoggerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.USER.CREATE)
  async create(
    @RequestParams() data: CreateUserTcpRequest,
    @ProcessId() processId: string,
  ): Promise<Response<string>> {
    console.log('Received create user request with data:', data);
    await this.userService.create(data, processId);
    return Response.success<string>(HttpMessage.CREATED);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.USER.GET_BY_USER_ID)
  async getByUserId(@RequestParams() userId: string) {
    console.log('Received get user by userId request with userId:', userId);
    const user = await this.userService.getUserByUserId(userId);
    console.log('Retrieved user:', user);
    return Response.success<User>(user as User);
  }
}
