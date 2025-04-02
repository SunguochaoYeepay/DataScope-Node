/**
 * 查询收藏服务
 */
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors/app-error';
import { ErrorCode } from '../utils/errors/error-codes';
import logger from '../utils/logger';

const prisma = new PrismaClient();

/**
 * 查询收藏服务类
 */
export class QueryFavoriteService {
  /**
   * 添加查询到收藏
   * @param queryId 查询ID
   * @param userId 用户ID
   * @returns 创建的收藏记录
   */
  public async addToFavorites(queryId: string, userId: string): Promise<any> {
    try {
      // 先检查查询是否存在
      const query = await prisma.query.findUnique({
        where: { id: queryId }
      });

      if (!query) {
        throw new AppError(
          `查询不存在: ${queryId}`,
          ErrorCode.QUERY_NOT_FOUND,
          404
        );
      }

      // 检查是否已经收藏过
      const existingFavorite = await prisma.queryFavorite.findFirst({
        where: {
          queryId,
          userId
        }
      });

      if (existingFavorite) {
        return existingFavorite; // 已经收藏过了，直接返回
      }

      // 创建新收藏
      const favorite = await prisma.queryFavorite.create({
        data: {
          queryId,
          userId
        }
      });

      // 更新查询的收藏状态
      await prisma.query.update({
        where: { id: queryId },
        data: { isFavorite: true }
      });

      return favorite;
    } catch (error: any) {
      logger.error(`添加收藏失败: ${error.message}`, { error });
      throw error;
    }
  }

  /**
   * 从收藏中移除查询
   * @param queryId 查询ID
   * @param userId 用户ID
   * @returns 操作结果
   */
  public async removeFromFavorites(queryId: string, userId: string): Promise<{ success: boolean }> {
    try {
      // 删除收藏记录
      await prisma.queryFavorite.deleteMany({
        where: {
          queryId,
          userId
        }
      });

      // 检查是否还有其他用户收藏了这个查询
      const otherFavorites = await prisma.queryFavorite.findFirst({
        where: {
          queryId
        }
      });

      // 如果没有其他用户收藏，更新查询的收藏状态
      if (!otherFavorites) {
        await prisma.query.update({
          where: { id: queryId },
          data: { isFavorite: false }
        });
      }

      return { success: true };
    } catch (error: any) {
      logger.error(`移除收藏失败: ${error.message}`, { error });
      throw error;
    }
  }

  /**
   * 获取用户收藏的查询列表
   * @param userId 用户ID
   * @param page 页码
   * @param size 每页数量
   * @returns 收藏的查询列表和分页信息
   */
  public async getFavorites(userId: string, page: number = 1, size: number = 10): Promise<any> {
    try {
      const skip = (page - 1) * size;
      
      // 获取总数
      const total = await prisma.queryFavorite.count({
        where: { userId }
      });

      // 获取收藏的查询列表
      const favorites = await prisma.queryFavorite.findMany({
        where: { userId },
        include: {
          query: {
            include: {
              dataSource: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        skip,
        take: size,
        orderBy: { createdAt: 'desc' }
      });

      // 格式化返回结果
      const queries = favorites.map(f => {
        if (!f.query) return null;
        return {
          id: f.query.id,
          name: f.query.name,
          description: f.query.description,
          dataSource: f.query.dataSource,
          createdAt: f.query.createdAt,
          updatedAt: f.query.updatedAt,
          createdBy: f.query.createdBy,
          status: f.query.status,
          executionCount: f.query.executionCount,
          lastExecutedAt: f.query.lastExecutedAt,
          isFavorite: true
        };
      }).filter(q => q !== null);

      return {
        data: queries,
        pagination: {
          total,
          page,
          size,
          totalPages: Math.ceil(total / size)
        }
      };
    } catch (error: any) {
      logger.error(`获取收藏列表失败: ${error.message}`, { error });
      throw error;
    }
  }

  /**
   * 检查查询是否被收藏
   * @param queryId 查询ID
   * @param userId 用户ID
   * @returns 是否被收藏
   */
  public async isFavorite(queryId: string, userId: string): Promise<boolean> {
    try {
      const favorite = await prisma.queryFavorite.findFirst({
        where: {
          queryId,
          userId
        }
      });

      return !!favorite;
    } catch (error: any) {
      logger.error(`检查收藏状态失败: ${error.message}`, { error });
      throw error;
    }
  }
}