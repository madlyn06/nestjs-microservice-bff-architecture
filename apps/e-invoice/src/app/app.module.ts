import { Module } from '@nestjs/common';
import { configuration, IConfiguration } from '../configuration';
import { MongoProvider } from '@common/config/mongodb.config';
import { ConfigModule } from '@nestjs/config';
import { InvoiceModule } from './modules/invoice/invoice.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [() => configuration] }),
    MongoProvider,
    InvoiceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  static configuration: IConfiguration = configuration;
}
