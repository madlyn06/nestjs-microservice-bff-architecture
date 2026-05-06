import { Injectable } from '@nestjs/common';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { CreateInvoiceTcpRequest } from '@common/interfaces/tcp/invoice';
import { invoiceRequestMapping } from '../mappers';

@Injectable()
export class InvoiceService {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async create(data: CreateInvoiceTcpRequest) {
    const input = invoiceRequestMapping(data);
    const result = await this.invoiceRepository.create(input);
    return result;
  }
}
