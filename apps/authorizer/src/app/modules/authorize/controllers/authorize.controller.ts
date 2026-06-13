import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { TcpLoggerInterceptor } from '@common/intercepters/tcpLogger.intercepter';
import { LoginTcpRequest, LoginTcpResponse } from '@common/interfaces/tcp/authorize';
import { TCP_REQUEST_MESSAGE } from '@common/constant/enum/tcp-request-message';
import { AuthorizerService } from '../services/authorize.service';
import { AuthorizeResponse } from '@common/interfaces/tcp/authorize';
import { ProcessId } from '@common/decorators/processId.decorator';

@Controller()
@UseInterceptors(TcpLoggerInterceptor)
export class AuthorizerController {
    constructor(private readonly authorizerService: AuthorizerService) { }

    @MessagePattern(TCP_REQUEST_MESSAGE.AUTHORIZE.LOGIN)
    async login(@RequestParams() params: LoginTcpRequest) {
        const result = await this.authorizerService.login(params);
        return Response.success<LoginTcpResponse>(result);
    }

    @MessagePattern(TCP_REQUEST_MESSAGE.AUTHORIZE.VERIFY_USER_TOKEN)
    async verifyUserToken(@RequestParams() params: string, @ProcessId() processId: string) {
        const result = await this.authorizerService.verifyUserToken(params, processId);
        return Response.success<AuthorizeResponse>(result);
    }
}