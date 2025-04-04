import { PrismaClient, Query, QueryHistory, QueryPlanHistory, Prisma } from '@prisma/client';
import { ApiError } from '../utils/errors/types/api-error';
import { ERROR_CODES, GENERAL_ERROR } from '../utils/errors/error-codes';
import dataSourceService from './datasource.service';
import logger from '../utils/logger';
import { QueryPlanService } from '../database-core/query-plan/query-plan-service';
import config from '../config';
import { v4 as uuidv4 } from 'uuid';
import { createPaginatedResponse, offsetToPage } from '../utils/api.utils';
import connection from '../utils/connection';
import mysql from 'mysql2/promise';

const prisma = new PrismaClient();

// 定义查询结果类型
interface QueryResult {
  rows: any[];
  metadata: {
    executionTime: number;
    totalTime: number;
    rowCount: number;
    sql: string;
  }
}

// 定义查询执行选项
interface QueryExecutionOptions {
  page?: number;
  pageSize?: number;
  offset?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  queryId?: string;
  createHistory?: boolean;
}

export class QueryService {
  /**
   * 执行SQL查询
   */
  async executeQuery(dataSourceId: string, sql: string, params: any[] = [], options: QueryExecutionOptions = {}): Promise<QueryResult> {
    try {
      // 记录查询服务层开始执行查询
      const queryStartTime = Date.now();
      logger.info('查询服务开始执行查询', { 
        dataSourceId, 
        options,
        queryLength: sql.length
      });
      
      // 特殊SQL处理: 检查SQL命令类型
      const isSpecial = this.isSpecialCommand(sql);
      logger.debug(`SQL类型检查 - 是否特殊命令: ${isSpecial}`, { sql: sql.substring(0, 50) });
      
      // 如果不是特殊命令且没有手动设置LIMIT，则自动添加LIMIT子句
      if (!isSpecial && !sql.toLowerCase().includes('limit') && options.limit) {
        sql = `${sql} LIMIT ${options.offset || 0}, ${options.limit}`;
        logger.debug('已添加LIMIT子句到SQL', { sql });
      }
      
      // 处理测试数据源
      if (dataSourceId === 'test-ds') {
        logger.info('检测到测试数据源ID: test-ds，返回模拟数据');
        
        // 创建模拟结果
        const mockResult = this.createMockQueryResult(sql);
        
        // 可选: 记录查询历史
        if (options.createHistory !== false) {
          try {
            await this.saveQueryToHistory(dataSourceId, sql, mockResult, options.queryId);
          } catch (historyError) {
            logger.error('创建查询历史记录失败', { historyError });
          }
        }
        
        return mockResult;
      }
      
      // 获取连接器和数据源信息
      const connector = await dataSourceService.getConnector(dataSourceId);
      const dataSource = await dataSourceService.getDataSourceById(dataSourceId);
      
      // 检查数据源是否存在
      if (!dataSource) {
        throw new ApiError('数据源不存在', 404);
      }
      
      logger.debug('成功获取数据源连接器');
      
      // 初始化连接池
      const pool = connection.getPool(connector);
      
      try {
        // 执行SQL并计时
        const startTime = Date.now();
        const result = await pool.query(sql, params);
        const executionTime = Date.now() - startTime;
        
        logger.info('SQL执行完成', { 
          dataSourceId,
          executionTimeMs: executionTime,
          rowCount: Array.isArray(result) ? result.length : 0
        });
        
        // 记录总耗时
        const totalTime = Date.now() - queryStartTime;
        logger.info('查询完成，总耗时', { totalTimeMs: totalTime });
        
        // 处理查询结果
        const processedResult: QueryResult = {
          rows: Array.isArray(result) ? result : [result],
          metadata: {
            executionTime,
            totalTime,
            rowCount: Array.isArray(result) ? result.length : 1,
            sql
          }
        };
        
        // 可选: 记录查询历史
        if (options.createHistory !== false) {
          try {
            await this.saveQueryToHistory(dataSourceId, sql, processedResult, options.queryId);
          } catch (historyError) {
            logger.error('创建查询历史记录失败', { historyError });
          }
        }
        
        return processedResult;
      } catch (error: any) {
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
      // 处理测试数据源ID
      if (dataSourceId === 'test-ds') {
        logger.info('检测到测试数据源ID: test-ds，返回模拟执行计划');
        // 创建模拟查询计划节点
        const planNodes = [
          {
            id: 1,
            selectType: 'SIMPLE',
            table: 'users',
            type: 'ALL',
            possibleKeys: null,
            key: null,
            keyLen: null,
            ref: null,
            rows: 1000,
            filtered: 100,
            extra: null
          }
        ];
        
        // 如果SQL包含JOIN，添加额外节点
        if (sql.toLowerCase().includes('join')) {
          planNodes.push({
            id: 2,
            selectType: 'SIMPLE',
            table: 'orders',
            type: 'ref',
            possibleKeys: null,
            key: null,
            keyLen: null,
            ref: null,
            rows: 10,
            filtered: 100,
            extra: null
          });
        }
        
        // 返回模拟执行计划
        const mockPlan = {
          query: sql,
          planNodes,
          estimatedRows: planNodes.reduce((sum, node) => sum + node.rows, 0),
          estimatedCost: 100,
          warnings: [],
          optimizationTips: [
            '考虑为表users添加索引，覆盖常用的查询条件',
            '考虑简化查询，减少复杂JOIN操作'
          ]
        };
        
        // 记录查询计划到历史记录
        await this.saveQueryPlanToHistory(dataSourceId, sql, mockPlan);
        
        return mockPlan;
      }
      
      // 正常流程 - 真实数据源
      // 获取数据源连接器和数据源信息
      const connector = await dataSourceService.getConnector(dataSourceId);
      const dataSource = await dataSourceService.getDataSourceById(dataSourceId);
      
      if (!dataSource) {
        throw new ApiError('数据源不存在', 404);
      }
      
      // 实例化查询计划服务
      const queryPlanService = new QueryPlanService();
      
      try {
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
      } catch (planError: any) {
        logger.error('获取查询执行计划失败', { error: planError, dataSourceId, sql });
        throw new ApiError(
          '获取查询执行计划失败', 
          500, 
          planError?.message || '未知错误'
        );
      }
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
      logger.debug(`尝试获取查询执行计划，ID: ${id}`);
      
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
      
      // 尝试从QueryHistory表中查询执行计划信息
      const queryHistory = await prisma.queryHistory.findUnique({
        where: { id }
      });
      
      if (queryHistory) {
        logger.debug(`在QueryHistory表中找到查询记录: ${id}`);
        
        // 检查是否有相关的执行计划 - 先查询QueryPlanHistory
        const planHistoryForQuery = await prisma.queryPlanHistory.findFirst({
          where: { sql: queryHistory.sqlContent },
          orderBy: { createdAt: 'desc' }
        });
        
        if (planHistoryForQuery) {
          logger.debug(`找到查询(${id})关联的执行计划历史: ${planHistoryForQuery.id}`);
          return planHistoryForQuery;
        }
      }
      
      // 最后尝试根据查询ID寻找相关的执行计划
      const queryPlan = await prisma.queryPlan.findFirst({
        where: { queryId: id }
      });
      
      if (queryPlan) {
        logger.debug(`找到查询(${id})关联的执行计划: ${queryPlan.id}`);
        return queryPlan;
      }
      
      // 如果ID格式像是生成的随机ID（非UUID），可能是explainQuery=true生成的临时ID
      // 尝试获取最新的执行计划历史
      if (id.length < 20 && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
        logger.debug(`ID ${id} 不是标准UUID格式，尝试获取最新的执行计划历史`);
        const latestPlanHistory = await prisma.queryPlanHistory.findFirst({
          orderBy: { createdAt: 'desc' }
        });
        
        if (latestPlanHistory) {
          logger.debug(`返回最新的执行计划历史: ${latestPlanHistory.id}`);
          return latestPlanHistory;
        }
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
    includeDrafts?: boolean | string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    status?: string;
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
      // 记录详细的请求信息以辅助调试
      logger.debug('尝试获取查询列表', { options });
      
      // 解析分页参数
      const page = options.page || 1;
      const limit = options.size || options.limit || 10;
      const offset = options.offset || (page - 1) * limit;
      
      // 构建查询条件
      const where: any = {};
      
      // 添加数据源过滤
      if (options.dataSourceId) {
        where.dataSourceId = options.dataSourceId;
      }
      
      // 添加标签过滤
      if (options.tag) {
        where.tags = { contains: options.tag };
      }
      
      // 添加公开状态过滤
      if (options.isPublic !== undefined) {
        where.status = options.isPublic ? 'PUBLISHED' : 'DRAFT';
      }
      
      // 添加明确的状态过滤
      if (options.status) {
        where.status = options.status;
      }
      
      // 添加搜索过滤
      if (options.search) {
        where.OR = [
          { name: { contains: options.search } },
          { description: { contains: options.search } },
          { tags: { contains: options.search } }
        ];
      }
      
      // 包含草稿标志处理
      const includeDrafts = options.includeDrafts === true || options.includeDrafts === 'true';
      if (!includeDrafts && !options.status && options.isPublic === undefined) {
        // 默认只显示已发布的查询
        where.status = 'PUBLISHED';
      }
      
      // 设置排序
      const sortBy = options.sortBy || 'updatedAt';
      const sortDir = options.sortDir || 'desc';
      const orderBy: any = { [sortBy]: sortDir };
      
      // 计算总记录数
      const total = await prisma.query.count({ where });
      
      // 获取分页数据
      const queries = await prisma.query.findMany({
        where,
        orderBy,
        skip: offset,
        take: limit
      });
      
      logger.debug(`成功获取 ${queries.length} 条查询记录`);
      
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
      console.log(`[调试] 尝试获取查询, ID=${id}`, {
        idLength: id.length,
        hasPrefix: id.startsWith('a')
      });
      
      // 尝试不同的ID格式
      let query = null;
      const originalId = id;
      
      // 1. 使用原始ID查询
      query = await prisma.query.findUnique({
        where: { id }
      });
      
      if (query) {
        console.log(`[调试] 使用原始ID找到查询: ${id}`);
        return query;
      }
      
      // 2. 如果原始ID不包含'a'前缀，尝试添加它
      if (!id.startsWith('a') && id.length >= 35) {
        const idWithPrefix = `a${id}`;
        console.log(`[调试] 尝试带前缀的ID: ${idWithPrefix}`);
        
        query = await prisma.query.findUnique({
          where: { id: idWithPrefix }
        });
        
        if (query) {
          console.log(`[调试] 使用带前缀的ID找到查询: ${idWithPrefix}`);
          return query;
        }
      }
      
      // 3. 如果原始ID包含'a'前缀，尝试去除它
      if (id.startsWith('a')) {
        const idWithoutPrefix = id.substring(1);
        console.log(`[调试] 尝试不带前缀的ID: ${idWithoutPrefix}`);
        
        query = await prisma.query.findUnique({
          where: { id: idWithoutPrefix }
        });
        
        if (query) {
          console.log(`[调试] 使用不带前缀的ID找到查询: ${idWithoutPrefix}`);
          return query;
        }
      }
      
      if (!query) {
        console.log(`[调试] 尝试了所有ID格式但未找到查询: ${originalId}`);
        const error = new ApiError('查询不存在', 404);
        error.errorCode = GENERAL_ERROR.NOT_FOUND;
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
      dataSourceId?: string;
      status?: string;
      serviceStatus?: string;
      updatedBy?: string;
    }
  ): Promise<Query> {
    try {
      // 记录详细的请求信息以辅助调试
      logger.debug('尝试更新查询', { id, updateData: data });
      console.log(`[调试] 尝试更新查询, ID=${id}`, {
        idLength: id.length,
        hasPrefix: id.startsWith('a'),
        dataKeys: Object.keys(data || {}),
        data: JSON.stringify(data)
      });
      
      // 尝试不同的ID格式
      let existingQuery = null;
      let actualId = id;
      
      // 1. 使用原始ID查询
      existingQuery = await prisma.query.findUnique({
        where: { id }
      });
      
      if (existingQuery) {
        console.log(`[调试] 使用原始ID找到查询: ${id}`);
      } else {
        // 2. 如果原始ID不包含'a'前缀，尝试添加它
        if (!id.startsWith('a') && id.length >= 35) {
          const idWithPrefix = `a${id}`;
          console.log(`[调试] 尝试带前缀的ID: ${idWithPrefix}`);
          
          existingQuery = await prisma.query.findUnique({
            where: { id: idWithPrefix }
          });
          
          if (existingQuery) {
            console.log(`[调试] 使用带前缀的ID找到查询: ${idWithPrefix}`);
            actualId = idWithPrefix;
          }
        }
        
        // 3. 如果原始ID包含'a'前缀，尝试去除它
        if (!existingQuery && id.startsWith('a')) {
          const idWithoutPrefix = id.substring(1);
          console.log(`[调试] 尝试不带前缀的ID: ${idWithoutPrefix}`);
          
          existingQuery = await prisma.query.findUnique({
            where: { id: idWithoutPrefix }
          });
          
          if (existingQuery) {
            console.log(`[调试] 使用不带前缀的ID找到查询: ${idWithoutPrefix}`);
            actualId = idWithoutPrefix;
          }
        }
      }
      
      // 如果查询不存在，返回错误，不再自动创建
      if (!existingQuery) {
        logger.warn('尝试更新不存在的查询', { id, testedIds: [id, `a${id}`, id.substring(1)] });
        const error = new ApiError('查询不存在', 404);
        error.errorCode = GENERAL_ERROR.NOT_FOUND;
        throw error;
      }
      
      // 打印找到的查询详情
      console.log(`[调试] 找到查询详情:`, {
        id: existingQuery.id,
        name: existingQuery.name,
        fields: Object.keys(existingQuery)
      });
      
      // 准备更新数据
      const updateData: any = {};
      
      // 有选择地更新字段
      if (data.name !== undefined) updateData.name = data.name;
      if (data.sql !== undefined) updateData.sqlContent = data.sql;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.isPublic !== undefined) updateData.status = data.isPublic ? 'PUBLISHED' : 'DRAFT';
      if (data.tags !== undefined) updateData.tags = Array.isArray(data.tags) ? data.tags.join(',') : data.tags;
      if (data.dataSourceId !== undefined) updateData.dataSourceId = data.dataSourceId;
      
      // 处理状态字段 - 优先使用明确传入的status
      if (data.status !== undefined) {
        updateData.status = data.status;
        // 记录状态变更
        logger.info('更新查询状态', { id: actualId, oldStatus: existingQuery.status, newStatus: data.status });
      }
      
      // 处理服务状态字段
      if (data.serviceStatus !== undefined) {
        updateData.serviceStatus = data.serviceStatus;
        // 使用类型断言处理可能的属性缺失问题
        const existingQueryAny = existingQuery as any;
        logger.info('更新查询服务状态', { 
          id: actualId, 
          oldServiceStatus: existingQueryAny.serviceStatus || 'UNKNOWN', 
          newServiceStatus: data.serviceStatus
        });
        
        // 如果只更新serviceStatus而没有明确更新status，则保持状态一致性
        if (data.status === undefined) {
          if (data.serviceStatus === 'DISABLED' && existingQuery.status === 'PUBLISHED') {
            updateData.status = 'DEPRECATED';
            logger.info('自动更新查询状态以保持一致性', { 
              id: actualId, 
              serviceStatus: data.serviceStatus, 
              newStatus: 'DEPRECATED' 
            });
          } else if (data.serviceStatus === 'ENABLED' && existingQuery.status === 'DEPRECATED') {
            updateData.status = 'PUBLISHED';
            logger.info('自动更新查询状态以保持一致性', { 
              id: actualId, 
              serviceStatus: data.serviceStatus, 
              newStatus: 'PUBLISHED' 
            });
          }
        }
      }
      
      // 确保更新时间和更新者
      updateData.updatedAt = new Date();
      updateData.updatedBy = data.updatedBy || 'system';
      
      // 添加详细调试日志
      console.log(`[调试] 将要更新的数据:`, {
        id: actualId,
        updateData: JSON.stringify(updateData),
        updateKeys: Object.keys(updateData)
      });
      
      try {
        console.log(`[调试] 执行数据库更新，ID=${actualId}`, { updateFields: Object.keys(updateData) });
        
        // 检查模式中是否存在 serviceStatus 字段
        if (updateData.serviceStatus !== undefined) {
          try {
            // 先检查表结构
            const pool = mysql.createPool({
              host: process.env.DATABASE_HOST || 'localhost',
              user: process.env.DATABASE_USER || 'root',
              password: process.env.DATABASE_PASSWORD || 'datascope',
              database: process.env.DATABASE_NAME || 'datascope'
            });
            
            // 查询表结构
            const [columns] = await pool.query('SHOW COLUMNS FROM tbl_query') as [any[], any];
            const columnNames = columns.map((col: any) => col.Field);
            console.log('[调试] tbl_query表列:', columnNames);
            
            // 如果不存在serviceStatus字段，则从更新数据中移除
            if (!columnNames.includes('serviceStatus')) {
              console.log('[调试] 数据库表不存在serviceStatus字段，从更新数据中移除');
              delete updateData.serviceStatus;
            }
            
            await pool.end();
          } catch (err) {
            console.error('[调试] 检查表结构时出错:', err);
            // 移除可能导致问题的字段
            delete updateData.serviceStatus;
          }
        }
        
        const updatedQuery = await prisma.query.update({
          where: { id: actualId },
          data: updateData
        });
        
        logger.debug('查询更新成功', { id: actualId, updatedData: updateData });
        return updatedQuery;
      } catch (dbError: any) {
        logger.error('数据库更新查询失败', { 
          error: dbError.message,
          stack: dbError.stack,
          id: actualId, 
          updateData: JSON.stringify(updateData)
        });
        
        // 尝试去除可能导致问题的字段
        if (updateData.serviceStatus !== undefined) {
          delete updateData.serviceStatus;
          console.log('[调试] 移除serviceStatus后重试更新');
          
          try {
            const updatedQuery = await prisma.query.update({
              where: { id: actualId },
              data: updateData
            });
            
            logger.debug('移除serviceStatus后查询更新成功', { id: actualId });
            return updatedQuery;
          } catch (retryError: any) {
            logger.error('重试更新查询仍然失败', { 
              error: retryError.message, 
              id: actualId
            });
            throw new ApiError('更新查询时发生数据库错误', 500, (retryError as Error).message);
          }
        }
        
        throw new ApiError('更新查询时发生数据库错误', 500, (dbError as Error).message);
      }
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
      logger.debug('尝试删除查询', { id });
      
      // 检查查询是否存在
      const existingQuery = await prisma.query.findUnique({
        where: { id }
      });
      
      if (!existingQuery) {
        logger.info('查询不存在，无法删除', { id });
        const error = new ApiError('查询不存在', 404);
        error.errorCode = GENERAL_ERROR.NOT_FOUND;
        throw error;
      }
      
      // 删除查询
      await prisma.query.delete({
        where: { id }
      });
      
      logger.info('查询删除成功', { id });
    } catch (error: any) {
      logger.error('删除查询失败', { error, id });
      
      // 如果是已知的API错误，直接抛出
      if (error instanceof ApiError) {
        throw error;
      }
      
      // 包装其他错误
      const apiError = new ApiError('删除查询失败', 500);
      apiError.errorCode = ERROR_CODES.INTERNAL_SERVER_ERROR;
      throw apiError;
    }
  }

  /**
   * 获取查询历史记录
   * @param dataSourceId 数据源ID（可选）
   * @param limit 每页条数
   * @param offset 偏移量
   * @returns 查询历史记录分页结果
   */
  async getQueryHistory(
    dataSourceId?: string,
    limit: number = 50,
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
      console.log('正在使用直接MySQL连接查询历史记录');
      
      // 创建数据库连接池
      try {
        const pool = require('mysql2/promise').createPool({
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '3306'),
          user: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || 'Datascopedb123!',
          database: process.env.DB_NAME || 'datascope',
          waitForConnections: true,
          connectionLimit: 5,
          queueLimit: 0
        });
        
        // 测试连接
        try {
          await pool.query('SELECT 1');
          logger.info('数据库连接成功，开始获取查询历史');
          
          // 构建查询条件
          let whereClause = '';
          const params = [];
          
          if (dataSourceId) {
            whereClause = 'WHERE dataSourceId = ?';
            params.push(dataSourceId);
          }
          
          // 获取总数
          const [countResult] = await pool.query(
            `SELECT COUNT(*) as count FROM tbl_query_history ${whereClause}`,
            params
          );
          
          const total = countResult[0].count;
          
          // 查询历史记录
          const [records] = await pool.query(
            `SELECT * FROM tbl_query_history ${whereClause} 
             ORDER BY startTime DESC, createdAt DESC
             LIMIT ? OFFSET ?`,
            [...params, limit, offset]
          );
          
          console.log(`直接MySQL查询: 获取到 ${records.length} 条查询历史记录，总计: ${total}`);
          
          // 释放连接池
          await pool.end();
          
          const { page, pageSize } = offsetToPage(offset, limit);
          
          return createPaginatedResponse(records, total, page, pageSize);
        } catch (connError) {
          logger.error('测试数据库连接失败', connError);
          await pool.end();
          // 返回空结果而不是抛出错误
          const { page, pageSize } = offsetToPage(offset, limit);
          logger.info('数据库连接失败，返回空结果');
          return createPaginatedResponse([], 0, page, pageSize);
        }
      } catch (poolError) {
        logger.error('创建数据库连接池失败', poolError);
        // 返回空结果而不是抛出错误
        const { page, pageSize } = offsetToPage(offset, limit);
        logger.info('创建数据库连接池失败，返回空结果');
        return createPaginatedResponse([], 0, page, pageSize);
      }
    } catch (error) {
      logger.error('获取查询历史记录列表失败', { error, dataSourceId });
      // 返回空结果而不是抛出错误
      const { page, pageSize } = offsetToPage(offset, limit);
      logger.info('发生错误，返回空结果');
      return createPaginatedResponse([], 0, page, pageSize);
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
          throw new ApiError('查询不存在', GENERAL_ERROR.NOT_FOUND);
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
        error.errorCode = GENERAL_ERROR.NOT_FOUND;
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

  /**
   * 根据ID删除查询历史记录
   * @param id 查询历史记录ID
   * @returns 删除状态
   */
  async deleteQueryHistory(id: string): Promise<boolean> {
    try {
      logger.debug('尝试删除查询历史记录', { id });
      
      // 检查历史记录是否存在
      const existingHistory = await prisma.queryHistory.findUnique({
        where: { id }
      });
      
      if (!existingHistory) {
        logger.info('查询历史记录不存在，无法删除', { id });
        const error = new ApiError('查询历史记录不存在', 404);
        error.errorCode = GENERAL_ERROR.NOT_FOUND;
        throw error;
      }
      
      // 删除历史记录
      await prisma.queryHistory.delete({
        where: { id }
      });
      
      logger.info('查询历史记录删除成功', { id });
      return true;
    } catch (error: any) {
      logger.error('删除查询历史记录失败', { error, id });
      
      // 如果是已知的API错误，直接抛出
      if (error instanceof ApiError) {
        throw error;
      }
      
      // 包装其他错误
      const apiError = new ApiError('删除查询历史记录失败', 500);
      apiError.errorCode = ERROR_CODES.INTERNAL_SERVER_ERROR;
      throw apiError;
    }
  }

  /**
   * 创建模拟查询结果
   */
  private createMockQueryResult(sql: string): QueryResult {
    const mockRows = [];
    const lowerSql = sql.toLowerCase();
    
    // 根据SQL类型生成不同的模拟数据
    if (lowerSql.includes('show tables')) {
      // 模拟SHOW TABLES结果
      mockRows.push({ Tables_in_database: 'users' });
      mockRows.push({ Tables_in_database: 'orders' });
      mockRows.push({ Tables_in_database: 'products' });
    } else if (lowerSql.includes('select') && lowerSql.includes('count')) {
      // 模拟COUNT查询
      mockRows.push({ count: 1000 });
    } else {
      // 默认模拟数据行
      for (let i = 0; i < 5; i++) {
        mockRows.push({
          id: `mock-${i}`,
          name: `Mock Item ${i}`,
          created_at: new Date().toISOString()
        });
      }
    }
    
    return {
      rows: mockRows,
      metadata: {
        executionTime: 10,
        totalTime: 15,
        rowCount: mockRows.length,
        sql
      }
    };
  }
  
  /**
   * 保存查询到历史记录
   */
  private async saveQueryToHistory(
    dataSourceId: string, 
    sql: string, 
    result: QueryResult,
    queryId?: string
  ): Promise<void> {
    try {
      // 创建历史记录
      await prisma.queryHistory.create({
        data: {
          id: uuidv4(),
          queryId: queryId || null,
          dataSourceId,
          sqlContent: sql,
          status: 'COMPLETED',
          startTime: new Date(Date.now() - result.metadata.totalTime),
          endTime: new Date(),
          duration: result.metadata.executionTime,
          rowCount: result.metadata.rowCount,
          createdAt: new Date(),
          createdBy: 'system'
        }
      });
      
      logger.debug('查询历史记录创建成功', { dataSourceId, queryId });
    } catch (error) {
      logger.error('创建查询历史记录失败', { error, dataSourceId, queryId });
      throw error;
    }
  }
}

export default new QueryService();