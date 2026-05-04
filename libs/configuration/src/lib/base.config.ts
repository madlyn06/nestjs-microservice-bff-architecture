import { IsBoolean, IsNotEmpty, IsString, validateSync } from 'class-validator';

export class BaseConfiguration {
  @IsString()
  NODE_ENV: string;

  @IsBoolean()
  @IsNotEmpty()
  IS_DEV: boolean;

  @IsString()
  @IsNotEmpty()
  GLOBAL_PREFIX: string;

  constructor() {
    this.GLOBAL_PREFIX = process.env['GLOBAL_PREFIX'] || 'api/v1';
    this.IS_DEV = process.env['NODE_ENV'] === 'development';
    this.NODE_ENV = process.env['NODE_ENV'] || 'development';
  }

  validate() {
    const errors = validateSync(this);
    console.log(errors, 'errors');
    if (errors.length) {
      throw new Error(
        'Configuration validation failed: ' + JSON.stringify(errors),
      );
    }
  }
}
