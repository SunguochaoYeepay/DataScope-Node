/**
 * 环境配置
 */
import dotenv from 'dotenv';
import path from 'path';

// 加载环境变量
dotenv.config();

/**
 * 获取配置项，如果不存在则返回默认值
 */
const getConfig = <T>(key: string, defaultValue: T): T => {
  const value = process.env[key];
  
  if (value === undefined) {
    return defaultValue;
  }
  
  // 根据默认值类型转换环境变量
  if (typeof defaultValue === 'number') {
    return Number(value) as unknown as T;
  }
  
  if (typeof defaultValue === 'boolean') {
    return (value.toLowerCase() === 'true') as unknown as T;
  }
  
  return value as unknown as T;
};

const config = {
  // 服务配置
  service: {
    name: getConfig('SERVICE_NAME', 'datascope'),
    env: getConfig('NODE_ENV', 'development'),
    port: getConfig('PORT', 3000),
    host: getConfig('HOST', 'localhost'),
    apiPrefix: getConfig('API_PREFIX', '/api'),
    version: '1.0.0',
    isProd: getConfig<string>('NODE_ENV', 'development') === 'production',
    isDev: getConfig<string>('NODE_ENV', 'development') === 'development',
    isTest: getConfig<string>('NODE_ENV', 'development') === 'test',
  },
  
  // 数据库配置
  database: {
    url: getConfig('DATABASE_URL', ''),
    type: getConfig('DATABASE_TYPE', 'mysql'),
    logging: getConfig<string>('DATABASE_LOGGING', 'true') === 'true',
  },
  
  // 安全配置
  security: {
    jwtSecret: getConfig('JWT_SECRET', 'datascope-secret'),
    jwtExpiresIn: getConfig('JWT_EXPIRES_IN', '24h'),
    encryptionKey: getConfig('ENCRYPTION_KEY', 'datascope-default-encryption-key'),
  },
  
  // 密码加密配置（数据源密码用）
  encryption: {
    key: getConfig('ENCRYPTION_KEY', 'datascope-encryption-key'),
  },
  
  // 日志配置
  logging: {
    level: getConfig('LOG_LEVEL', 'info'),
    dir: getConfig('LOG_DIR', path.resolve(process.cwd(), 'logs')),
    maxSize: getConfig('LOG_MAX_SIZE', '20m'),
    maxFiles: getConfig('LOG_MAX_FILES', 7),
  },
  
  // 缓存配置
  cache: {
    ttl: getConfig('CACHE_TTL', 300), // 默认缓存时间，单位：秒
  },
  
  // 元数据同步配置
  metadataSync: {
    interval: getConfig('METADATA_SYNC_INTERVAL', 3600), // 默认同步间隔，单位：秒
    batchSize: getConfig('METADATA_SYNC_BATCH_SIZE', 100), // 每批同步表数量
  },
  
  // Redis配置（可选）
  redis: {
    enabled: getConfig<string>('REDIS_ENABLED', 'false') === 'true',
    host: getConfig('REDIS_HOST', 'localhost'),
    port: getConfig('REDIS_PORT', 6379),
    password: getConfig('REDIS_PASSWORD', ''),
    db: getConfig('REDIS_DB', 0),
  },
};

export default config;