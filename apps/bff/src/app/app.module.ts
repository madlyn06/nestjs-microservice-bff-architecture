import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration, IConfiguration } from '../configuration/index';
import { LoggerMiddleware } from '@common/middlewares/logger.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionInterceptor } from '@common/intercepters/exception.intercepter';
import { InvoiceModule } from './modules/invoice/invoice.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => configuration],
    }),
    InvoiceModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ExceptionInterceptor,
    },
  ],
})
export class AppModule {
  static configuration: IConfiguration = configuration;

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/');
  }
}
