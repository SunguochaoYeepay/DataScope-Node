/**
 * 查询版本控制相关路由
 */
import express, { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/async-handler';
import * as queryVersionService from '../services/query.service.version';
import logger from '../utils/logger';

const router = express.Router();

/**
 * 测试路由
 */
router.get('/test', (req: Request, res: Response) => {
  logger.info('测试查询版本路由');
  return res.json({ success: true, message: '查询版本路由工作正常' });
});

/**
 * 获取单个版本详情
 * 路径: /api/queries/versions/:versionId
 */
router.get('/:versionId', asyncHandler(async (req: Request, res: Response) => {
  const { versionId } = req.params;
  logger.info(`获取单个版本详情，版本ID: ${versionId}`);
  
  try {
    const version = await queryVersionService.getVersionById(versionId);
    return res.json({ success: true, data: version });
  } catch (error) {
    logger.error(`获取版本详情失败，版本ID: ${versionId}`, error);
    throw error;
  }
}));

/**
 * 根据查询ID获取所有版本 - 分页版本
 * 路径: /api/queries/:queryId/versions
 * 注意: 这个路由会在api/routes/index.ts中被映射为/api/queries/:queryId/versions
 */
router.get('/query/:queryId/list', asyncHandler(async (req: Request, res: Response) => {
  const { queryId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const size = parseInt(req.query.size as string) || 50;
  
  logger.info(`根据查询ID获取版本列表，查询ID: ${queryId}，page: ${page}, size: ${size}`);
  
  try {
    const versions = await queryVersionService.getVersionsPaginated(queryId, { page, size });
    return res.json({ success: true, data: versions });
  } catch (error) {
    logger.error(`获取查询版本列表失败，查询ID: ${queryId}`, error);
    throw error;
  }
}));

/**
 * 获取查询的所有版本-管理视图
 * 路径: /api/queries/versions/management/:queryId
 */
router.get('/management/:queryId', asyncHandler(async (req: Request, res: Response) => {
  const { queryId } = req.params;
  logger.info(`获取查询版本管理视图，查询ID: ${queryId}`);
  
  try {
    const versions = await queryVersionService.getVersions(queryId);
    return res.json({ success: true, data: versions });
  } catch (error) {
    logger.error(`获取查询版本管理视图失败，查询ID: ${queryId}`, error);
    throw error;
  }
}));

/**
 * 发布查询版本(管理视图)
 * 路径: /api/queries/versions/management/:queryId/publish/:versionId
 */
router.post('/management/:queryId/publish/:versionId', asyncHandler(async (req: Request, res: Response) => {
  const { queryId, versionId } = req.params;
  
  logger.info(`管理视图-发布查询版本，查询ID: ${queryId}, 版本ID: ${versionId}`);
  
  try {
    const publishedVersion = await queryVersionService.publishVersion(versionId);
    return res.json({ success: true, data: publishedVersion });
  } catch (error) {
    logger.error(`管理视图-发布版本失败，查询ID: ${queryId}, 版本ID: ${versionId}`, error);
    throw error;
  }
}));

/**
 * 废弃查询版本(管理视图)
 * 路径: /api/queries/versions/management/:queryId/deprecate/:versionId
 */
router.post('/management/:queryId/deprecate/:versionId', asyncHandler(async (req: Request, res: Response) => {
  const { queryId, versionId } = req.params;
  
  logger.info(`管理视图-废弃查询版本，查询ID: ${queryId}, 版本ID: ${versionId}`);
  
  try {
    // 目前没有实现废弃功能，返回成功状态
    // TODO: 实现版本废弃功能
    return res.json({ success: true, message: '版本已废弃' });
  } catch (error) {
    logger.error(`管理视图-废弃版本失败，查询ID: ${queryId}, 版本ID: ${versionId}`, error);
    throw error;
  }
}));

/**
 * 获取查询的所有版本
 * 路径: /api/queries/versions/query/:queryId
 */
router.get('/query/:queryId', asyncHandler(async (req: Request, res: Response) => {
  const { queryId } = req.params;
  logger.info(`获取查询版本，查询ID: ${queryId}`);
  
  const versions = await queryVersionService.getVersions(queryId);
  return res.json({ success: true, data: versions });
}));

/**
 * 创建查询版本
 * 路径: /api/queries/:queryId/versions
 * 注意：此路由会在query.routes.ts中定义，指向为queryVersionRouter
 */

/**
 * 创建查询版本 - 旧路径兼容
 * 路径: /api/queries/versions/query/:queryId
 */
router.post('/query/:queryId', asyncHandler(async (req: Request, res: Response) => {
  const { queryId } = req.params;
  const versionData = req.body;
  
  logger.info(`创建查询版本，查询ID: ${queryId}`, { body: JSON.stringify(versionData) });
  
  const newVersion = await queryVersionService.createVersion(queryId, versionData);
  return res.json({ success: true, data: newVersion });
}));

/**
 * 发布查询版本
 * 路径: /api/queries/versions/:versionId/publish
 */
router.post('/:versionId/publish', asyncHandler(async (req: Request, res: Response) => {
  const { versionId } = req.params;
  
  logger.info(`发布查询版本，版本ID: ${versionId}`, { 
    params: req.params,
    body: req.body,
    url: req.originalUrl
  });
  
  try {
    const publishedVersion = await queryVersionService.publishVersion(versionId);
    logger.info(`版本发布成功，版本ID: ${versionId}`);
    return res.json({ success: true, data: publishedVersion });
  } catch (error) {
    logger.error(`版本发布失败，版本ID: ${versionId}`, error);
    throw error;
  }
}));

/**
 * 激活查询版本
 * 路径: /api/queries/versions/:versionId/activate
 */
router.post('/:versionId/activate', asyncHandler(async (req: Request, res: Response) => {
  const { versionId } = req.params;
  
  logger.info(`激活查询版本，版本ID: ${versionId}`, { 
    params: req.params,
    body: req.body,
    url: req.originalUrl
  });
  
  try {
    const activatedVersion = await queryVersionService.activateVersion(versionId);
    logger.info(`版本激活成功，版本ID: ${versionId}`);
    return res.json({ success: true, data: activatedVersion });
  } catch (error) {
    logger.error(`版本激活失败，版本ID: ${versionId}`, error);
    throw error;
  }
}));

export default router;