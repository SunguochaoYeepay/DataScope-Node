/**
 * 查询版本控制相关路由
 */
import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middlewares/async-handler';
import * as queryVersionService from '../services/query.service.version';
import { ApiError } from '../utils/errors/types/api-error';

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

/**
 * 获取查询的所有版本
 * 增加额外的路由以匹配前端调用格式
 */
router.get('/query/version/management/:queryId', asyncHandler(async (req: Request, res: Response) => {
  const { queryId } = req.params;
  
  try {
    const versions = await queryVersionService.getVersions(queryId);
    
    res.status(200).json({
      success: true,
      data: versions
    });
  } catch (error: any) {
    const message = error.message || '获取查询版本失败';
    const code = error.errorCode || 10006; // 使用默认错误码
    
    res.status(error.statusCode || 404).json({
      success: false,
      error: {
        code,
        message,
        details: error.details || null
      }
    });
  }
}));

/**
 * 获取查询的所有版本 - 前端路由适配
 * 路径: /api/queries/:queryId/versions
 */
router.get('/:queryId/versions', asyncHandler(async (req: Request, res: Response) => {
  const { queryId } = req.params;
  
  try {
    const versions = await queryVersionService.getVersions(queryId);
    
    res.status(200).json({
      success: true,
      data: versions
    });
  } catch (error: any) {
    const message = error.message || '获取查询版本失败';
    const code = error.errorCode || 10006; // 使用默认错误码
    
    res.status(error.statusCode || 404).json({
      success: false,
      error: {
        code,
        message,
        details: error.details || null
      }
    });
  }
}));

/**
 * 创建查询版本 - 前端路由适配
 * 路径: /api/queries/:queryId/versions
 */
router.post('/:queryId/versions', asyncHandler(async (req: Request, res: Response) => {
  const { queryId } = req.params;
  const versionData = req.body;
  
  try {
    // 调用服务创建版本
    const newVersion = await queryVersionService.createVersion(queryId, versionData);
    
    res.status(201).json({
      success: true,
      data: newVersion,
      message: '查询版本创建成功'
    });
  } catch (error: any) {
    const message = error.message || '创建查询版本失败';
    const code = error.errorCode || 10007; // 使用默认错误码
    
    res.status(error.statusCode || 500).json({
      success: false,
      error: {
        code,
        message,
        details: error.details || null
      }
    });
  }
}));

export default router;