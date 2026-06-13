import { User } from '@common/schemas/user.schema';
import { Invoice } from '@common/schemas/invoice.schemas';
import { LoginResponseDto } from '../../gateway/authorize';
import { JwtPayload } from 'jsonwebtoken';
import { PERMISSION } from '@common/constant/enum/role.enum';

export type InvoiceTcpResponse = Invoice;

export type LoginTcpResponse = LoginResponseDto;

export class AuthorizedMetadata {
    userId: string | undefined;
    user: User | undefined;
    permissions: PERMISSION[] | undefined;
    jwt: JwtPayload | undefined;

    constructor(payload?: Partial<AuthorizedMetadata>) {
        Object.assign(this, payload);
    }
}

export class AuthorizeResponse {
    valid = false;
    metadata = new AuthorizedMetadata();

    constructor(payload?: Partial<AuthorizeResponse>) {
        Object.assign(this, payload);
    }
}

export class AuthorizedResult {
    valid: boolean;
    metadata?: AuthorizedMetadata;
}