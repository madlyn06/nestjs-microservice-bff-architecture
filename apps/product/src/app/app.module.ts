import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration, IConfiguration } from '../configuration';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [() => configuration] }),
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  static configuration: IConfiguration = configuration;
}
