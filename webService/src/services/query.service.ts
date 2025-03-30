import { PrismaClient, Query, QueryHistory, QueryPlanHistory } from '@prisma/client';
import { ApiError } from '../utils/error';
import dataSourceService from './datasource.service';
import logger from '../utils/logger';
import { QueryPlanService } from '../database-core/query-plan/query-plan-service';
import config from '../config';

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
        logger.debug('开始执行数据库查询');
        const result = await connector.executeQuery(sql, params, queryHistoryId, options);
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
}

export default new QueryService();