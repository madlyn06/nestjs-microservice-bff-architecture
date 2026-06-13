import { Module } from '@nestjs/common';
import { configuration, IConfiguration } from '../configuration';
import { ConfigModule } from '@nestjs/config';
import { KeycloakModule } from './modules/keycloak/keycloak.module';
import { AuthorizeModule } from './modules/authorize/authorize.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [() => configuration] }),
    KeycloakModule, AuthorizeModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  static configuration: IConfiguration = configuration;
}
