import { MetadataKeys } from '@common/constant/index';
import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthorizedMetadata, AuthorizedResult } from '@common/interfaces/tcp/authorize';

export const UserData = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  const userData = request[MetadataKeys.USER_DATA] as AuthorizedResult;

  if (!userData) {
    throw new UnauthorizedException('User data not found');
  }

  return new AuthorizedMetadata(userData?.metadata);
});
