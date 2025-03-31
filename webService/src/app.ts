import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import 'express-async-errors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import config from './config';
import logger from './utils/logger';
import apiRoutes from './api/routes';

// Swagger配置选项
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DataScope API',
      version: '1.0.0',
      description: 'DataScope Node API文档',
      contact: {
        name: 'DataScope Team'
      }
    },
    servers: [
      {
        url: '/api',
        description: 'API服务端点'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/api/routes/*.ts', './src/api/controllers/*.ts', './src/types/*.ts']
};

// 生成Swagger规范
const swaggerSpec = swaggerJsDoc(swaggerOptions);

// 日志中间件，记录每个请求
const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`, {
    body: req.body,
    query: req.query,
    params: req.params
  });
  next();
};

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
app.use(requestLogger);

// 设置Swagger文档路由
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Swagger JSON端点
app.get('/api-docs.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// 健康检查路由
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'DataScope API',
    version: '1.0.5'  // 硬编码版本号
  });
});

// 使用API路由
app.use('/api', apiRoutes);

// 错误处理中间件
app.use(errorHandler);

// 处理404路由
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.originalUrl}`
  });
});

// 确保使用5000端口
const PORT = 5000;
app.listen(PORT, () => {
  logger.info(`服务器已启动，监听端口: ${PORT}`);
  logger.info(`API文档地址: http://localhost:${PORT}/api-docs`);
});