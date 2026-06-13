import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateInvoiceRequestDto, InvoiceResponseDto } from '@common/interfaces/gateway/invoice';
import { TcpService } from '@common/config/tcp.config';
import { TCP_REQUEST_MESSAGE } from '@common/constant/enum/tcp-request-message';
import { InvoiceTcpResponse, CreateInvoiceTcpRequest } from '@common/interfaces/tcp/invoice';
import { ProcessId } from '@common/decorators/processId.decorator';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { Authorization } from '@common/decorators/authorize.decorator';

@ApiTags('invoices')
@Controller('invoices')
export class InvoiceController {
  constructor(
    @Inject(TcpService.INVOICE_SERVICE)
    private readonly invoiceClient: TcpClient,
  ) {}

  @Post('')
  @ApiOkResponse({ type: ResponseDto<InvoiceResponseDto> })
  @ApiOperation({ summary: 'Create a new invoice' })
  @Authorization({ secured: true })
  createInvoice(@Body() body: CreateInvoiceRequestDto, @ProcessId() processId: string) {
    return this.invoiceClient.send<InvoiceTcpResponse, CreateInvoiceTcpRequest>(
      TCP_REQUEST_MESSAGE.INVOICE.CREATE,
      {
        data: body,
        processId,
      },
    );
  }
}
