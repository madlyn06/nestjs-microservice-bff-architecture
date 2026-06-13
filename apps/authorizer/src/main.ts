/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: AppModule.configuration?.TCP_CONFIG?.TCP_AUTHORIZE_SERVICE?.options?.port || 3205,
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: AppModule.configuration.GRPC_SERV.GRPC_AUTHORIZER_SERVICE.name,
      protoPath: AppModule.configuration.GRPC_SERV.GRPC_AUTHORIZER_SERVICE.options.protoPath,
      url: AppModule.configuration.GRPC_SERV.GRPC_AUTHORIZER_SERVICE.options.url,
    },
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.AUTHORIZE_PORT || 3000;

  await app.startAllMicroservices();
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
