import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TcpProvider, TcpService } from '@common/config/tcp.config';
import { InvoiceController } from './controllers/invoice.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([TcpProvider(TcpService.INVOICE_SERVICE)]),
  ],
  controllers: [InvoiceController],
  providers: [],
})
export class InvoiceModule {}
