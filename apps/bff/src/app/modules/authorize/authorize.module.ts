import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TcpService, TcpProvider } from '@common/config/tcp.config';
import { AuthorizerController } from './controllers/authorize.controller';

@Module({
    imports: [ClientsModule.registerAsync([TcpProvider(TcpService.AUTHORIZE_SERVICE)])],
    controllers: [AuthorizerController],
    providers: [],
    exports: [],
})
export class AuthorizerModule { }