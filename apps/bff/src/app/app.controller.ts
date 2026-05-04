import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('TCP_INVOICE_SERVICE') private readonly invoiceClient: ClientProxy,
  ) {}

  @Get()
  getData() {
    const result = this.appService.getData();
    return new ResponseDto<{
      message: string;
    }>({
      data: result,
    });
  }

  @Get('invoice')
  async getInvoice() {
    const result = await firstValueFrom(
      this.invoiceClient.send('get_invoices', { data: 'Hello from BFF' }),
    );
    return new ResponseDto({
      data: result,
    });
  }
}
