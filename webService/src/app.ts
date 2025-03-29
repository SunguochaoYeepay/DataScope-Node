import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import config from './config/env';
import { requestLogger } from './middlewares/request-logger.middleware';
import { errorHandler } from './middlewares/error-handler.middleware';
import router from './api/routes/index';
import setupSwagger from './config/swagger';
import logger from './utils/logger';
import os from 'os';
import { healthMonitor } from './utils/health-monitor';
import { ApiError } from './utils/errors';

// 创建Express应用
const app: Express = express();

// 安全中间件
app.use(helmet());

// CORS配置
app.use(cors());

// 解析JSON请求体
app.use(express.json());

// 解析URL编码的请求体
app.use(express.urlencoded({ extended: true }));

// 请求日志中间件 - 使用新的中间件
app.use(requestLogger);

// API路由 - 修复：使用配置的API前缀
const apiPrefix = config.service.apiPrefix || '/api';
logger.info(`挂载API路由，前缀: "${apiPrefix}"`);
app.use(apiPrefix, router);

// Swagger文档
setupSwagger(app);

// 健康检查端点
app.get('/status', (req, res) => {
  res.json({ 
    status: 'UP',
    timestamp: new Date(),
    api: 'DataScope API',
    version: process.env.npm_package_version || '1.0.0',
    env: process.env.NODE_ENV || 'development'
  });
});

// 为了向后兼容，保留原健康检查端点，但返回简化信息
app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

// 系统信息端点 - 仅在开发环境可用
if (process.env.NODE_ENV === 'development') {
  app.get('/system-info', (req, res) => {
    // 收集系统信息
    const systemInfo = {
      os: {
        platform: os.platform(),
        release: os.release(),
        type: os.type(),
        arch: os.arch(),
        cpus: os.cpus().length,
        totalMemory: `${Math.round(os.totalmem() / (1024 * 1024 * 1024))} GB`,
        freeMemory: `${Math.round(os.freemem() / (1024 * 1024 * 1024))} GB`,
        uptime: `${Math.round(os.uptime() / 3600)} hours`
      },
      process: {
        pid: process.pid,
        version: process.version,
        memoryUsage: process.memoryUsage(),
        uptime: `${Math.round(process.uptime() / 60)} minutes`
      },
      env: {
        node_env: process.env.NODE_ENV,
        port: config.service.port,
        api_prefix: config.service.apiPrefix
      }
    };
    
    res.json(systemInfo);
  });
}

// 404处理中间件
app.use((req: Request, res: Response, next: NextFunction) => {
  next(ApiError.notFound(`未找到请求的路径: ${req.originalUrl}`));
});

// 错误处理中间件 - 使用新的中间件
app.use(errorHandler);

// 启动服务器
if (process.env.NODE_ENV !== 'test') {
  const PORT = config.service.port;
  app.listen(PORT, () => {
    logger.info(`服务已启动，监听端口: ${PORT}`);
    logger.info(`API文档地址: http://localhost:${PORT}/api-docs`);
    
    // 启动健康监控系统
    const monitorInterval = process.env.NODE_ENV === 'production' ? 15 : 5; // 生产环境15分钟，开发环境5分钟
    healthMonitor.start();
    logger.info(`健康监控系统已启动，检查间隔: ${monitorInterval}分钟`);
    
    // 记录所有已注册的路由
    logger.info('已注册的路由:');
    app._router.stack.forEach((r: any) => {
      if (r.route && r.route.path) {
        logger.info(`${Object.keys(r.route.methods).join(',')} ${r.route.path}`);
      }
    });
  });
}

// 在应用关闭时停止健康监控
process.on('SIGINT', () => {
  logger.info('应用正在关闭...');
  healthMonitor.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('应用正在关闭...');
  healthMonitor.stop();
  process.exit(0);
});

export default app;