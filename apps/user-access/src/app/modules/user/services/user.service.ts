import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { createUserRequestMapping } from '../mappers/user-request.mapper';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(params: CreateUserTcpRequest) {
    const isExists = await this.userRepository.exists(params.email);

    if (isExists) {
      throw new BadRequestException('User already exists');
    }

    const input = createUserRequestMapping(params);

    return this.userRepository.create(input);
  }
}
