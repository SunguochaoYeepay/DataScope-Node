/**
 * 查询版本控制相关路由
 */
import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middlewares/async-handler';

const router = Router();

/**
 * 测试路由
 */
router.get('/query-version/test', asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: '查询版本控制接口可用',
    timestamp: new Date().toISOString()
  });
}));

export default router;