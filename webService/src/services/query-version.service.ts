/**
 * 查询版本管理服务
 */
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { ApiError } from '../utils/errors/types/api-error';
import { VERSION_ERROR } from '../utils/errors/error-codes-version';
import { ERROR_CODES } from '../utils/errors/error-codes';
import { QueryVersionStatus, QueryServiceStatus, CreateVersionParams, UpdateDraftParams } from '../types/query-version';
import logger from '../utils/logger';

/**
 * 查询版本服务类
 * 负责处理查询版本的创建、更新、发布和管理
 */
class QueryVersionService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * 创建新版本
   * @param params 创建版本所需参数
   * @returns 创建的版本信息
   */
  async createVersion(params: CreateVersionParams) {
    try {
      const { queryId, sqlContent, queryText, dataSourceId, description, createdBy, parameters } = params;
      
      // 优先使用queryText，其次使用sqlContent
      const finalQueryText = queryText || sqlContent || '';
      
      // 如果没有提供dataSourceId，尝试从查询获取
      let finalDataSourceId = dataSourceId;
      if (!finalDataSourceId) {
        try {
          const query = await this.prisma.query.findUnique({
            where: { id: queryId },
            select: { dataSourceId: true }
          });
          if (query && query.dataSourceId) {
            finalDataSourceId = query.dataSourceId;
          }
        } catch (e) {
          logger.warn('获取查询数据源ID失败', { error: e, queryId });
        }
      }
      
      // 如果仍然没有dataSourceId，使用默认值
      finalDataSourceId = finalDataSourceId || 'default';

      // 获取当前最大版本号
      const versionsCount = await this.prisma.queryVersion.count({
        where: { queryId }
      });

      // 创建新版本
      const newVersionNumber = versionsCount + 1;
      
      // 使用事务确保原子性
      return await this.prisma.$transaction(async (tx) => {
        // 创建新版本记录
        const newVersion = await tx.queryVersion.create({
          data: {
            id: uuidv4(),
            queryId,
            versionNumber: newVersionNumber,
            versionStatus: QueryVersionStatus.DRAFT,
            sqlContent: finalQueryText,
            dataSourceId: finalDataSourceId,
            description,
            parameters: parameters ? JSON.stringify(parameters) : null,
            createdBy: createdBy || 'system'
          }
        });
        
        // 更新查询的草稿版本ID
        await tx.query.update({
          where: { id: queryId },
          data: { 
            draftVersionId: newVersion.id,
            updatedBy: createdBy || 'system'
          }
        });
        
        return newVersion;
      });
    } catch (error: any) {
      logger.error('创建版本失败', { error, queryId: params.queryId });
      throw new ApiError(VERSION_ERROR.VERSION_CREATE_FAILED, '创建版本失败', error);
    }
  }

  /**
   * 更新草稿版本
   * @param versionId 版本ID
   * @param params 更新参数
   * @returns 更新后的版本信息
   */
  async updateDraft(versionId: string, params: UpdateDraftParams) {
    try {
      const { sqlContent, description, parameters } = params;
      
      // 检查版本是否存在且为草稿状态
      const version = await this.prisma.queryVersion.findUnique({
        where: { id: versionId }
      });
      
      if (!version) {
        throw new ApiError(VERSION_ERROR.VERSION_NOT_FOUND, '查询版本不存在');
      }
      
      if (version.versionStatus !== QueryVersionStatus.DRAFT) {
        throw new ApiError(VERSION_ERROR.VERSION_NOT_DRAFT, '只有草稿状态的版本可以编辑');
      }
      
      // 更新版本
      return await this.prisma.queryVersion.update({
        where: { id: versionId },
        data: {
          sqlContent: sqlContent || undefined,
          description: description !== undefined ? description : undefined,
          parameters: parameters ? JSON.stringify(parameters) : undefined,
          updatedAt: new Date()
        }
      });
    } catch (error: any) {
      logger.error('更新草稿版本失败', { error, versionId });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(VERSION_ERROR.VERSION_UPDATE_FAILED, '更新草稿版本失败', error);
    }
  }

  /**
   * 发布版本
   * @param versionId 版本ID
   * @returns 发布后的版本信息
   */
  async publishVersion(versionId: string) {
    try {
      // 检查版本是否存在且为草稿状态
      const version = await this.prisma.queryVersion.findUnique({
        where: { id: versionId }
      });
      
      if (!version) {
        throw new ApiError(VERSION_ERROR.VERSION_NOT_FOUND, '查询版本不存在');
      }
      
      if (version.versionStatus !== QueryVersionStatus.DRAFT) {
        throw new ApiError(VERSION_ERROR.VERSION_NOT_DRAFT, '只有草稿状态的版本可以发布');
      }
      
      // 使用事务确保原子性
      return await this.prisma.$transaction(async (tx) => {
        // 更新版本状态为已发布
        const publishedVersion = await tx.queryVersion.update({
          where: { id: versionId },
          data: {
            versionStatus: QueryVersionStatus.PUBLISHED,
            publishedAt: new Date()
          }
        });
        
        // 获取查询信息
        const query = await tx.query.findUnique({
          where: { id: version.queryId }
        });
        
        // 如果当前没有活跃版本，则将发布的版本设为活跃版本
        if (query && !query.currentVersionId) {
          await tx.query.update({
            where: { id: version.queryId },
            data: { 
              currentVersionId: versionId,
              draftVersionId: null,
              status: 'PUBLISHED'
            }
          });
        } else if (query) {
          await tx.query.update({
            where: { id: version.queryId },
            data: { 
              draftVersionId: null 
            }
          });
        }
        
        return publishedVersion;
      });
    } catch (error: any) {
      logger.error('发布版本失败', { error, versionId });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(VERSION_ERROR.VERSION_PUBLISH_FAILED, '发布版本失败', error);
    }
  }

  /**
   * 废弃版本
   * @param versionId 版本ID
   * @returns 废弃后的版本信息
   */
  async deprecateVersion(versionId: string) {
    try {
      // 检查版本是否存在且为已发布状态
      const version = await this.prisma.queryVersion.findUnique({
        where: { id: versionId }
      });
      
      if (!version) {
        throw new ApiError(VERSION_ERROR.VERSION_NOT_FOUND, '查询版本不存在');
      }
      
      if (version.versionStatus !== QueryVersionStatus.PUBLISHED) {
        throw new ApiError(VERSION_ERROR.VERSION_NOT_PUBLISHED, '只有已发布状态的版本可以废弃');
      }
      
      // 检查是否为当前活跃版本
      const query = await this.prisma.query.findUnique({
        where: { id: version.queryId }
      });
      
      if (query && query.currentVersionId === versionId) {
        throw new ApiError(VERSION_ERROR.VERSION_IS_CURRENT, '当前活跃版本不能废弃，请先切换到其他版本');
      }
      
      // 废弃版本
      return await this.prisma.queryVersion.update({
        where: { id: versionId },
        data: {
          versionStatus: QueryVersionStatus.DEPRECATED,
          deprecatedAt: new Date()
        }
      });
    } catch (error: any) {
      logger.error('废弃版本失败', { error, versionId });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(VERSION_ERROR.VERSION_DEPRECATE_FAILED, '废弃版本失败', error);
    }
  }

  /**
   * 设置活跃版本
   * @param versionId 版本ID
   * @returns 更新后的查询信息
   */
  async activateVersion(versionId: string) {
    try {
      // 检查版本是否存在且为已发布状态
      const version = await this.prisma.queryVersion.findUnique({
        where: { id: versionId }
      });
      
      if (!version) {
        throw new ApiError(VERSION_ERROR.VERSION_NOT_FOUND, '查询版本不存在');
      }
      
      if (version.versionStatus !== QueryVersionStatus.PUBLISHED) {
        throw new ApiError(VERSION_ERROR.VERSION_NOT_PUBLISHED, '只有已发布状态的版本可以设为活跃版本');
      }
      
      // 设置活跃版本
      return await this.prisma.query.update({
        where: { id: version.queryId },
        data: {
          currentVersionId: versionId,
          status: 'PUBLISHED' // 确保查询状态为已发布
        }
      });
    } catch (error: any) {
      logger.error('设置活跃版本失败', { error, versionId });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(VERSION_ERROR.VERSION_ACTIVATE_FAILED, '设置活跃版本失败', error);
    }
  }

  /**
   * 获取查询的所有版本
   * @param queryId 查询ID
   * @param page 页码（可选，默认1）
   * @param size 每页大小（可选，默认10）
   * @param status 版本状态过滤（可选）
   * @returns 版本列表
   */
  async getVersions(queryId: string, page: number = 1, size: number = 10, status?: string) {
    try {
      // 构建查询条件
      const where: any = { queryId };
      
      // 如果有状态过滤
      if (status) {
        where.versionStatus = status;
      }
      
      // 计算分页参数
      const skip = (page - 1) * size;
      
      // 查询版本列表
      const versions = await this.prisma.queryVersion.findMany({
        where,
        orderBy: { versionNumber: 'desc' },
        skip,
        take: size
      });
      
      return versions;
    } catch (error: any) {
      logger.error('获取版本列表失败', { error, queryId });
      throw new ApiError(VERSION_ERROR.VERSION_LIST_FAILED, '获取版本列表失败', error);
    }
  }
  
  /**
   * 获取查询的版本总数
   * @param queryId 查询ID
   * @param status 版本状态过滤（可选）
   * @returns 版本总数
   */
  async getVersionsCount(queryId: string, status?: string) {
    try {
      // 构建查询条件
      const where: any = { queryId };
      
      // 如果有状态过滤
      if (status) {
        where.versionStatus = status;
      }
      
      // 查询版本总数
      const count = await this.prisma.queryVersion.count({ where });
      
      return count;
    } catch (error: any) {
      logger.error('获取版本总数失败', { error, queryId });
      throw new ApiError(VERSION_ERROR.VERSION_COUNT_FAILED, '获取版本总数失败', error);
    }
  }

  /**
   * 获取版本详情
   * @param versionId 版本ID
   * @returns 版本详情
   */
  async getVersionById(versionId: string) {
    try {
      // 获取版本详情
      const version = await this.prisma.queryVersion.findUnique({
        where: { id: versionId }
      });
      
      if (!version) {
        throw new ApiError(VERSION_ERROR.VERSION_NOT_FOUND, '查询版本不存在');
      }
        
      return version;
    } catch (error: any) {
      logger.error('获取版本详情失败', { error, versionId });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(VERSION_ERROR.VERSION_GET_FAILED, '获取版本详情失败', error);
    }
  }

  /**
   * 禁用查询服务
   * @param queryId 查询ID
   * @param reason 禁用原因
   * @returns 更新后的查询信息
   */
  async disableQuery(queryId: string, reason: string = '') {
    try {
      // 检查查询是否存在
      const query = await this.prisma.query.findUnique({
        where: { id: queryId }
      });
      
      if (!query) {
        throw new ApiError(ERROR_CODES.QUERY_NOT_FOUND, '查询不存在');
      }
      
      // 禁用查询服务
      return await this.prisma.query.update({
        where: { id: queryId },
        data: {
          serviceStatus: QueryServiceStatus.DISABLED,
          disabledReason: reason,
          disabledAt: new Date()
        }
      });
    } catch (error: any) {
      logger.error('禁用查询服务失败', { error, queryId });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(VERSION_ERROR.QUERY_DISABLE_FAILED, '禁用查询服务失败', error);
    }
  }

  /**
   * 启用查询服务
   * @param queryId 查询ID
   * @returns 更新后的查询信息
   */
  async enableQuery(queryId: string) {
    try {
      // 检查查询是否存在
      const query = await this.prisma.query.findUnique({
        where: { id: queryId }
      });
      
      if (!query) {
        throw new ApiError(ERROR_CODES.QUERY_NOT_FOUND, '查询不存在');
      }
      
      // 启用查询服务
      return await this.prisma.query.update({
        where: { id: queryId },
        data: {
          serviceStatus: QueryServiceStatus.ENABLED,
          disabledReason: null,
          disabledAt: null
        }
      });
    } catch (error: any) {
      logger.error('启用查询服务失败', { error, queryId });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(VERSION_ERROR.QUERY_ENABLE_FAILED, '启用查询服务失败', error);
    }
  }

  /**
   * 获取查询服务状态
   * @param queryId 查询ID
   * @returns 查询服务状态信息
   */
  async getQueryStatus(queryId: string) {
    try {
      // 检查查询是否存在
      const query = await this.prisma.query.findUnique({
        where: { id: queryId }
      });
      
      if (!query) {
        throw new ApiError(ERROR_CODES.QUERY_NOT_FOUND, '查询不存在');
      }
      
      return {
        status: query.serviceStatus || QueryServiceStatus.ENABLED,
        disabledReason: query.disabledReason,
        disabledAt: query.disabledAt,
        currentVersionId: query.currentVersionId || null
      };
    } catch (error: any) {
      logger.error('获取查询服务状态失败', { error, queryId });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(VERSION_ERROR.QUERY_STATUS_FAILED, '获取查询服务状态失败', error);
    }
  }
}

// 导出单例实例
export default new QueryVersionService();