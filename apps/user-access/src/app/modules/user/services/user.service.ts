import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { createUserRequestMapping } from '../mappers/user-request.mapper';
import { TcpService } from '@common/config/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { TCP_REQUEST_MESSAGE } from '@common/constant/enum/tcp-request-message';
import { CreateKeycloakUserTcpReq } from '@common/interfaces/tcp/authorize';
import { map } from 'rxjs/internal/operators/map';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(TcpService.AUTHORIZE_SERVICE) private readonly authorizeClient: TcpClient,
  ) {}

  async create(params: CreateUserTcpRequest, processId: string) {
    const isExists = await this.userRepository.exists(params.email);

    if (isExists) {
      throw new BadRequestException('User already exists');
    }

    const keycloakUserId = await this.createKeycloakUser(processId, {
      email: params.email,
      password: params.password,
      firstName: params.firstName,
      lastName: params.lastName,
    });

    const input = createUserRequestMapping(params, keycloakUserId!);

    return this.userRepository.create(input);
  }

  createKeycloakUser(processId: string, data: CreateKeycloakUserTcpReq) {
    return firstValueFrom(
      this.authorizeClient
        .send<string>(TCP_REQUEST_MESSAGE.AUTHORIZE.CREATE_KEYCLOAK_USER, { data, processId })
        .pipe(map((data) => data.data)),
    );
  }

  getUserByUserId(userId: string) {
    return this.userRepository.getByUserId(userId);
  }
}
