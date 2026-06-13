import { AuthorizeResponse, LoginTcpRequest } from '@common/interfaces/tcp/authorize';
import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { KeycloakHttpService } from '../../keycloak/services/keycloak-http.service';
import jwksRsa, { JwksClient } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { TcpService } from '@common/config/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import {Role} from "@common/schemas/role.schema";
import { firstValueFrom, map } from 'rxjs';
import { User } from '@common/schemas/user.schema';
import { TCP_REQUEST_MESSAGE } from '@common/constant/enum/tcp-request-message';

@Injectable()
export class AuthorizerService {
  private readonly logger = new Logger(AuthorizerService.name);
  private jwksClient: JwksClient;
  private host: string;
  private realm: string;

  constructor(
    private readonly keycloakHttpService: KeycloakHttpService,
    private readonly configService: ConfigService,
    @Inject(TcpService.USER_ACCESS_SERVICE) private readonly userAccessClient: TcpClient,
  ) {
    this.host = this.configService.get('KEYCLOAK_CONFIG.HOST') || 'http://localhost:8180';
    this.realm = this.configService.get('KEYCLOAK_CONFIG.REALM') || 'master';

    this.jwksClient = jwksRsa({
      jwksUri: `${this.host}/realms/${this.realm}/protocol/openid-connect/certs`,
      cache: true,
      rateLimit: true,
    });
  }

  async login(params: LoginTcpRequest) {
    const { password, username } = params;

    const { access_token: accessToken, refresh_token: refreshToken } =
      await this.keycloakHttpService.exchangeUserToken({ username, password });

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyUserToken(token: string, processId: string): Promise<AuthorizeResponse> {
    const decoded = jwt.decode(token, { complete: true }) as Jwt;
    if (!decoded || !decoded.header || !decoded.header.kid) {
      throw new UnauthorizedException('Invalid token structure');
    }

    try {
      const key = await this.jwksClient.getSigningKey(decoded.header.kid);

      const publicKey = key.getPublicKey();
      // get publickKey to verify token and get payload
      const payload = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as JwtPayload;
      this.logger.debug({ payload });

      const userId = payload.sub || '';

      const user = await this.userValidation(userId, processId);
      return {
        valid: true,
        metadata: {
          user,
          userId: user.id,
          jwt: payload,
          permissions: (user.roles as unknown as Role[])
            .map((role) => role.permissions)
            .flat()
            .filter(Boolean),
        },
      };
    } catch (error) {
      this.logger.error({ error });
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async userValidation(userId: string, processId: string) {
    const user = await this.getUserByUserId(userId, processId);

    this.logger.debug({ user });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  private getUserByUserId(userId: string, processId: string) {
    return firstValueFrom(
      this.userAccessClient
        .send<User, string>(TCP_REQUEST_MESSAGE.USER.GET_BY_USER_ID, {
          data: userId,
          processId,
        })
        .pipe(map((data) => data.data)),
    );
  }
}
