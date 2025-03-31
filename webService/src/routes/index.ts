import express from 'express';
import metadataRoutes from './metadata.routes';
import datasourceRoutes from '../api/routes/datasource.routes';
import queryRoutes from '../api/routes/query.routes';

const router = express.Router();

/** 健康检查路由 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'DataScope API'
  });
});

// 元数据路由
router.use('/metadata', metadataRoutes);

// 数据源路由
router.use('/datasources', datasourceRoutes);

// 查询路由
router.use('/queries', queryRoutes);

export default router; 