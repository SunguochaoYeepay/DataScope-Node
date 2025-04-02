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
      const { queryId, sqlContent, dataSourceId, description, createdBy, parameters } = params;

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
            sqlContent,
            dataSourceId,
            description,
            parameters: parameters ? JSON.stringify(parameters) : null,
            createdBy
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
    } catch (error) {
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
  async updateDraftVersion(versionId: string, params: UpdateDraftParams) {
    try {
      // 检查版本是否存在且为草稿状态
      const version = await this.prisma.queryVersion.findUnique({
        where: { id: versionId }
      });
      
      if (!version) {
        throw new ApiError(VERSION_ERROR.VERSION_NOT_FOUND, '查询版本不存在');
      }
      
      if (version.versionStatus !== QueryVersionStatus.DRAFT) {
        throw new ApiError(VERSION_ERROR.VERSION_NOT_DRAFT, '只有草稿状态的版本可以更新');
      }
      
      // 更新版本
      return await this.prisma.queryVersion.update({
        where: { id: versionId },
        data: {
          sqlContent: params.sqlContent !== undefined ? params.sqlContent : version.sqlContent,
          description: params.description !== undefined ? params.description : version.description,
          parameters: params.parameters ? JSON.stringify(params.parameters) : version.parameters,
          updatedAt: new Date()
        }
      });
    } catch (error) {
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
        
        // 更新查询的发布版本ID
        const query = await tx.query.findUnique({
          where: { id: version.queryId }
        });
        
        // 如果当前没有活跃版本，则将发布的版本设为活跃版本
        if (!query.currentVersionId) {
          await tx.query.update({
            where: { id: version.queryId },
            data: { 
              currentVersionId: versionId,
              draftVersionId: null,
              status: 'PUBLISHED'
            }
          });
        } else {
          await tx.query.update({
            where: { id: version.queryId },
            data: { 
              draftVersionId: null 
            }
          });
        }
        
        return publishedVersion;
      });
    } catch (error) {
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
      
      if (query.currentVersionId === versionId) {
        throw new ApiError(VERSION_ERROR.VERSION_IS_CURRENT, '不能废弃当前活跃版本');
      }
      
      // 废弃版本
      return await this.prisma.queryVersion.update({
        where: { id: versionId },
        data: {
          versionStatus: QueryVersionStatus.DEPRECATED,
          deprecatedAt: new Date()
        }
      });
    } catch (error) {
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
      
      // 更新查询的当前版本ID
      return await this.prisma.query.update({
        where: { id: version.queryId },
        data: { 
          currentVersionId: versionId,
          status: 'PUBLISHED'
        }
      });
    } catch (error) {
      logger.error('设置活跃版本失败', { error, versionId });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(VERSION_ERROR.VERSION_ACTIVATE_FAILED, '设置活跃版本失败', error);
    }
  }

  /**
   * 获取版本列表
   * @param queryId 查询ID
   * @returns 版本列表
   */
  async getVersions(queryId: string) {
    try {
      return await this.prisma.queryVersion.findMany({
        where: { queryId },
        orderBy: { versionNumber: 'desc' }
      });
    } catch (error) {
      logger.error('获取版本列表失败', { error, queryId });
      throw new ApiError(VERSION_ERROR.VERSION_LIST_FAILED, '获取版本列表失败', error);
    }
  }

  /**
   * 根据ID获取版本
   * @param versionId 版本ID
   * @returns 版本信息
   */
  async getVersionById(versionId: string) {
    try {
      const version = await this.prisma.queryVersion.findUnique({
        where: { id: versionId }
      });
      
      if (!version) {
        throw new ApiError(VERSION_ERROR.VERSION_NOT_FOUND, '查询版本不存在');
      }
      
      return version;
    } catch (error) {
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
  async disableQuery(queryId: string, reason: string) {
    try {
      // 检查查询是否存在
      const query = await this.prisma.query.findUnique({
        where: { id: queryId }
      });
      
      if (!query) {
        throw new ApiError(ERROR_CODES.QUERY_NOT_FOUND, '查询不存在');
      }
      
      // 如果已经是禁用状态，直接返回
      if (query.serviceStatus === QueryServiceStatus.DISABLED) {
        return query;
      }
      
      // 更新查询服务状态
      return await this.prisma.query.update({
        where: { id: queryId },
        data: {
          serviceStatus: QueryServiceStatus.DISABLED,
          disabledReason: reason,
          disabledAt: new Date()
        }
      });
    } catch (error) {
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
      
      // 如果已经是启用状态，直接返回
      if (query.serviceStatus === QueryServiceStatus.ENABLED) {
        return query;
      }
      
      // 更新查询服务状态
      return await this.prisma.query.update({
        where: { id: queryId },
        data: {
          serviceStatus: QueryServiceStatus.ENABLED,
          disabledReason: null,
          disabledAt: null
        }
      });
    } catch (error) {
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
        status: query.serviceStatus,
        disabledReason: query.disabledReason,
        disabledAt: query.disabledAt
      };
    } catch (error) {
      logger.error('获取查询服务状态失败', { error, queryId });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(VERSION_ERROR.QUERY_STATUS_FAILED, '获取查询服务状态失败', error);
    }
  }
}

export default new QueryVersionService();