import { Router } from 'express';
import dataSourceRoutes from './datasource.routes';
import queryRoutes from './query.routes';
import metadataRoutes from './metadata.routes';
import examplesRoutes from './examples.routes';
import planVisualizationRoutes from './plan-visualization.routes';
import queryPlanRoutes from './query-plan.routes';

const router = Router();

// API路由
router.use('/datasources', dataSourceRoutes);
router.use('/queries', queryRoutes);
router.use('/metadata', metadataRoutes);
router.use('/examples', examplesRoutes);
router.use('/plan-visualization', planVisualizationRoutes);
router.use('/query-plans', queryPlanRoutes);

// API文档
router.get('/', (req, res) => {
  res.redirect('/api-docs');
});

export default router;