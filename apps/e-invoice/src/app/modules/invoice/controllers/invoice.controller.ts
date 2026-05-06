import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TcpLoggerInterceptor } from '@common/intercepters/tcpLogger.intercepter';
import { TCP_REQUEST_MESSAGE } from '@common/constant/enum/tcp-request-message';
import { CreateInvoiceTcpRequest } from '@common/interfaces/tcp/invoice';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { InvoiceTcpResponse } from '@common/interfaces/tcp/invoice';
import { InvoiceService } from '../services/invoice.service';

@Controller()
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.INVOICE.CREATE)
  @UseInterceptors(new TcpLoggerInterceptor())
  async createInvoice(
    @RequestParams() params: CreateInvoiceTcpRequest,
  ): Promise<Response<InvoiceTcpResponse>> {
    console.log('params', params);
    const result = await this.invoiceService.create(params);
    return Response.success(result);
  }
}
