/**
 * 应用配置
 */
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const config = {
  // 服务器配置
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  
  // 数据库配置
  database: {
    url: process.env.DATABASE_URL || '',
    maxConnections: parseInt(process.env.DATABASE_MAX_CONNECTIONS || '10'),
    ssl: process.env.DATABASE_SSL === 'true',
  },
  
  // 认证配置
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key',
  jwtExpires: process.env.JWT_EXPIRES || '1d',
  
  // 加密配置
  encryption: {
    secretKey: process.env.ENCRYPTION_KEY || 'dev-encryption-key',
    algorithm: process.env.ENCRYPTION_ALGORITHM || 'aes-256-cbc',
  },
  
  // 日志配置
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
    dir: process.env.LOG_DIR || 'logs',
  },
  
  // 缓存配置
  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '3600'),
    checkPeriod: parseInt(process.env.CACHE_CHECK_PERIOD || '600'),
  },
  
  // API配置
  api: {
    prefix: process.env.API_PREFIX || '/api',
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'),
      max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    },
    timeout: parseInt(process.env.API_TIMEOUT || '30000'),
  },
  
  // 开发环境配置
  development: {
    // 开发环境特有配置
  },
};

export default config; 