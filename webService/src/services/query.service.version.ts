/**
 * 查询服务 - 版本控制扩展
 * 用于扩展现有查询服务以支持版本控制
 */
import { PrismaClient, Query, QueryHistory } from '@prisma/client';
import { ApiError } from '../utils/errors/types/api-error';
import { ERROR_CODES } from '../utils/errors/error-codes';
import { VERSION_ERROR } from '../utils/errors/error-codes-version';
import queryVersionService from './query-version.service';
import { QueryServiceStatus } from '../types/query-version';
import logger from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

/**
 * 重构后的保存查询方法
 * 将查询保存为草稿版本
 */
export async function saveQueryWithVersion({
  name,
  dataSourceId,
  sql,
  description,
  tags,
  userId = 'system'
}: {
  name: string;
  dataSourceId: string;
  sql: string;
  description?: string;
  tags?: string[];
  userId?: string;
}): Promise<{
  query: Query;
  versionId: string;
}> {
  try {
    logger.debug('保存查询并创建版本', { name, dataSourceId });
    
    // 事务处理确保原子性
    return await prisma.$transaction(async (tx) => {
      // 1. 创建查询服务记录
      const query = await tx.query.create({
        data: {
          id: uuidv4(),
          name,
          description,
          dataSourceId,
          sqlContent: sql,
          serviceStatus: QueryServiceStatus.ENABLED,
          status: 'DRAFT',
          tags: tags ? tags.join(',') : null,
          versionsCount: 0,
          createdBy: userId,
          updatedBy: userId
        }
      });
      
      // 2. 创建查询版本 v1
      const version = await tx.queryVersion.create({
        data: {
          id: uuidv4(),
          queryId: query.id,
          versionNumber: 1,
          versionStatus: 'DRAFT',
          sqlContent: sql,
          dataSourceId,
          description,
          createdBy: userId
        }
      });
      
      // 3. 更新查询记录的版本计数和关联
      await tx.query.update({
        where: { id: query.id },
        data: {
          versionsCount: 1
        }
      });
      
      return { query, versionId: version.id };
    });
  } catch (error) {
    logger.error('保存查询并创建版本失败', error);
    throw new ApiError(VERSION_ERROR.VERSION_CREATE_FAILED, '保存查询并创建版本失败');
  }
}

/**
 * 更新查询方法 - 版本化
 * 创建新的草稿版本而非直接更新
 */
export async function updateQueryWithVersion({
  queryId,
  name,
  sql,
  description,
  tags,
  userId = 'system'
}: {
  queryId: string;
  name?: string;
  sql?: string;
  description?: string;
  tags?: string[];
  userId?: string;
}): Promise<{
  query: Query;
  versionId: string;
}> {
  try {
    logger.debug('更新查询并创建新版本', { queryId, name });
    
    // 查询当前状态
    const query = await prisma.query.findUnique({
      where: { id: queryId },
      include: {
        versions: {
          orderBy: { versionNumber: 'desc' },
          take: 1
        }
      }
    });
    
    if (!query) {
      throw new ApiError(ERROR_CODES.QUERY_NOT_FOUND, '查询不存在');
    }
    
    // 检查服务状态
    if (query.serviceStatus === QueryServiceStatus.DISABLED) {
      throw new ApiError(VERSION_ERROR.QUERY_DISABLED, '查询服务已禁用，无法编辑');
    }
    
    // 获取最新版本号
    let newVersionNumber = 1;
    if (query.versions && query.versions.length > 0) {
      newVersionNumber = query.versions[0].versionNumber + 1;
    }
    
    // 事务处理确保原子性
    return await prisma.$transaction(async (tx) => {
      // 1. 更新查询基本信息(如有变更)
      if (name || description !== undefined || tags) {
        await tx.query.update({
          where: { id: queryId },
          data: {
            name: name || undefined,
            description: description !== undefined ? description : undefined,
            tags: tags ? tags.join(',') : undefined,
            updatedBy: userId
          }
        });
      }
      
      // 2. 创建新版本
      const version = await tx.queryVersion.create({
        data: {
          id: uuidv4(),
          queryId,
          versionNumber: newVersionNumber,
          versionStatus: 'DRAFT',
          sqlContent: sql || query.sqlContent,
          dataSourceId: query.dataSourceId,
          description: description !== undefined ? description : query.description,
          createdBy: userId
        }
      });
      
      // 3. 更新查询记录的版本计数
      await tx.query.update({
        where: { id: queryId },
        data: {
          versionsCount: { increment: 1 }
        }
      });
      
      // 4. 重新获取更新后的查询记录
      const updatedQuery = await tx.query.findUnique({
        where: { id: queryId }
      });
      
      if (!updatedQuery) {
        throw new ApiError(ERROR_CODES.QUERY_NOT_FOUND, '查询不存在');
      }
      
      return { query: updatedQuery, versionId: version.id };
    });
  } catch (error) {
    logger.error('更新查询并创建新版本失败', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(VERSION_ERROR.VERSION_CREATE_FAILED, '更新查询并创建新版本失败');
  }
}

/**
 * 执行查询方法 - 版本化
 * 支持指定版本或使用当前活跃版本
 */
export async function executeQueryWithVersion({
  queryId,
  versionId,
  params = [],
  userId = 'system',
  options = {}
}: {
  queryId: string;
  versionId?: string;
  params?: any[];
  userId?: string;
  options?: {
    page?: number;
    pageSize?: number;
    offset?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    createHistory?: boolean;
  };
}): Promise<any> {
  try {
    logger.debug('执行查询(版本化)', { queryId, versionId });
    
    // 1. 获取查询服务信息
    const query = await prisma.query.findUnique({
      where: { id: queryId }
    });
    
    if (!query) {
      throw new ApiError(ERROR_CODES.QUERY_NOT_FOUND, '查询不存在');
    }
    
    // 2. 检查服务状态
    if (query.serviceStatus === QueryServiceStatus.DISABLED) {
      throw new ApiError(VERSION_ERROR.QUERY_DISABLED, '查询服务已禁用，无法执行');
    }
    
    // 3. 确定要执行的版本
    let targetVersionId = versionId;
    if (!targetVersionId) {
      // 如果未指定版本，使用当前活跃版本
      if (!query.currentVersionId) {
        throw new ApiError(VERSION_ERROR.VERSION_NOT_FOUND, '查询没有活跃版本，请先发布版本');
      }
      targetVersionId = query.currentVersionId;
    }
    
    // 4. 获取版本信息
    const version = await prisma.queryVersion.findUnique({
      where: { id: targetVersionId }
    });
    
    if (!version) {
      throw new ApiError(VERSION_ERROR.VERSION_NOT_FOUND, '查询版本不存在');
    }
    
    // 5. 验证版本状态
    if (version.versionStatus !== 'PUBLISHED') {
      throw new ApiError(VERSION_ERROR.VERSION_NOT_PUBLISHED, '只能执行已发布的查询版本');
    }
    
    // 6. 执行查询
    // TODO: 调用数据源服务执行实际查询
    // const result = await dataSourceService.executeQuery(version.dataSourceId, version.sqlContent, params, options);
    
    // 模拟查询结果
    const startTime = new Date();
    const result = {
      columns: ['id', 'name'],
      rows: [{ id: 1, name: 'test' }],
      rowCount: 1,
      executionTime: 100
    };
    const endTime = new Date();
    const executionTime = endTime.getTime() - startTime.getTime();
    
    // 7. 记录执行历史
    if (options.createHistory !== false) {
      await prisma.queryHistory.create({
        data: {
          id: uuidv4(),
          queryId,
          versionId: version.id,
          versionNumber: version.versionNumber,
          dataSourceId: version.dataSourceId,
          sqlContent: version.sqlContent,
          status: 'COMPLETED',
          startTime,
          endTime,
          duration: executionTime,
          executionTimeMs: executionTime,
          rowCount: result.rowCount,
          createdBy: userId
        }
      });
      
      // 8. 更新查询执行计数
      await prisma.query.update({
        where: { id: queryId },
        data: {
          executionCount: { increment: 1 },
          lastExecutedAt: new Date()
        }
      });
    }
    
    return result;
  } catch (error) {
    logger.error('执行查询(版本化)失败', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(ERROR_CODES.QUERY_EXECUTION_FAILED, '执行查询失败');
  }
}

/**
 * 获取查询历史方法 - 版本化
 * 可按查询ID和版本ID过滤
 */
export async function getQueryHistoryWithVersion({
  queryId,
  versionId,
  page = 1,
  pageSize = 20
}: {
  queryId?: string;
  versionId?: string;
  page?: number;
  pageSize?: number;
}): Promise<{
  histories: QueryHistory[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> {
  try {
    logger.debug('获取查询历史(版本化)', { queryId, versionId });
    
    const where: any = {};
    if (queryId) {
      where.queryId = queryId;
    }
    if (versionId) {
      where.versionId = versionId;
    }
    
    // 查询历史总数
    const total = await prisma.queryHistory.count({ where });
    
    // 计算总页数
    const totalPages = Math.ceil(total / pageSize);
    
    // 查询历史记录
    const histories = await prisma.queryHistory.findMany({
      where,
      orderBy: { startTime: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize
    });
    
    return {
      histories,
      total,
      page,
      pageSize,
      totalPages
    };
  } catch (error) {
    logger.error('获取查询历史(版本化)失败', error);
    throw new ApiError(ERROR_CODES.QUERY_HISTORY_FETCH_FAILED, '获取查询历史失败');
  }
}