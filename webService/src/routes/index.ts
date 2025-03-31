import express from 'express';
import metadataRoutes from './metadata.routes';

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

export default router; 