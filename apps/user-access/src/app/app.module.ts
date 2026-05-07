import { Module } from '@nestjs/common';
import { configuration, IConfiguration } from '../configuration';
import { MongoProvider } from '@common/config/mongodb.config';
import { ConfigModule } from '@nestjs/config';
import { RoleModule } from './modules/role/role.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [() => configuration] }),
    MongoProvider,
    RoleModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  static configuration: IConfiguration = configuration;
}
