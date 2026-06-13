import { Controller, UseInterceptors } from '@nestjs/common';
import { KeycloakHttpService } from '../services/keycloak-http.service';
import { MessagePattern } from '@nestjs/microservices';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { CreateKeycloakUserTcpReq } from '@common/interfaces/tcp/authorize';
import { TcpLoggerInterceptor } from '@common/intercepters/tcpLogger.intercepter';
import { TCP_REQUEST_MESSAGE } from '@common/constant/enum/tcp-request-message';

@Controller()
@UseInterceptors(TcpLoggerInterceptor)
export class KeycloakController {
    constructor(private readonly keycloakHttpService: KeycloakHttpService) { }

    @MessagePattern(TCP_REQUEST_MESSAGE.AUTHORIZE.CREATE_KEYCLOAK_USER)
    async createUser(@RequestParams() data: CreateKeycloakUserTcpReq): Promise<Response<string>> {
        console.log('Received create user request with data:', data);
        const result = await this.keycloakHttpService.createUser(data);
        return Response.success<string>(result);
    }
}