import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TcpLoggerInterceptor } from '@common/intercepters/tcpLogger.intercepter';
import { TCP_REQUEST_MESSAGE } from '@common/constant/enum/tcp-request-message';
import { CreateInvoiceTcpRequest } from '@common/interfaces/tcp/invoice';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { InvoiceTcpResponse } from '@common/interfaces/tcp/invoice';

@Controller()
export class RoleController { }
