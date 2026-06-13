
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDestination } from '@common/schemas/user.schema';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { ClientsModule } from '@nestjs/microservices';
import { TcpProvider, TcpService } from '@common/config/tcp.config';

@Module({
  imports: [MongooseModule.forFeature([UserDestination]), ClientsModule.registerAsync([TcpProvider(TcpService.AUTHORIZE_SERVICE)]),],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [],
})
export class UserModule { }