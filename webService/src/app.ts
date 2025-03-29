import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import config from './config/env';
import { loggerMiddleware } from './api/middlewares/logger';
import { errorHandler, notFoundHandler } from './api/middlewares/error';
import router from './api/routes/index';
import setupSwagger from './config/swagger';
import logger from './utils/logger';

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

// 请求日志中间件
app.use(loggerMiddleware);

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

// 404处理
app.use(notFoundHandler);

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
if (process.env.NODE_ENV !== 'test') {
  const PORT = config.service.port;
  app.listen(PORT, () => {
    logger.info(`服务已启动，监听端口: ${PORT}`);
    logger.info(`API文档地址: http://localhost:${PORT}/api-docs`);
    
    // 记录所有已注册的路由
    logger.info('已注册的路由:');
    app._router.stack.forEach((r: any) => {
      if (r.route && r.route.path) {
        logger.info(`${Object.keys(r.route.methods).join(',')} ${r.route.path}`);
      }
    });
  });
}

export default app;