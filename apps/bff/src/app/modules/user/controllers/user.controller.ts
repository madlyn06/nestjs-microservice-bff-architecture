import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserRequestDto } from '@common/interfaces/gateway/user';
import { ProcessId } from '@common/decorators/processId.decorator';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { map } from 'rxjs';
import { TCP_REQUEST_MESSAGE } from '@common/constant/enum/tcp-request-message';
import { TcpService } from '@common/config/tcp.config';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    @Inject(TcpService.USER_ACCESS_SERVICE)
    private readonly userAccessClient: TcpClient,
  ) {}

  @Post()
  @ApiOkResponse({
    type: ResponseDto<string>,
  })
  @ApiOperation({
    summary: 'Create a new user',
  })
  create(@Body() body: CreateUserRequestDto, @ProcessId() processId: string) {
    return this.userAccessClient
      .send<string, CreateUserTcpRequest>(TCP_REQUEST_MESSAGE.USER.CREATE, {
        data: body,
        processId,
      })
      .pipe(map((data) => new ResponseDto(data)));
  }
}
