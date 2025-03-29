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

// API路由
app.use(config.service.apiPrefix, router);

// Swagger文档
setupSwagger(app);

// 健康检查端点
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
  });
}

export default app;