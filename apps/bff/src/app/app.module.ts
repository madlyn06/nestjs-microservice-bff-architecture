import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { configuration, IConfiguration } from '../configuration/index';
import { LoggerMiddleware } from '@common/middlewares/logger.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionInterceptor } from '@common/intercepters/exception.intercepter';
import { ClientsModule, Transport } from '@nestjs/microservices';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => configuration],
    }),
    ClientsModule.register([
      {
        name: 'TCP_INVOICE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
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
