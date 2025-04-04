import { Router } from 'express';
import dataSourceRoutes from './datasource.routes';
import queryRoutes from './query.routes';
import metadataRoutes from './metadata.routes';
import integrationRoutes from './integration.routes';
import metadataController from '../controllers/metadata.controller';
import logger from '../../utils/logger';
import queryVersionRoutes from '../../routes/query-version.routes';
import queryController from '../controllers/query.controller';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();

// 专门适配前端表数据预览API路由
router.get('/metadata/:dataSourceId/tables/:tableName/data', (req, res) => {
  console.log('匹配到前端请求路径，转发到正确的处理器');
  return metadataController.getTableData(req, res);
});

// Placeholder route to show available endpoints
router.get('/', (req, res) => {
  return res.json({
    message: 'DataScope API',
    endpoints: [
      '/api/data-sources',
      '/api/queries',
      '/api/metadata',
      '/api/low-code/apis'
    ]
  });
});

// Register routes
logger.info('Loading API routes...');

// Data source routes - /api/datasources/*
router.use('/datasources', dataSourceRoutes);
logger.info('Loaded data source routes');

// Query routes - /api/queries/*
router.use('/queries', queryRoutes);
logger.info('Loaded query routes');

// 直接注册查询版本路由 - 支持直接访问
router.use('/', queryVersionRoutes);
logger.info('Loaded query version routes directly');

// 添加全局错误处理中间件，捕获路由中的错误并记录详细信息
const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error('API错误:', {
    path: req.path,
    method: req.method,
    params: req.params,
    query: req.query,
    error: err.message,
    stack: err.stack
  });
  next(err);
};

router.use(errorLogger);

// 原始路由方式未能处理特殊字符的queryId，添加特殊处理
router.put('/queries/:id', async (req: Request, res: Response) => {
  try {
    // 记录接收到的请求信息
    console.log(`接收到PUT请求，路径: /queries/${req.params.id}`, {
      params: req.params,
      query: req.query,
      headers: req.headers,
      bodyKeys: Object.keys(req.body || {})
    });
    
    // 处理缺少前缀的问题
    const id = req.params.id;
    const isUUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id);
    const malformedUUID = /^[a-f0-9]{7,8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id);
    
    let actualId = id;
    if (!isUUID && id.length > 30) {
      // 可能是缺少了"a"前缀
      actualId = `a${id}`;
      console.log(`疑似缺少前缀的ID，添加'a'前缀: ${actualId}`);
    } else if (malformedUUID) {
      console.log(`疑似格式不标准的UUID: ${id}`);
    }
    
    console.log(`处理后的ID: ${actualId}`);
    
    // 尝试直接从数据库查询以验证ID
    const db = new PrismaClient();
    
    try {
      // 先尝试使用处理后的ID查询
      let query = await db.query.findUnique({ where: { id: actualId } });
      
      if (!query && actualId !== id) {
        // 如果处理后的ID查不到，尝试使用原始ID
        query = await db.query.findUnique({ where: { id } });
        if (query) {
          actualId = id;
          console.log(`使用原始ID查询成功: ${id}`);
        }
      }
      
      if (query) {
        console.log(`在数据库中找到查询记录:`, {
          id: query.id,
          name: query.name,
          dataSourceId: query.dataSourceId
        });
      } else {
        console.log(`在数据库中未找到查询记录，ID: ${actualId} 和 ${id}`);
      }
    } catch (dbError) {
      console.error('数据库查询出错:', dbError);
    } finally {
      await db.$disconnect();
    }
    
    // 使用正确的ID调用controller
    req.params.id = actualId;
    return queryController.updateQuery(req, res);
  } catch (error: unknown) {
    const err = error as Error;
    console.error('处理PUT请求时出错:', err);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误，请查看日志获取详情',
      error: err.message
    });
  }
});

// 单独处理查询更新接口路由 - POST请求
router.post('/queries/:id', async (req: Request, res: Response) => {
  try {
    // 记录接收到的请求信息
    console.log(`接收到POST请求，路径: /queries/${req.params.id}`, {
      params: req.params,
      query: req.query,
      headers: req.headers,
      bodyKeys: Object.keys(req.body || {})
    });
    
    // 处理缺少前缀的问题
    const id = req.params.id;
    const isUUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id);
    
    let actualId = id;
    if (!isUUID && id.length > 30) {
      // 可能是缺少了"a"前缀
      actualId = `a${id}`;
      console.log(`疑似缺少前缀的ID，添加'a'前缀: ${actualId}`);
    }
    
    console.log(`处理后的ID: ${actualId}`);
    
    // 使用queryController处理请求
    req.params.id = actualId;
    return queryController.updateQuery(req, res);
  } catch (error: unknown) {
    const err = error as Error;
    console.error('处理POST请求时出错:', err);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误，请查看日志获取详情',
      error: err.message
    });
  }
});

// Metadata routes - /api/metadata/*
router.use('/metadata', metadataRoutes);
logger.info('Loaded metadata routes');

// 修复集成路由注册方式 - 直接注册路由，而不是以/low-code/apis为前缀
router.use('/', integrationRoutes);
logger.info('Loaded integration routes directly');

// API文档
router.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// 添加开发日志以便调试
console.log('加载API路由...');
console.log('- 已加载数据源路由: /api/datasources');
console.log('- 已加载查询路由: /api/queries');
console.log('- 已加载查询版本路由: 直接注册到 /api');
console.log('- 已加载元数据路由: /api/metadata');
console.log('- 已加载系统集成路由: 直接注册，包括 /api/low-code/apis');

export default router; 