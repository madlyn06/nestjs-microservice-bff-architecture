import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ClientsProviderAsyncOptions,
  TcpClientOptions,
  Transport,
} from '@nestjs/microservices';
import { IsNotEmpty, IsObject } from 'class-validator';

export enum TcpService {
  INVOICE_SERVICE = 'TCP_INVOICE_SERVICE',
  PRODUCT_SERVICE = 'TCP_PRODUCT_SERVICE',
  USER_ACCESS_SERVICE = 'TCP_USER_ACCESS_SERVICE',
  //   PAYMENT_SERVICE = 'TCP_PAYMENT_SERVICE',
  //   NOTIFICATION_SERVICE = 'TCP_NOTIFICATION_SERVICE',
  //   SMS_SERVICE = 'TCP_SMS_SERVICE',
}

export class TcpConfiguration {
  @IsNotEmpty()
  @IsObject()
  TCP_INVOICE_SERVICE: TcpClientOptions;

  @IsNotEmpty()
  @IsObject()
  TCP_PRODUCT_SERVICE: TcpClientOptions;

  @IsNotEmpty()
  @IsObject()
  TCP_USER_ACCESS_SERVICE: TcpClientOptions;

  constructor() {
    Object.entries(TcpService).forEach(([key, value]) => {
      const host = process.env[`${key}_HOST`];
      const port = Number(process.env[`${value}_PORT`]);

      this[value] = {
        transport: Transport.TCP,
        options: {
          host: host,
          port: port,
        },
      };
    });
  }
}

export function TcpProvider(
  serviceName: keyof TcpConfiguration,
): ClientsProviderAsyncOptions {
  return {
    name: serviceName,
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService): TcpClientOptions => {
      return configService.get<TcpClientOptions>(
        `TCP_CONFIG.${serviceName}`,
      ) as TcpClientOptions;
    },
  };
}
