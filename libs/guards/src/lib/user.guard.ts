import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { firstValueFrom, map, Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { MetadataKeys } from '@common/constant/index';
import { TcpService } from '@common/config/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { getAccessToken, setUserData } from '@common/utils/request.util';
import { randomUUID } from '@common/utils/index';
import { AuthorizeResponse } from '@common/interfaces/tcp/authorize';
import { TCP_REQUEST_MESSAGE } from '@common/constant/enum/tcp-request-message';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { createHash } from 'crypto';

@Injectable()
export class UserGuard implements CanActivate {
  private readonly logger = new Logger(UserGuard.name);

  constructor(
    private readonly reflector: Reflector,
    @Inject(TcpService.AUTHORIZE_SERVICE) private readonly authorizerClient: TcpClient,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const authOptions = this.reflector.get<{ secured: boolean }>(
      MetadataKeys.SECURED,
      context.getHandler(),
    );

    const req = context.switchToHttp().getRequest();

    if (!authOptions?.secured) {
      return true;
    }

    return this.verifyUserToken(req);
  }

  private async verifyUserToken(req: any): Promise<boolean> {
    try {
      const token = getAccessToken(req);
      const cacheKey = this.generateTokenCacheKey(token);
      console.log('Generated cache key:', cacheKey);
      console.log(token);

      const processId = req[MetadataKeys.PROCESS_ID] || randomUUID('einvoice-app');

      const cacheData = await this.cacheManager.get<AuthorizeResponse>(cacheKey);

      if (cacheData) {
        setUserData(req, cacheData);
        return true;
      }

      req[MetadataKeys.PROCESS_ID] = processId;

      const result = await this.verifyToken(token, processId);
      console.log(result, 'verify result');

      if (!result?.valid) {
        throw new UnauthorizedException('Token is invalid');
      }

      this.logger.debug(`Set user data to cache for cache key: ${cacheKey}`);

      setUserData(req, result);
      this.cacheManager.set(cacheKey, result, 30 * 60 * 1000);

      return true;
    } catch (error) {
      this.logger.error({ error });
      throw new UnauthorizedException('Token is invalid');
    }
  }

  private async verifyToken(token: string, processId: string) {
    return firstValueFrom(
      this.authorizerClient
        .send<AuthorizeResponse, string>(TCP_REQUEST_MESSAGE.AUTHORIZE.VERIFY_USER_TOKEN, {
          data: token,
          processId,
        })
        .pipe(map((data) => data.data)),
    );
  }

  private generateTokenCacheKey(token: string): string {
    const hash = createHash('sha256').update(token).digest('hex');
    return `user-token:${hash}`;
  }
}
