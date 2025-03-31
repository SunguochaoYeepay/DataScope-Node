import { PrismaClient, Query, QueryHistory, QueryPlanHistory, Prisma } from '@prisma/client';
import { ApiError } from '../utils/error';
import dataSourceService from './datasource.service';
import logger from '../utils/logger';
import { QueryPlanService } from '../database-core/query-plan/query-plan-service';
import config from '../config';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export class QueryService {
  /**
   * 执行SQL查询
   */
  async executeQuery(dataSourceId: string, sql: string, params: any[] = [], options?: {
    page?: number;
    pageSize?: number;
    offset?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
  }): Promise<any> {
    try {
      logger.info('开始执行查询', { dataSourceId, sql, params });
      
      // 获取数据源连接器
      logger.debug('尝试获取数据源连接器');
      const connector = await dataSourceService.getConnector(dataSourceId);
      logger.debug('成功获取数据源连接器', { dataSourceId, connectorType: connector.constructor.name });
      
      // 检查是否为特殊命令
      const isSpecialCommand = this.isSpecialCommand(sql);
      logger.debug(`SQL命令类型: "${sql}" -> ${isSpecialCommand ? '特殊命令' : '普通查询'}`);
      
      // 特殊命令处理：不应用分页和排序
      let queryOptionsToUse = options;
      if (isSpecialCommand) {
        logger.debug('特殊命令不使用分页和排序选项');
        queryOptionsToUse = {}; // 特殊命令不应用任何选项
      } else {
        logger.debug('普通查询使用原始查询选项', options);
      }
      
      // 记录查询开始
      const startTime = new Date();
      let queryHistoryId: string | null = null;
      
      try {
        // 创建查询历史记录
        logger.debug('创建查询历史记录');
        const queryHistory = await prisma.queryHistory.create({
          data: {
            dataSourceId,
            sqlContent: sql,
            status: 'RUNNING',
            startTime,
          }
        });
        queryHistoryId = queryHistory.id;
        logger.debug('查询历史记录已创建', { queryHistoryId });
        
        // 执行查询 - 传递queryHistoryId作为queryId以支持取消功能
        logger.debug('开始执行数据库查询', { 
          sql, 
          params, 
          queryId: queryHistoryId, 
          options: queryOptionsToUse 
        });
        
        const result = await connector.executeQuery(sql, params, queryHistoryId, queryOptionsToUse);
        logger.debug('数据库查询执行成功', { rowCount: result.rows.length });
        
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
        logger.debug('查询历史记录已更新为完成状态');
        
        return result;
      } catch (error: any) {
        // 详细记录错误信息
        logger.error('执行数据库查询失败', { 
          error: error?.message || '未知错误',
          stack: error?.stack,
          sql,
          params,
          dataSourceId,
          queryHistoryId
        });
        
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
          logger.debug('查询历史记录已更新为失败状态', { queryHistoryId });
        }
        
        if (error instanceof ApiError) {
          throw error;
        }
        throw new ApiError('执行查询失败', 500, error?.message || '未知错误');
      }
    } catch (error: any) {
      // 详细记录服务层错误
      logger.error('查询服务执行查询失败', { 
        error: error?.message || '未知错误',
        stack: error?.stack,
        dataSourceId,
        sql
      });
      
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('执行查询失败', 500, error?.message || '未知错误');
    }
  }

  /**
   * 检查SQL是否为特殊命令（如SHOW, DESCRIBE等），这些命令不支持LIMIT子句
   */
  private isSpecialCommand(sql: string): boolean {
    if (!sql) return false;
    const trimmedSql = sql.trim().toLowerCase();
    return (
      trimmedSql.startsWith('show ') || 
      trimmedSql.startsWith('describe ') || 
      trimmedSql.startsWith('desc ') ||
      trimmedSql === 'show databases;' ||
      trimmedSql === 'show tables;' ||
      trimmedSql === 'show databases' ||
      trimmedSql === 'show tables' ||
      trimmedSql.startsWith('show columns ') ||
      trimmedSql.startsWith('show index ') ||
      trimmedSql.startsWith('show create ') ||
      trimmedSql.startsWith('show grants ') ||
      trimmedSql.startsWith('show triggers ') ||
      trimmedSql.startsWith('show procedure ') ||
      trimmedSql.startsWith('show function ') ||
      trimmedSql.startsWith('show variables ') ||
      trimmedSql.startsWith('show status ') ||
      trimmedSql.startsWith('show engine ') ||
      trimmedSql.startsWith('set ') ||
      trimmedSql.startsWith('use ')
    );
  }

  /**
   * 获取查询执行计划
   */
  async explainQuery(dataSourceId: string, sql: string, params: any[] = []): Promise<any> {
    try {
      // 获取数据源连接器和数据源信息
      const connector = await dataSourceService.getConnector(dataSourceId);
      const dataSource = await dataSourceService.getDataSourceById(dataSourceId);
      
      if (!dataSource) {
        throw new ApiError('数据源不存在', 404);
      }
      
      // 实例化查询计划服务
      const queryPlanService = new QueryPlanService();
      
      // 利用查询计划服务获取并增强执行计划
      const plan = await queryPlanService.getQueryPlan(
        connector, 
        dataSource.type as any, 
        sql, 
        params
      );
      
      // 记录查询计划到历史记录
      await this.saveQueryPlanToHistory(dataSourceId, sql, plan);
      
      return plan;
    } catch (error: any) {
      logger.error('获取查询执行计划失败', { error, dataSourceId, sql });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('获取查询执行计划失败', 500, error?.message || '未知错误');
    }
  }
  
  /**
   * 保存查询计划到历史记录
   * @param dataSourceId 数据源ID
   * @param sql SQL查询语句
   * @param plan 执行计划
   */
  private async saveQueryPlanToHistory(dataSourceId: string, sql: string, plan: any): Promise<void> {
    try {
      // 将执行计划转为JSON字符串
      const planJson = JSON.stringify(plan);
      
      // 创建记录
      await prisma.queryPlanHistory.create({
        data: {
          dataSourceId,
          sql,
          planData: planJson,
          createdAt: new Date()
        }
      });
      
      logger.info('查询计划已保存到历史记录', { dataSourceId, sql });
    } catch (error) {
      // 仅记录日志，不抛出异常，确保主流程不受影响
      logger.error('保存查询计划到历史记录失败', { error, dataSourceId, sql });
    }
  }
  
  /**
   * 获取查询计划历史记录
   * @param id 查询计划ID
   * @returns 查询计划历史记录
   */
  async getQueryPlanById(id: string): Promise<any | null> {
    try {
      return await prisma.queryPlanHistory.findUnique({
        where: { id }
      });
    } catch (error) {
      logger.error('获取查询计划历史记录失败', { error, id });
      return null;
    }
  }
  
  /**
   * 获取查询计划历史记录列表
   * @param dataSourceId 数据源ID
   * @param limit 每页数量
   * @param offset 偏移量
   * @returns 查询计划历史记录列表
   */
  async getQueryPlanHistory(
    dataSourceId?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{
    history: any[];
    total: number;
    limit: number;
    offset: number;
  }> {
    try {
      const where = dataSourceId ? { dataSourceId } : {};
      
      const [history, total] = await Promise.all([
        prisma.queryPlanHistory.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: limit
        }),
        prisma.queryPlanHistory.count({ where })
      ]);
      
      return {
        history,
        total,
        limit,
        offset
      };
    } catch (error) {
      logger.error('获取查询计划历史记录列表失败', { error, dataSourceId });
      throw new ApiError('获取查询计划历史记录列表失败', 500);
    }
  }
  
  /**
   * 取消正在执行的查询
   */
  async cancelQuery(queryId: string): Promise<boolean> {
    try {
      // 首先查找查询执行记录
      const queryExecution = await prisma.queryHistory.findUnique({
        where: { id: queryId }
      });
      
      if (!queryExecution) {
        throw new ApiError('查询不存在', 404);
      }
      
      if (queryExecution.status !== 'RUNNING') {
        logger.warn('无法取消查询，查询未在运行中', { 
          queryId, 
          status: queryExecution.status 
        });
        return false;
      }
      
      // 获取数据源连接器
      const connector = await dataSourceService.getConnector(queryExecution.dataSourceId);
      
      // 检查是否支持取消查询
      if (!connector.cancelQuery) {
        throw new ApiError('该数据源不支持取消查询操作', 400);
      }
      
      // 执行取消操作
      await connector.cancelQuery(queryId);
      
      // 更新查询历史记录为取消状态
      await prisma.queryHistory.update({
        where: { id: queryId },
        data: {
          status: 'CANCELLED',
          endTime: new Date()
        }
      });
      
      return true;
    } catch (error: any) {
      logger.error('取消查询失败', { error, queryId });
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError('取消查询失败', 500, error.message);
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
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      
      return query;
    } catch (error: any) {
      logger.error('保存查询失败', { error, data });
      throw new ApiError('保存查询失败', 500, error.message);
    }
  }
  
  /**
   * 获取已保存的查询列表
   */
  async getQueries(options: {
    dataSourceId?: string;
    tag?: string;
    isPublic?: boolean;
    search?: string;
  } = {}): Promise<Query[]> {
    try {
      // 构建查询条件
      const where: any = {};
      
      // 添加数据源过滤
      if (options.dataSourceId) {
        where.dataSourceId = options.dataSourceId;
      }
      
      // 添加公开状态过滤
      if (options.isPublic !== undefined) {
        where.status = options.isPublic ? 'PUBLISHED' : 'DRAFT';
      }
      
      // 添加标签过滤
      if (options.tag) {
        where.tags = {
          contains: options.tag
        };
      }
      
      // 添加搜索条件
      if (options.search) {
        where.OR = [
          { name: { contains: options.search } },
          { description: { contains: options.search } },
          { sqlContent: { contains: options.search } }
        ];
      }
      
      // 查询数据库
      return await prisma.query.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });
    } catch (error: any) {
      logger.error('获取查询列表失败', { error, options });
      throw new ApiError('获取查询列表失败', 500, error.message);
    }
  }
  
  /**
   * 根据ID获取查询
   */
  async getQueryById(id: string): Promise<Query> {
    try {
      const query = await prisma.query.findUnique({
        where: { id }
      });
      
      if (!query) {
        throw new ApiError('查询不存在', 404);
      }
      
      return query;
    } catch (error: any) {
      logger.error('获取查询失败', { error, id });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('获取查询失败', 500, error.message);
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
      // 检查查询是否存在
      const existingQuery = await prisma.query.findUnique({
        where: { id }
      });
      
      if (!existingQuery) {
        throw new ApiError('查询不存在', 404);
      }
      
      // 准备更新数据
      const updateData: any = {};
      
      // 有选择地更新字段
      if (data.name !== undefined) updateData.name = data.name;
      if (data.sql !== undefined) updateData.sqlContent = data.sql;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.isPublic !== undefined) updateData.status = data.isPublic ? 'PUBLISHED' : 'DRAFT';
      if (data.tags !== undefined) updateData.tags = data.tags.join(',');
      
      // 更新时间
      return await prisma.query.update({
        where: { id },
        data: updateData
      });
    } catch (error: any) {
      logger.error('更新查询失败', { error, id, data });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('更新查询失败', 500, error.message);
    }
  }
  
  /**
   * 删除查询
   */
  async deleteQuery(id: string): Promise<void> {
    try {
      // 检查查询是否存在
      const existingQuery = await prisma.query.findUnique({
        where: { id }
      });
      
      if (!existingQuery) {
        throw new ApiError('查询不存在', 404);
      }
      
      // 删除查询
      await prisma.query.delete({
        where: { id }
      });
    } catch (error: any) {
      logger.error('删除查询失败', { error, id });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('删除查询失败', 500, error.message);
    }
  }

  /**
   * 获取查询历史记录列表
   * @param dataSourceId 数据源ID
   * @param limit 每页数量
   * @param offset 偏移量
   * @returns 查询历史记录列表
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
          orderBy: { startTime: 'desc' },
          skip: offset,
          take: limit
        }),
        prisma.queryHistory.count({ where })
      ]);
      
      return {
        history,
        total,
        limit,
        offset
      };
    } catch (error) {
      logger.error('获取查询历史记录列表失败', { error, dataSourceId });
      throw new ApiError('获取查询历史记录列表失败', 500);
    }
  }

  /**
   * 获取收藏的查询列表
   * @param userId 用户ID
   * @returns 收藏的查询列表
   */
  async getFavorites(userId: string = 'anonymous'): Promise<any[]> {
    try {
      logger.info(`获取用户收藏的查询, userId: ${userId}`);
      
      // 查询用户收藏
      interface QueryFavorite {
        id: string;
        queryId: string;
        userId: string;
        createdAt: Date;
      }
      
      // 直接使用原始查询
      const favorites = await prisma.$queryRaw<QueryFavorite[]>`
        SELECT id, query_id as queryId, user_id as userId, created_at as createdAt
        FROM tbl_query_favorite
        WHERE user_id = ${userId}
      `;
      
      // 如果没有收藏，返回空数组
      if (!favorites || favorites.length === 0) {
        return [];
      }
      
      // 收集所有收藏的查询ID
      const queryIds = favorites.map(fav => fav.queryId);
      
      // 批量获取查询信息
      const queries = await prisma.query.findMany({
        where: {
          id: {
            in: queryIds
          }
        }
      });
      
      // 将查询信息与收藏信息合并
      return favorites.map(favorite => {
        const query = queries.find(q => q.id === favorite.queryId);
        return {
          id: favorite.id,
          queryId: favorite.queryId,
          userId: favorite.userId,
          createdAt: favorite.createdAt,
          query: query || null // 查询可能已被删除
        };
      });
    } catch (error: any) {
      logger.error(`获取收藏查询失败, userId: ${userId}`, { error });
      throw new ApiError('获取收藏查询失败', 500, error.message);
    }
  }
  
  /**
   * 添加查询到收藏夹
   * @param queryId 查询ID
   * @param userId 用户ID
   * @returns 收藏信息
   */
  async favoriteQuery(queryId: string, userId: string = 'anonymous'): Promise<any> {
    try {
      logger.info(`添加收藏查询, queryId: ${queryId}, userId: ${userId}`);
      
      // 查询是否存在且可用(为了静默处理不存在的查询，这一步是可选的)
      try {
        const query = await prisma.query.findUnique({
          where: { id: queryId }
        });
        
        if (!query) {
          logger.warn(`要收藏的查询不存在: ${queryId}`);
          // 但不抛出错误，仍然创建收藏记录
        }
      } catch (err: any) {
        logger.warn(`检查查询时出错，但将继续添加收藏: ${err.message}`);
      }
      
      // 检查是否已经收藏
      const existingFavorite = await prisma.$queryRaw<any[]>`
        SELECT id FROM tbl_query_favorite 
        WHERE query_id = ${queryId} AND user_id = ${userId}
      `;
      
      if (existingFavorite && existingFavorite.length > 0) {
        // 已经收藏过，直接返回
        return existingFavorite[0];
      }
      
      // 创建收藏记录
      const id = uuidv4();
      await prisma.$executeRaw`
        INSERT INTO tbl_query_favorite (id, query_id, user_id, created_at)
        VALUES (${id}, ${queryId}, ${userId}, NOW())
      `;
      
      return { id, queryId, userId, createdAt: new Date() };
    } catch (error: any) {
      logger.error(`添加收藏查询失败, queryId: ${queryId}, userId: ${userId}`, { error });
      throw new ApiError('添加收藏查询失败', 500, error.message);
    }
  }
  
  /**
   * 从收藏夹中移除查询
   * @param queryId 查询ID
   * @param userId 用户ID
   * @returns 是否成功
   */
  async unfavoriteQuery(queryId: string, userId: string = 'anonymous'): Promise<boolean> {
    try {
      logger.info(`取消收藏查询, queryId: ${queryId}, userId: ${userId}`);
      
      // 查找收藏记录
      const favorites = await prisma.$queryRaw<any[]>`
        SELECT id FROM tbl_query_favorite 
        WHERE query_id = ${queryId} AND user_id = ${userId}
      `;
      
      if (!favorites || favorites.length === 0) {
        // 未找到收藏记录，视为成功
        return true;
      }
      
      // 删除收藏记录
      await prisma.$executeRaw`
        DELETE FROM tbl_query_favorite
        WHERE id = ${favorites[0].id}
      `;
      
      return true;
    } catch (error: any) {
      logger.error(`取消收藏查询失败, queryId: ${queryId}, userId: ${userId}`, { error });
      throw new ApiError('取消收藏查询失败', 500, error.message);
    }
  }
}

export default new QueryService();