/**
 * 环境配置
 */
import dotenv from 'dotenv';
import path from 'path';

// 加载环境变量
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

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
  server: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),
    host: process.env.HOST || 'localhost',
  },
  
  // 数据库配置
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/datascope',
    type: getConfig('DATABASE_TYPE', 'mysql'),
    logging: getConfig<string>('DATABASE_LOGGING', 'true') === 'true',
  },
  
  // 安全配置
  security: {
    jwtSecret: getConfig('JWT_SECRET', 'datascope-secret'),
    jwtExpiresIn: getConfig('JWT_EXPIRES_IN', '24h'),
    encryptionKey: getConfig('ENCRYPTION_KEY', 'datascope-default-encryption-key-12345'),
  },
  
  // 密码加密配置（数据源密码用）
  encryption: {
    key: getConfig('ENCRYPTION_KEY', 'datascope-default-encryption-key-12345'),
  },
  
  // 日志配置
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    filename: process.env.LOG_FILENAME || 'datascope.log',
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
  
  // 新增配置
  crypto: {
    secret: process.env.CRYPTO_SECRET || 'datascope-secret-key',
  },
};

export default config;