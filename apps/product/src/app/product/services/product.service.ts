import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductTcpRequest } from '@common/interfaces/tcp/product';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(data: CreateProductTcpRequest) {
    const { sku, name } = data;
    console.log(sku, 'SKUUUU');
    const exists = await this.productRepository.exists(sku, name);
    if (exists) {
      console.log('product is exists');
      throw new BadRequestException('Product already exists');
    }
    console.log('dzzzzzz d');

    return this.productRepository.create(data);
  }

  getList() {
    return this.productRepository.findAll();
  }
}
