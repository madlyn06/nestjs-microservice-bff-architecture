import { DatabaseType } from 'typeorm';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export class TypeOrmConfig {
  @IsString()
  @IsNotEmpty()
  HOST: string;

  @IsNumber()
  @IsNotEmpty()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  USERNAME: string;

  @IsString()
  @IsNotEmpty()
  PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  DATABASE: string;

  @IsString()
  @IsNotEmpty()
  TYPE: DatabaseType;

  constructor(data?: Partial<TypeOrmConfig>) {
    this.HOST = data?.HOST || process.env['DB_POSTGRES_HOST'] || 'localhost';
    this.PORT = data?.PORT || Number(process.env['DB_POSTGRES_PORT']) || 5432;
    this.USERNAME = data?.USERNAME || process.env['DB_POSTGRES_USER'] || 'root';
    this.PASSWORD =
      data?.PASSWORD || process.env['DB_POSTGRES_PASSWORD'] || 'password';
    this.DATABASE =
      data?.DATABASE || process.env['DB_POSTGRES_DB'] || 'e-invoice';
    this.TYPE =
      data?.TYPE ||
      (process.env['DB_POSTGRES_TYPE'] as DatabaseType) ||
      'postgres';
  }
}

export const TypeOrmProvider = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      type: configService.get<string>('TYPEORM_CONFIG.TYPE') as DatabaseType,
      host: configService.get<string>('TYPEORM_CONFIG.HOST'),
      port: configService.get<number>('TYPEORM_CONFIG.PORT'),
      username: configService.get<string>('TYPEORM_CONFIG.USERNAME'),
      password: configService.get<string>('TYPEORM_CONFIG.PASSWORD'),
      database: configService.get<string>('TYPEORM_CONFIG.DATABASE'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    } as TypeOrmModuleOptions;
  },
});