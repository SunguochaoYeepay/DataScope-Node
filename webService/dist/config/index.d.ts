declare const config: {
    server: {
        port: string | number;
        host: string;
        nodeEnv: string;
    };
    database: {
        url: string;
        maxConnections: number;
        ssl: boolean;
    };
    jwtSecret: string;
    jwtExpires: string;
    encryption: {
        secretKey: string;
        algorithm: string;
    };
    logging: {
        level: string;
        format: string;
        dir: string;
    };
    cache: {
        ttl: number;
        checkPeriod: number;
    };
    api: {
        prefix: string;
        rateLimit: {
            windowMs: number;
            max: number;
        };
        timeout: number;
    };
    development: {};
};
export default config;
