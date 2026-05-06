import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TcpProvider, TcpService } from '@common/config/tcp.config';
import { ProductController } from './controllers/product.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([TcpProvider(TcpService.PRODUCT_SERVICE)]),
  ],
  controllers: [ProductController],
  providers: [],
})
export class ProductModule {}
