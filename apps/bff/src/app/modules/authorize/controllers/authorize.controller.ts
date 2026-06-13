import { TcpService } from '@common/config/tcp.config';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginRequestDto, LoginResponseDto } from '@common/interfaces/gateway/authorize';
import { ProcessId } from '@common/decorators/processId.decorator';
import { LoginTcpRequest, LoginTcpResponse } from '@common/interfaces/tcp/authorize';
import { TCP_REQUEST_MESSAGE } from '@common/constant/enum/tcp-request-message';
import { map } from 'rxjs';
import { Authorization } from '@common/decorators/authorize.decorator';

@ApiTags('Authorizer')
@Controller('authorizer')
export class AuthorizerController {
  constructor(@Inject(TcpService.AUTHORIZE_SERVICE) private readonly authorizerClient: TcpClient) {}

  @Post('login')
  @ApiOkResponse({
    type: ResponseDto<LoginResponseDto>,
  })
  @ApiOperation({
    summary: 'Login with username and password',
  })
  login(@Body() body: LoginRequestDto, @ProcessId() processId: string) {
    return this.authorizerClient
      .send<LoginTcpResponse, LoginTcpRequest>(TCP_REQUEST_MESSAGE.AUTHORIZE.LOGIN, {
        data: body,
        processId,
      })
      .pipe(map((data) => new ResponseDto(data)));
  }
}
