import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PORT } from '@common/constant/index';

@Injectable()
export class AppService {
  getData(): { message: string } {
    console.log('PORT ', PORT);
    throw new UnauthorizedException('Unauthorized');
    return { message: 'Hello API' };
  }
}
