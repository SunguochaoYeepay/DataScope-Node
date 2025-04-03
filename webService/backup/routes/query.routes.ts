/**
 * 查询路由
 */
import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middlewares/async-handler';

const router = Router();

/**
 * 测试路由
 */
router.get('/test', asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: '查询接口可用',
    timestamp: new Date().toISOString()
  });
}));

export default router;