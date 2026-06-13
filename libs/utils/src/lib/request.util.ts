import { AuthorizedResult } from '@common/interfaces/tcp/authorize';
import { MetadataKeys } from '@common/constant/index';
import { UnauthorizedException } from '@nestjs/common';

export function getAccessToken(req: any, keepBearer = false): string {
    const token = req.headers?.['authorization'];

    return keepBearer ? token : parseToken(token);
}

export function setUserData(req: any, userData?: AuthorizedResult): void {
    req[MetadataKeys.USER_DATA] = userData;
}

export function parseToken(token: string): string {
    if (!token?.trim()) {
        throw new UnauthorizedException('Token is required');
    }

    if (token.includes(' ')) {
        return token.split(' ')[1];
    }
    return token;
}