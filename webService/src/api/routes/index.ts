import { Router } from 'express';
import dataSourceRoutes from './datasource.routes';
import queryRoutes from './query.routes';
import metadataRoutes from './metadata.routes';

const router = Router();

// API路由
router.use('/datasources', dataSourceRoutes);
router.use('/queries', queryRoutes);
router.use('/metadata', metadataRoutes);

// API文档
router.get('/', (req, res) => {
  res.redirect('/api-docs');
});

export default router;