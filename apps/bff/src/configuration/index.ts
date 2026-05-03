class Configuration {
    NODE_ENV: string;
    IS_DEV:boolean;
    GLOBAL_PREFIX: string;
    PORT:number;

    constructor() {
        this.GLOBAL_PREFIX = process.env.GLOBAL_PREFIX || 'api/v1'
        this.PORT = Number(process.env.PORT) || 3300
        this.IS_DEV = process.env.NODE_ENV === 'development'
        this.NODE_ENV = process.env.NODE_ENV || 'development'
    }
}

export const configuration = new Configuration()

export type IConfiguration = typeof configuration