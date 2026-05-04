import { BaseConfiguration } from '@common/config/base.config';
import { AppConfiguration } from '@common/config/app.config';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

class Configuration extends BaseConfiguration {
  @Type(() => AppConfiguration)
  @ValidateNested()
  APP_CONFIG = new AppConfiguration();
}

export const configuration = new Configuration();

export type IConfiguration = typeof configuration;

configuration.validate();
