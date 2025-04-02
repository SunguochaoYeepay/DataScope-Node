/**
 * 查询版本控制相关路由
 */
import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middlewares/async-handler';
import queryVersionService from '../services/query-version.service';
import { ApiError } from '../utils/errors/types/api-error';
import versionFormatMiddleware from '../middlewares/version-format';
// 导入查询服务状态类型
import { QueryServiceStatus } from '../types/query-version';
import logger from '../utils/logger';

const router = Router();

// 应用版本数据格式转换中间件
router.use(versionFormatMiddleware);

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
  
  logger.info(`获取查询版本 - 主路由: ${queryId}`, { path: req.path });
  
  try {
    // 获取查询详情以获取当前版本ID
    const query = await queryVersionService.getQueryStatus(queryId);
    
    // 将当前版本ID添加到请求中，供中间件使用
    if (query.currentVersionId) {
      req.query.currentVersionId = query.currentVersionId as string;
    }
    
    // 获取所有版本
    const versions = await queryVersionService.getVersions(queryId);
    
    // 空结果处理 - 返回空数组而不是空对象
    if (!versions || versions.length === 0) {
      logger.info(`查询 ${queryId} 没有版本历史，返回空数组`);
    } else {
      logger.info(`获取到版本数量: ${versions.length}`);
    }
    
    res.status(200).json({
      success: true,
      data: versions || []
    });
  } catch (error: any) {
    const message = error.message || '获取查询版本失败';
    const code = error.errorCode || 10006; // 使用默认错误码
    
    logger.error(`获取查询版本失败: ${message}`, { error, queryId });
    
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
 * 获取指定版本详情
 */
router.get('/query/version/:versionId', asyncHandler(async (req: Request, res: Response) => {
  const { versionId } = req.params;
  
  try {
    // 获取版本详情
    const version = await queryVersionService.getVersionById(versionId);
    
    // 获取查询以确定是否为当前版本
    const query = await queryVersionService.getQueryStatus(version.queryId);
    
    // 将当前版本ID添加到请求，供中间件使用
    if (query.currentVersionId) {
      req.query.currentVersionId = query.currentVersionId as string;
    }
    
    res.status(200).json({
      success: true,
      data: version
    });
  } catch (error: any) {
    const message = error.message || '获取版本详情失败';
    const code = error.errorCode || 10006;
    
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
 * 激活指定版本
 */
router.put('/query/version/activate/:versionId', asyncHandler(async (req: Request, res: Response) => {
  const { versionId } = req.params;
  
  logger.info(`开始激活版本: ${versionId}`, { path: req.path, params: req.params });
  
  try {
    // 记录版本详情
    const versionDetails = await queryVersionService.getVersionById(versionId);
    logger.info(`激活版本详情:`, { 
      versionId, 
      queryId: versionDetails.queryId,
      versionNumber: versionDetails.versionNumber,
      status: versionDetails.versionStatus
    });
    
    // 激活版本
    const updatedQuery = await queryVersionService.activateVersion(versionId);
    logger.info(`激活版本成功:`, { 
      versionId,
      queryId: updatedQuery.id,
      currentVersionId: updatedQuery.currentVersionId
    });
    
    // 注意！在响应前设置当前版本ID，以便中间件正确识别活跃版本
    if (updatedQuery.currentVersionId) {
      req.query.currentVersionId = updatedQuery.currentVersionId as string;
    }
    
    res.status(200).json({
      success: true,
      message: '已成功将版本设为活跃版本',
      data: updatedQuery
    });
  } catch (error: any) {
    const message = error.message || '激活版本失败';
    const code = error.errorCode || 10006;
    
    logger.error(`激活版本失败: ${message}`, { error, versionId });
    
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