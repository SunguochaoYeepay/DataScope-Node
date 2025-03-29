import { PrismaClient, Query, QueryHistory } from '@prisma/client';
import { ApiError } from '../utils/error';
import dataSourceService from './datasource.service';
import logger from '../utils/logger';

const prisma = new PrismaClient();

export class QueryService {
  /**
   * 执行SQL查询
   */
  async executeQuery(dataSourceId: string, sql: string, params: any[] = []): Promise<any> {
    try {
      // 获取数据源连接器
      const connector = await dataSourceService.getConnector(dataSourceId);
      
      // 记录查询开始
      const startTime = new Date();
      let queryHistoryId: string | null = null;
      
      try {
        // 创建查询历史记录
        const queryHistory = await prisma.queryHistory.create({
          data: {
            dataSourceId,
            sqlContent: sql,
            status: 'RUNNING',
            startTime,
          }
        });
        queryHistoryId = queryHistory.id;
        
        // 执行查询
        const result = await connector.executeQuery(sql, params);
        
        // 更新查询历史为成功
        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime();
        
        await prisma.queryHistory.update({
          where: { id: queryHistoryId },
          data: {
            status: 'COMPLETED',
            endTime,
            duration,
            rowCount: result.rows.length,
          }
        });
        
        return result;
      } catch (error: any) {
        // 更新查询历史为失败
        if (queryHistoryId) {
          const endTime = new Date();
          const duration = endTime.getTime() - startTime.getTime();
          
          await prisma.queryHistory.update({
            where: { id: queryHistoryId },
            data: {
              status: 'FAILED',
              endTime,
              duration,
              errorMessage: error?.message || '未知错误',
            }
          });
        }
        
        logger.error('执行查询失败', { error, dataSourceId, sql });
        if (error instanceof ApiError) {
          throw error;
        }
        throw new ApiError('执行查询失败', 500, error?.message || '未知错误');
      }
    } catch (error: any) {
      logger.error('执行查询失败', { error, dataSourceId, sql });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('执行查询失败', 500, error?.message || '未知错误');
    }
  }
  
  /**
   * 保存查询
   */
  async saveQuery(data: {
    name: string;
    dataSourceId: string;
    sql: string;
    description?: string;
    tags?: string[];
    isPublic?: boolean;
  }): Promise<Query> {
    try {
      const query = await prisma.query.create({
        data: {
          name: data.name,
          dataSourceId: data.dataSourceId,
          sqlContent: data.sql,
          description: data.description || '',
          tags: data.tags?.join(',') || '',
          status: data.isPublic ? 'PUBLISHED' : 'DRAFT',
        },
      });
      
      return query;
    } catch (error: any) {
      logger.error('保存查询失败', { error, query: data });
      throw new ApiError('保存查询失败', 500, error?.message || '未知错误');
    }
  }
  
  /**
   * 获取查询列表
   */
  async getQueries(options: {
    dataSourceId?: string;
    tag?: string;
    isPublic?: boolean;
    search?: string;
  } = {}): Promise<Query[]> {
    try {
      const where: any = {};
      
      if (options.dataSourceId) {
        where.dataSourceId = options.dataSourceId;
      }
      
      if (options.isPublic !== undefined) {
        where.status = options.isPublic ? 'PUBLISHED' : 'DRAFT';
      }
      
      if (options.tag) {
        where.tags = {
          contains: options.tag,
        };
      }
      
      if (options.search) {
        where.OR = [
          {
            name: {
              contains: options.search,
            },
          },
          {
            description: {
              contains: options.search,
            },
          },
          {
            sqlContent: {
              contains: options.search,
            },
          },
        ];
      }
      
      return await prisma.query.findMany({
        where,
        orderBy: {
          updatedAt: 'desc',
        },
      });
    } catch (error: any) {
      logger.error('获取查询列表失败', { error, options });
      throw new ApiError('获取查询列表失败', 500, error?.message || '未知错误');
    }
  }
  
  /**
   * 获取查询详情
   */
  async getQueryById(id: string): Promise<Query> {
    try {
      const query = await prisma.query.findUnique({
        where: { id },
      });
      
      if (!query) {
        throw new ApiError('查询不存在', 404);
      }
      
      return query;
    } catch (error: any) {
      logger.error('获取查询详情失败', { error, id });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('获取查询详情失败', 500, error?.message || '未知错误');
    }
  }
  
  /**
   * 更新查询
   */
  async updateQuery(
    id: string,
    data: {
      name?: string;
      sql?: string;
      description?: string;
      tags?: string[];
      isPublic?: boolean;
    }
  ): Promise<Query> {
    try {
      // 首先检查查询是否存在
      const existingQuery = await prisma.query.findUnique({
        where: { id },
      });
      
      if (!existingQuery) {
        throw new ApiError('查询不存在', 404);
      }
      
      // 准备更新数据
      const updateData: any = {};
      
      if (data.name !== undefined) updateData.name = data.name;
      if (data.sql !== undefined) updateData.sqlContent = data.sql;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.isPublic !== undefined) updateData.status = data.isPublic ? 'PUBLISHED' : 'DRAFT';
      if (data.tags !== undefined) updateData.tags = data.tags.join(',');
      
      // 更新查询
      return await prisma.query.update({
        where: { id },
        data: updateData,
      });
    } catch (error: any) {
      logger.error('更新查询失败', { error, id, data });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('更新查询失败', 500, error?.message || '未知错误');
    }
  }
  
  /**
   * 删除查询
   */
  async deleteQuery(id: string): Promise<void> {
    try {
      // 首先检查查询是否存在
      const existingQuery = await prisma.query.findUnique({
        where: { id },
      });
      
      if (!existingQuery) {
        throw new ApiError('查询不存在', 404);
      }
      
      // 删除查询
      await prisma.query.delete({
        where: { id },
      });
    } catch (error: any) {
      logger.error('删除查询失败', { error, id });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('删除查询失败', 500, error?.message || '未知错误');
    }
  }
  
  /**
   * 获取查询历史
   */
  async getQueryHistory(
    dataSourceId?: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{
    history: QueryHistory[];
    total: number;
    limit: number;
    offset: number;
  }> {
    try {
      const where = dataSourceId ? { dataSourceId } : {};
      
      const [history, total] = await Promise.all([
        prisma.queryHistory.findMany({
          where,
          orderBy: {
            createdAt: 'desc',
          },
          skip: offset,
          take: limit,
        }),
        prisma.queryHistory.count({ where }),
      ]);
      
      return {
        history,
        total,
        limit,
        offset,
      };
    } catch (error: any) {
      logger.error('获取查询历史失败', { error, dataSourceId });
      throw new ApiError('获取查询历史失败', 500, error?.message || '未知错误');
    }
  }
}

export default new QueryService();