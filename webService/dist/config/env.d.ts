declare const config: {
    service: {
        name: string;
        env: string;
        port: number;
        host: string;
        apiPrefix: string;
        version: string;
        isProd: boolean;
        isDev: boolean;
        isTest: boolean;
    };
    database: {
        url: string;
        type: string;
        logging: boolean;
    };
    security: {
        jwtSecret: string;
        jwtExpiresIn: string;
        encryptionKey: string;
    };
    encryption: {
        key: string;
    };
    logging: {
        level: string;
        dir: string;
        maxSize: string;
        maxFiles: number;
    };
    cache: {
        ttl: number;
    };
    metadataSync: {
        interval: number;
        batchSize: number;
    };
    redis: {
        enabled: boolean;
        host: string;
        port: number;
        password: string;
        db: number;
    };
};
export default config;
