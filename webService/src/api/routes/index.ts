import { Router, Request, Response, NextFunction } from 'express';
import dataSourceRouter from './datasource.routes';
import queryRouter from './query.routes';
import metadataRouter from './metadata.routes';
import planVisualizationRouter from './plan-visualization.routes';
import queryPlanRouter from './query-plan.routes';
import examplesRouter from './examples.routes';
import metadataController from '../controllers/metadata.controller';

const router = Router();

// 专门适配前端表数据预览API路由
router.get('/metadata/:dataSourceId/tables/:tableName/data', (req: Request, res: Response) => {
  console.log('匹配到前端请求路径，转发到正确的处理器');
  return metadataController.getTableData(req, res);
});

// Placeholder route
router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'DataScope API Root',
    endpoints: [
      '/api/datasources',
      '/api/queries',
      '/api/metadata',
      '/api/plan-visualization',
      '/api/query-plans',
      '/api/examples',
    ]
  });
});

// Register routes
router.use('/datasources', dataSourceRouter);
router.use('/queries', queryRouter);
router.use('/metadata', metadataRouter);
router.use('/plan-visualization', planVisualizationRouter);
router.use('/query-plans', queryPlanRouter);
router.use('/examples', examplesRouter);

// API文档
router.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// 添加开发日志以便调试
console.log('加载API路由...');
console.log('- 已加载数据源路由: /api/datasources');
console.log('- 已加载查询路由: /api/queries');
console.log('- 已加载元数据路由: /api/metadata');

export default router;