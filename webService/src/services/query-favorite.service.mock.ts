/**
 * 查询收藏服务模拟实现
 * 用于测试API接口而无需连接数据库
 */
import { MockQueries, MockFavorites } from './mock/query.mock';
import logger from '../utils/logger';

/**
 * 查询收藏服务模拟类
 */
export class QueryFavoriteServiceMock {
  private favorites = [...MockFavorites];
  private queries = [...MockQueries];

  /**
   * 添加查询到收藏
   * @param queryId 查询ID
   * @param userId 用户ID
   * @returns 创建的收藏记录
   */
  public async addToFavorites(queryId: string, userId: string): Promise<any> {
    try {
      // 检查查询是否存在
      const query = this.queries.find(q => q.id === queryId);
      if (!query) {
        throw new Error(`查询不存在: ${queryId}`);
      }

      // 检查是否已经收藏过
      const existingFavorite = this.favorites.find(
        f => f.queryId === queryId && f.userId === userId
      );

      if (existingFavorite) {
        return existingFavorite; // 已经收藏过了，直接返回
      }

      // 创建新收藏
      const newFavorite = {
        id: `fav-${Date.now()}`,
        queryId,
        userId,
        createdAt: new Date().toISOString()
      };

      this.favorites.push(newFavorite);

      // 更新查询的收藏状态
      const queryIndex = this.queries.findIndex(q => q.id === queryId);
      if (queryIndex >= 0) {
        this.queries[queryIndex].isFavorite = true;
      }

      return newFavorite;
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
      this.favorites = this.favorites.filter(
        f => !(f.queryId === queryId && f.userId === userId)
      );

      // 检查是否还有其他用户收藏了这个查询
      const otherFavorites = this.favorites.find(f => f.queryId === queryId);

      // 如果没有其他用户收藏，更新查询的收藏状态
      if (!otherFavorites) {
        const queryIndex = this.queries.findIndex(q => q.id === queryId);
        if (queryIndex >= 0) {
          this.queries[queryIndex].isFavorite = false;
        }
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
      const userFavorites = this.favorites.filter(f => f.userId === userId);
      const total = userFavorites.length;

      // 获取收藏的查询列表（带分页）
      const paginatedFavorites = userFavorites.slice(skip, skip + size);

      // 格式化返回结果
      const queries = paginatedFavorites.map(f => {
        const query = this.queries.find(q => q.id === f.queryId);
        if (!query) return null;
        
        return {
          id: query.id,
          name: query.name,
          description: query.description,
          dataSource: { id: query.dataSourceId, name: '模拟数据源' },
          createdAt: query.createdAt,
          updatedAt: query.updatedAt,
          createdBy: query.createdBy,
          status: query.status,
          executionCount: query.executionCount,
          lastExecutedAt: query.lastExecutedAt,
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
      const favorite = this.favorites.find(
        f => f.queryId === queryId && f.userId === userId
      );

      return !!favorite;
    } catch (error: any) {
      logger.error(`检查收藏状态失败: ${error.message}`, { error });
      throw error;
    }
  }
}