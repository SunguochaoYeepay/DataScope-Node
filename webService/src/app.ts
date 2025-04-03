/**
 * 应用入口文件
 */
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import 'express-async-errors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import config from './config';
import logger from './utils/logger';
import apiRoutes from './api/routes';
import { DataSourceService } from './services/datasource.service';
import { DataSourceMonitorService } from './services/datasource-monitor.service';
import metadataController from './api/controllers/metadata.controller';
import visualizationRouter from './api/routes/visualization.routes';
import queryPlanRouter from './api/routes/query-plan.routes';
import planVisualizationRouter from './api/routes/plan-visualization.routes';
import mockPlanRouter from './api/routes/mock-plan.routes';
import { registerDirectRoutes } from './api/direct-routes';
import dataSourcesMockRoutes from './api/routes/data-sources.mock';
// 导入queryRoutes
import { dataSourceRoutes, queryRoutes } from './routes';

// 初始化服务
const dataSourceService = new DataSourceService();
const dataSourceMonitorService = new DataSourceMonitorService(dataSourceService);

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
        url: '/',
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
const swaggerSpec = swaggerJSDoc(swaggerOptions);

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

// 检查是否使用模拟数据
const useMockData = process.env.USE_MOCK_DATA === 'true';

// 在启动时明确记录使用模式
console.log('==============================================');
console.log(`DataScope API服务启动`);
console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
console.log(`模式: ${useMockData ? '模拟数据 (USE_MOCK_DATA=true)' : '真实数据库连接'}`);
if (useMockData) {
  console.log('警告: 当前使用模拟数据模式，不会连接真实数据库');
  console.log('      数据源列表将来自模拟数据，不代表实际数据库连接');
} else {
  console.log('提示: 当前使用真实数据库连接模式');
  console.log(`      连接地址: ${process.env.DATABASE_URL || '未指定'}`);
}
console.log('==============================================');

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
    status: 'UP'
  });
});

// 专门处理前端表数据预览请求的路由
app.get('/api/metadata/:dataSourceId/tables/:tableName/data', (req: Request, res: Response) => {
  console.log('app.ts - 匹配到前端请求路径，转发到正确的处理器');
  return metadataController.getTableData(req, res);
});

// 注册数据源模拟路由（确保数据源功能正常工作）- 将模拟路由移动到API路由前面，确保优先级
if (useMockData) {
  app.use('/api/datasources', dataSourcesMockRoutes); // 使用标准路径
  console.log('主应用：数据源模拟路由已加载：/api/datasources');
} else {
  console.log('主应用：使用真实数据库连接，未加载模拟路由');
}

// 注册额外的开发测试路由
app.use('/api/mock-plan', mockPlanRouter);

// 注释掉已移除的查询版本路由
// app.use('/api', queryVersionRoutes);
// app.use('', queryVersionRoutes); // 使root路径也能访问
// console.log('主应用：查询版本路由已加载：/api 和 根路径');

// 注册API路由
app.use('/api', apiRoutes);

// 注释掉重复注册的路由
// app.use('/api', dataSourceRoutes);
// app.use('/api', queryRoutes);

// 注册直接路由(用于测试)
registerDirectRoutes(app);

// 错误处理中间件
app.use(errorHandler);

// 处理404路由
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.originalUrl}`
  });
});

// 启动数据源监控服务
dataSourceMonitorService.start();
logger.info('数据源监控服务已启动');

// 导出Express应用
export { app };
export default app;