import { BaseConfiguration } from '@common/config/base.config';
import { AppConfiguration } from '@common/config/app.config';
import { TcpConfiguration } from '@common/config/tcp.config';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { TypeOrmConfig } from '@common/config/type-orm.config';

class Configuration extends BaseConfiguration {
  @Type(() => AppConfiguration)
  @ValidateNested()
  APP_CONFIG = new AppConfiguration();

  @Type(() => TcpConfiguration)
  @ValidateNested()
  TCP_CONFIG = new TcpConfiguration();

  @Type(() => TypeOrmConfig)
  @ValidateNested()
  TYPEORM_CONFIG = new TypeOrmConfig();
}

export const configuration = new Configuration();

export type IConfiguration = typeof configuration;

configuration.validate();
