import { Router, Request, Response, NextFunction } from 'express';
import dataSourceRoutes from './datasource.routes';
import queryRoutes from './query.routes';
import metadataRoutes from './metadata.routes';
import examplesRoutes from './examples.routes';
import planVisualizationRoutes from './plan-visualization.routes';
import queryPlanRoutes from './query-plan.routes';
import integrationRoutes from './integration.routes';
import metadataController from '../controllers/metadata.controller';

const router = Router();

// 专门适配前端表数据预览API路由
router.get('/metadata/:dataSourceId/tables/:tableName/data', (req: Request, res: Response) => {
  console.log('匹配到前端请求路径，转发到正确的处理器');
  return metadataController.getTableData(req, res);
});

// API路由
router.use('/datasources', dataSourceRoutes);
router.use('/queries', queryRoutes);
router.use('/metadata', metadataRoutes);
router.use('/examples', examplesRoutes);
router.use('/plan-visualization', planVisualizationRoutes);
router.use('/query-plans', queryPlanRoutes);
router.use('/', integrationRoutes); // 系统集成路由

// API文档
router.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// 添加开发日志以便调试
console.log('加载API路由...');
console.log('- 已加载数据源路由: /api/datasources');
console.log('- 已加载查询路由: /api/queries');
console.log('- 已加载元数据路由: /api/metadata');
console.log('- 已加载系统集成路由: /api/v1/low-code/apis');

export default router;