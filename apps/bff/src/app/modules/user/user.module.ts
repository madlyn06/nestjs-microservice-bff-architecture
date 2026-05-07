import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TcpProvider, TcpService } from '@common/config/tcp.config';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([TcpProvider(TcpService.USER_ACCESS_SERVICE)]),
  ],
  controllers: [UserController],
  providers: [],
})
export class UserModule {}
