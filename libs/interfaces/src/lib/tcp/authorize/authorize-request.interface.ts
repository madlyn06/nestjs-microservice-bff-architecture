import { LoginRequestDto } from '../../gateway/authorize';

export type CreateKeycloakUserTcpReq = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};

export type LoginTcpRequest = LoginRequestDto;