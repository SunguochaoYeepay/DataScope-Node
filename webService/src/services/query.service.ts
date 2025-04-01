import { PrismaClient, Query, QueryHistory, QueryPlanHistory, Prisma } from '@prisma/client';
import { ApiError } from '../utils/errors/types/api-error';
import { ERROR_CODES } from '../utils/errors/error-codes';
import dataSourceService from './datasource.service';
import logger from '../utils/logger';
import { QueryPlanService } from '../database-core/query-plan/query-plan-service';
import config from '../config';
import { v4 as uuidv4 } from 'uuid';
import { createPaginatedResponse, offsetToPage } from '../utils/api.utils';

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
    queryId?: string;
    createHistory?: boolean;
  }): Promise<any> {
    try {
      logger.debug('执行查询', { dataSourceId, sql, params, options });
      
      let queryHistoryId: string | undefined;
      const startTime = new Date();
      
      // 获取数据源连接器
      const connector = await dataSourceService.getConnector(dataSourceId);
      if (!connector) {
        throw new ApiError('数据源连接失败', ERROR_CODES.DATABASE_CONNECTION_ERROR);
      }
      
      // 默认查询选项
      const queryOptionsToUse = {
        ...options
      };
      
      try {
        // 只有在以下情况下才创建查询历史记录：
        // 1. 执行已保存的查询(queryId存在)
        // 2. 显式指定需要创建历史记录(createHistory=true)
        if (options?.queryId || options?.createHistory) {
          logger.debug('创建查询历史记录');
          const queryHistory = await prisma.queryHistory.create({
            data: {
              dataSourceId,
              sqlContent: sql,
              status: 'RUNNING',
              startTime,
              // 如果有queryId，则关联到已保存的查询
              queryId: options?.queryId
            }
          });
          queryHistoryId = queryHistory.id;
          logger.debug('查询历史记录已创建', { queryHistoryId });
        } else {
          logger.debug('跳过创建查询历史记录');
        }
        
        // 执行查询 - 传递queryHistoryId作为cancelId以支持取消功能
        logger.debug('开始执行数据库查询', { 
          sql, 
          params, 
          queryId: queryHistoryId, 
          options: queryOptionsToUse 
        });
        
        const result = await connector.executeQuery(sql, params, queryHistoryId, queryOptionsToUse);
        logger.debug('数据库查询执行成功', { rowCount: result.rows.length });
        
        // 如果创建了查询历史，则更新状态
        if (queryHistoryId) {
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
        }
        
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
      // 首先尝试从QueryPlanHistory表获取
      const historyPlan = await prisma.queryPlanHistory.findUnique({
        where: { id }
      });
      
      if (historyPlan) {
        logger.debug(`在QueryPlanHistory表中找到查询计划: ${id}`);
        return historyPlan;
      }
      
      // 如果不存在，尝试从QueryPlan表获取
      const plan = await prisma.queryPlan.findUnique({
        where: { id }
      });
      
      if (plan) {
        logger.debug(`在QueryPlan表中找到查询计划: ${id}`);
        return plan;
      }
      
      // 最后尝试根据查询ID寻找相关的执行计划
      const queryPlan = await prisma.queryPlan.findFirst({
        where: { queryId: id }
      });
      
      if (queryPlan) {
        logger.debug(`找到查询(${id})关联的执行计划: ${queryPlan.id}`);
        return queryPlan;
      }
      
      logger.warn(`未找到查询计划: ${id}`);
      return null;
    } catch (error) {
      logger.error('获取查询计划失败', { error, id });
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
    items: any[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
      hasMore: boolean;
    };
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
      
      const { page, pageSize } = offsetToPage(offset, limit);
      
      return createPaginatedResponse(history, total, page, pageSize);
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
    id?: string;
    name: string;
    dataSourceId: string;
    sql: string;
    description?: string;
    tags?: string[];
    isPublic?: boolean;
  }): Promise<Query> {
    try {
      // 记录请求内容
      logger.debug('保存查询请求参数', { ...data, id: data.id || '(未提供，将自动生成)' });
      
      // 准备创建数据
      const createData: any = {
        name: data.name,
        dataSourceId: data.dataSourceId,
        sqlContent: data.sql,
        description: data.description || '',
        tags: data.tags?.join(',') || '',
        status: data.isPublic ? 'PUBLISHED' : 'DRAFT',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // 如果提供了自定义ID，使用它
      if (data.id) {
        createData.id = data.id;
      }
      
      const query = await prisma.query.create({
        data: createData
      });
      
      logger.debug('查询保存成功', { id: query.id });
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
    page?: number;
    size?: number;
    offset?: number;
    limit?: number;
  } = {}): Promise<{
    items: Query[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
      hasMore: boolean;
    };
  }> {
    try {
      // 构建查询条件
      const where: any = {};
      
      // 添加数据源过滤
      if (options.dataSourceId) {
        where.dataSourceId = options.dataSourceId;
      }
      
      // 添加公开状态过滤 - 注释掉此逻辑，以便返回所有状态的查询
      // if (options.isPublic !== undefined) {
      //   where.status = options.isPublic ? 'PUBLISHED' : 'DRAFT';
      // }
      
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
      
      // 处理分页参数
      const limit = options.limit || options.size || 10;
      const offset = options.offset !== undefined ? options.offset : 
                     (options.page ? (options.page - 1) * limit : 0);
      const page = options.page || Math.floor(offset / limit) + 1;
      
      // 查询数据库获取总数
      const total = await prisma.query.count({ where });
      
      // 查询数据库获取分页数据
      const queries = await prisma.query.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      });
      
      // 返回标准格式的分页响应
      return createPaginatedResponse(queries, total, page, limit);
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
        const error = new ApiError('查询不存在', 404);
        error.errorCode = ERROR_CODES.RESOURCE_NOT_FOUND;
        throw error;
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
      dataSourceId?: string; // 添加dataSourceId参数，用于创建不存在的查询
    }
  ): Promise<Query> {
    try {
      // 记录详细的请求信息以辅助调试
      logger.debug('尝试更新查询', { id, updateData: data });
      
      // 检查查询是否存在
      const existingQuery = await prisma.query.findUnique({
        where: { id }
      });
      
      // 如果查询不存在且提供了必要的数据，则创建新查询
      if (!existingQuery) {
        logger.info('查询不存在，尝试创建新查询', { id, data });
        
        // 检查创建查询所需的必要字段
        if (!data.dataSourceId || !data.name) {
          logger.warn('缺少创建查询所需的必要字段', { id, data });
          throw new ApiError('查询不存在，且缺少创建所需的必要字段 (dataSourceId, name)', 404);
        }
        
        // 创建新查询
        const createData: any = {
          id: id, // 使用传入的ID
          name: data.name,
          dataSourceId: data.dataSourceId,
          sqlContent: data.sql || '', 
          description: data.description || '',
          tags: data.tags?.join(',') || '',
          status: data.isPublic ? 'PUBLISHED' : 'DRAFT',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        logger.debug('创建新查询', { id, createData });
        
        try {
          const newQuery = await prisma.query.create({
            data: createData
          });
          
          logger.info('已创建新查询', { id: newQuery.id });
          return newQuery;
        } catch (createError: any) {
          logger.error('创建新查询失败', { error: createError, id, data });
          throw new ApiError(`创建新查询失败: ${createError.message}`, 500);
        }
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
      const updatedQuery = await prisma.query.update({
        where: { id },
        data: updateData
      });
      
      logger.debug('查询更新成功', { id });
      return updatedQuery;
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
    items: QueryHistory[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
      hasMore: boolean;
    };
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
      
      const { page, pageSize } = offsetToPage(offset, limit);
      
      return createPaginatedResponse(history, total, page, pageSize);
    } catch (error) {
      logger.error('获取查询历史记录列表失败', { error, dataSourceId });
      throw new ApiError('获取查询历史记录列表失败', 500);
    }
  }

  /**
   * 获取收藏的查询列表
   * @param userId 用户ID
   * @param options 分页选项
   * @returns 分页的收藏查询列表
   */
  async getFavorites(
    userId: string = 'anonymous',
    options?: {
      page?: number;
      size?: number;
      offset?: number;
      limit?: number;
    }
  ): Promise<{
    items: any[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
      hasMore: boolean;
    };
  }> {
    try {
      logger.info(`获取用户收藏的查询, userId: ${userId}`);
      
      // 处理分页参数
      const limit = options?.limit || options?.size || 10;
      const offset = options?.offset !== undefined ? options.offset : 
                    (options?.page ? (options.page - 1) * limit : 0);
      const page = options?.page || Math.floor(offset / limit) + 1;
      
      // 获取总记录数
      const totalCount = await prisma.$queryRaw<[{count: number}]>`
        SELECT COUNT(*) as count
        FROM tbl_query_favorite
        WHERE userId = ${userId}
      `;
      const total = Number(totalCount[0].count);
      
      // 查询用户收藏（带分页）
      interface QueryFavorite {
        id: string;
        queryId: string;
        userId: string;
        createdAt: Date;
      }
      
      // 直接使用原始查询，添加分页
      const favorites = await prisma.$queryRaw<QueryFavorite[]>`
        SELECT id, queryId, userId, createdAt
        FROM tbl_query_favorite
        WHERE userId = ${userId}
        ORDER BY createdAt DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      
      // 如果没有收藏，返回空数组
      if (!favorites || favorites.length === 0) {
        return createPaginatedResponse([], total, page, limit);
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
      const items = favorites.map(favorite => {
        const query = queries.find(q => q.id === favorite.queryId);
        return {
          id: favorite.id,
          queryId: favorite.queryId,
          userId: favorite.userId,
          createdAt: favorite.createdAt,
          query: query || null // 查询可能已被删除
        };
      });
      
      // 返回标准格式的分页响应
      return createPaginatedResponse(items, total, page, limit);
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
      
      // 查询是否存在且可用
      try {
        const query = await prisma.query.findUnique({
          where: { id: queryId }
        });
        
        if (!query) {
          logger.warn(`要收藏的查询不存在: ${queryId}`);
          throw new ApiError('查询不存在', ERROR_CODES.RESOURCE_NOT_FOUND);
        }
      } catch (err: any) {
        if (err instanceof ApiError) {
          throw err;
        }
        logger.warn(`检查查询时出错: ${err.message}`);
        throw ApiError.internal('查询检查失败', { originalError: err.message });
      }
      
      // 检查是否已经收藏 - 使用Prisma API而不是原始SQL
      const existingFavorite = await prisma.queryFavorite.findFirst({
        where: {
          queryId: queryId,
          userId: userId
        }
      });
      
      if (existingFavorite) {
        // 已经收藏过，直接返回
        logger.debug(`查询已被收藏, 返回现有收藏记录, id: ${existingFavorite.id}`);
        return existingFavorite;
      }
      
      // 创建新的收藏记录 - 使用Prisma API
      const favorite = await prisma.queryFavorite.create({
        data: {
          queryId: queryId,
          userId: userId
        }
      });
      
      logger.info(`成功添加收藏, id: ${favorite.id}`);
      return favorite;
    } catch (error: any) {
      logger.error(`添加收藏查询失败, queryId: ${queryId}, userId: ${userId}`, { error });
      
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.internal('添加收藏查询失败', { originalError: error.message });
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
      
      // 查找收藏记录 - 使用Prisma API而不是原始SQL
      const favorite = await prisma.queryFavorite.findFirst({
        where: {
          queryId: queryId,
          userId: userId
        }
      });
      
      if (!favorite) {
        // 未找到收藏记录，视为成功
        logger.debug(`未找到收藏记录, queryId: ${queryId}, userId: ${userId}`);
        return true;
      }
      
      // 删除收藏记录 - 使用Prisma API
      await prisma.queryFavorite.delete({
        where: {
          id: favorite.id
        }
      });
      
      logger.info(`成功取消收藏, id: ${favorite.id}`);
      return true;
    } catch (error: any) {
      logger.error(`取消收藏查询失败, queryId: ${queryId}, userId: ${userId}`, { error });
      
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.internal('取消收藏查询失败', { originalError: error.message });
    }
  }

  /**
   * 根据ID获取查询历史记录
   * @param id 查询历史记录ID
   * @returns 查询历史记录
   */
  async getQueryHistoryById(id: string): Promise<any> {
    try {
      const history = await prisma.queryHistory.findUnique({
        where: { id }
      });
      
      if (!history) {
        const error = new ApiError('查询历史记录不存在', 404);
        error.errorCode = ERROR_CODES.RESOURCE_NOT_FOUND;
        throw error;
      }
      
      return history;
    } catch (error: any) {
      logger.error('获取查询历史记录失败', { error, id });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('获取查询历史记录失败', 500, error.message);
    }
  }

  /**
   * 清空临时查询历史记录
   * 仅删除未关联到保存查询的历史记录(queryId为null的记录)
   * @param dataSourceId 可选数据源ID，如果提供则只清空该数据源的临时历史
   * @returns 删除的记录数量
   */
  async clearTemporaryQueryHistory(dataSourceId?: string): Promise<number> {
    try {
      logger.info('清空临时查询历史记录', { dataSourceId: dataSourceId || '全部数据源' });
      
      // 构建删除条件
      const where: any = {
        queryId: null // 仅删除未关联到保存查询的记录
      };
      
      // 如果提供了数据源ID，则添加到过滤条件
      if (dataSourceId) {
        where.dataSourceId = dataSourceId;
      }
      
      // 执行删除操作
      const result = await prisma.queryHistory.deleteMany({
        where
      });
      
      logger.info(`临时查询历史记录清空成功，共删除${result.count}条记录`, { 
        dataSourceId: dataSourceId || '全部数据源',
        deletedCount: result.count 
      });
      
      return result.count;
    } catch (error: any) {
      logger.error('清空临时查询历史记录失败', { error, dataSourceId });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('清空临时查询历史记录失败', 500, error.message);
    }
  }
}

export default new QueryService();