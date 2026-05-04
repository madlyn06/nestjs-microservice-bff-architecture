import { IsNotEmpty, IsNumber } from 'class-validator';

export class AppConfiguration {
  @IsNumber()
  @IsNotEmpty()
  PORT: number;

  constructor() {
    this.PORT = Number(process.env['PORT']) || 3300;
  }
}
