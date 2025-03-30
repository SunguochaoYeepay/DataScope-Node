import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import 'express-async-errors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import config from './config';
import logger from './utils/logger';

// 错误处理中间件
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  logger.error(`错误: ${message}`, { error: err, path: req.originalUrl });
  
  res.status(statusCode).json({
    success: false,
    message,
    stack: config.server.nodeEnv === 'development' ? err.stack : undefined
  });
};

// 创建Express应用实例
const app: Application = express();

// 应用中间件
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// 健康检查路由
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'DataScope API',
    version: '1.0.5'  // 硬编码版本号
  });
});

// 动态导入路由
import('./routes').then(routes => {
  app.use('/api', routes.default);
}).catch(err => {
  logger.error('路由加载失败', { error: err });
});

// 错误处理中间件
app.use(errorHandler);

// 处理404路由
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.originalUrl}`
  });
});

export default app;