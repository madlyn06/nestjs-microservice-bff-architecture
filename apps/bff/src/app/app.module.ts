import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { configuration, IConfiguration } from '../configuration/index';
@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
      load: [() => configuration],
    }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static configuration: IConfiguration = configuration; 
}
