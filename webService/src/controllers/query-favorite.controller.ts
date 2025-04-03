/**
 * 查询收藏控制器
 */
import { Request, Response } from 'express';
import { QueryFavoriteServiceMock } from '../services/query-favorite.service.mock';
import { asyncHandler } from '../middlewares/async-handler';
import logger from '../utils/logger';

// 使用模拟服务进行开发和测试
const favoriteService = new QueryFavoriteServiceMock();

/**
 * 查询收藏控制器类
 */
export class QueryFavoriteController {
  /**
   * 获取用户收藏的查询列表
   */
  public static getFavorites = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.id || 'anonymous';
    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 10;

    logger.info(`获取用户 ${userId} 的收藏查询列表`);
    const favorites = await favoriteService.getFavorites(userId, page, size);

    res.status(200).json({
      success: true,
      ...favorites,
      message: "获取收藏列表成功"
    });
  });

  /**
   * 添加查询到收藏
   */
  public static addToFavorites = asyncHandler(async (req: Request, res: Response) => {
    const { queryId } = req.params;
    const userId = (req as any).user?.id || 'anonymous';

    logger.info(`用户 ${userId} 收藏查询 ${queryId}`);
    const favorite = await favoriteService.addToFavorites(queryId, userId);

    res.status(200).json({
      success: true,
      data: favorite,
      message: "添加收藏成功"
    });
  });

  /**
   * 从收藏中移除查询
   */
  public static removeFromFavorites = asyncHandler(async (req: Request, res: Response) => {
    const { queryId } = req.params;
    const userId = (req as any).user?.id || 'anonymous';

    logger.info(`用户 ${userId} 取消收藏查询 ${queryId}`);
    const result = await favoriteService.removeFromFavorites(queryId, userId);

    res.status(200).json({
      success: true,
      data: result,
      message: "移除收藏成功"
    });
  });

  /**
   * 检查查询是否被收藏
   */
  public static checkFavoriteStatus = asyncHandler(async (req: Request, res: Response) => {
    const { queryId } = req.params;
    const userId = (req as any).user?.id || 'anonymous';

    logger.info(`检查用户 ${userId} 是否收藏了查询 ${queryId}`);
    const isFavorite = await favoriteService.isFavorite(queryId, userId);

    res.status(200).json({
      success: true,
      data: { isFavorite },
      message: "获取收藏状态成功"
    });
  });
}