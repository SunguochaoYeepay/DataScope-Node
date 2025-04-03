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

/**
 * 调试路由
 */
router.get('/debug/count', asyncHandler(async (req: Request, res: Response) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    // 计算总记录数
    const total = await prisma.query.count();
    
    // 查询前10条记录
    const queries = await prisma.query.findMany({
      take: 10
    });
    
    // 构建调试信息
    const debugInfo = {
      totalCount: total,
      sampleQueries: queries.map((q: any) => ({
        id: q.id,
        name: q.name,
        status: q.status,
        serviceStatus: q.serviceStatus,
        dataSourceId: q.dataSourceId,
        createdAt: q.createdAt,
        updatedAt: q.updatedAt
      }))
    };
    
    res.status(200).json({
      success: true,
      message: `数据库中共有${total}条查询记录`,
      data: debugInfo
    });
  } catch (error: any) {
    console.error('调试查询记录失败:', error);
    res.status(500).json({
      success: false,
      message: '调试查询记录失败: ' + (error.message || '未知错误')
    });
  }
}));

export default router;