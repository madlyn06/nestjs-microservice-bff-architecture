import { IsNotEmpty, IsString } from "class-validator";

export class KeyCloakConfig {
    @IsString()
    @IsNotEmpty()
    HOST: string;

    @IsString()
    @IsNotEmpty()
    REALM: string;

    @IsString()
    @IsNotEmpty()
    CLIENT_ID: string;

    @IsString()
    @IsNotEmpty()
    CLIENT_SECRET: string;

    constructor() {
        this.HOST = process.env["KEYCLOAK_HOST"] || 'http://localhost:8080';
        this.REALM = process.env["KEYCLOAK_REALM"] || 'master';
        this.CLIENT_ID = process.env["KEYCLOAK_CLIENT_ID"] || 'admin-cli';
        this.CLIENT_SECRET = process.env["KEYCLOAK_CLIENT_SECRET"] || '';
    }
}
