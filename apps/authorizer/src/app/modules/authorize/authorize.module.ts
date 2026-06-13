import { Module } from "@nestjs/common";
import { KeycloakModule } from "../keycloak/keycloak.module";
import { AuthorizerService } from "./services/authorize.service";
import { AuthorizerController } from "./controllers/authorize.controller";
import { ClientsModule } from "@nestjs/microservices";
import { TcpProvider } from "@common/config/tcp.config";
import { TcpService } from "@common/config/tcp.config";

@Module({
    imports: [KeycloakModule,
        ClientsModule.registerAsync([TcpProvider(TcpService.USER_ACCESS_SERVICE)])
    ],
    controllers: [AuthorizerController],
    providers: [AuthorizerService],
})
export class AuthorizeModule { }