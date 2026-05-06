import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { MetadataKeys } from '@common/constant/index';
import { randomUUID } from '@common/utils/index';

export const ProcessId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request[MetadataKeys.PROCESS_ID] || randomUUID();
  },
);
