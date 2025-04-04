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

// 路由注册的正确方式：
// 1. 在子路由模块中使用相对路径（不包含API前缀）
// 2. 在这里注册时添加完整前缀
// 3. 避免路由路径重复定义

// Data source routes - /api/datasources/*
router.use('/datasources', dataSourceRoutes);
logger.info('Loaded data source routes');

// Query routes - /api/queries/*
router.use('/queries', queryRoutes);
logger.info('Loaded query routes');

// 查询版本路由 - /api/queries/versions/*
router.use('/queries/versions', queryVersionRoutes);
logger.info('Loaded query version routes');

// Metadata routes - /api/metadata/*
router.use('/metadata', metadataRoutes);
logger.info('Loaded metadata routes');

// Integration APIs - /api/low-code/apis/*
router.use('/low-code/apis', integrationRoutes);
logger.info('Loaded integration routes');

// API文档
router.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// 添加开发日志以便调试
console.log('加载API路由...');
console.log('- 已加载数据源路由: /api/datasources');
console.log('- 已加载查询路由: /api/queries');
console.log('- 已加载查询版本路由: 直接注册到 /api/queries/versions');
console.log('- 已加载元数据路由: /api/metadata');
console.log('- 已加载系统集成路由: /api/low-code/apis');

export default router;