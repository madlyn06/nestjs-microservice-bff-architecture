import { BaseConfiguration } from '@common/config/base.config';
import { AppConfiguration } from '@common/config/app.config';
import { TcpConfiguration } from '@common/config/tcp.config';
import { MongoConfiguration } from '@common/config/mongodb.config';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

class Configuration extends BaseConfiguration {
  @Type(() => AppConfiguration)
  @ValidateNested()
  APP_CONFIG = new AppConfiguration();

  @Type(() => TcpConfiguration)
  @ValidateNested()
  TCP_CONFIG = new TcpConfiguration();

  @Type(() => MongoConfiguration)
  @ValidateNested()
  MONGO_CONFIG = new MongoConfiguration();
}

export const configuration = new Configuration();
console.log(configuration.TCP_CONFIG, 'configuration.TCP_CONFIG');

export type IConfiguration = typeof configuration;

configuration.validate();
