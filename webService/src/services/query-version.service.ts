/**
 * 查询版本管理服务
 * 提供查询服务版本控制和状态管理功能
 */
import { PrismaClient, QueryVersion, Query } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { ApiError } from '../utils/errors/types/api-error';
import { ERROR_CODES } from '../utils/errors/error-codes';
import { QueryVersionStatus, QueryServiceStatus, CreateQueryVersionParams, UpdateQueryVersionParams } from '../types/query-version';
import logger from '../utils/logger';

const prisma = new PrismaClient();

class QueryVersionService {
  /**
   * 创建新的查询版本
   * @param params 创建参数
   * @returns 创建的版本
   */
  async createVersion(params: CreateQueryVersionParams): Promise<QueryVersion> {
    try {
      logger.debug('创建查询版本', params);
      
      // 查询现有版本数量以确定新版本号
      const versionsCount = await prisma.queryVersion.count({
        where: { queryId: params.queryId }
      });
      
      const newVersionNumber = versionsCount + 1;
      
      // 创建新版本
      const newVersion = await prisma.queryVersion.create({
        data: {
          id: uuidv4(),
          queryId: params.queryId,
          versionNumber: newVersionNumber,
          versionStatus: QueryVersionStatus.DRAFT,
          sqlContent: params.sqlContent,
          dataSourceId: params.dataSourceId,
          description: params.description,
          parameters: params.parameters ? JSON.stringify(params.parameters) : null,
          createdBy: 'system', // TODO: 从上下文获取当前用户
        }
      });
      
      // 更新查询服务的版本计数
      await prisma.query.update({
        where: { id: params.queryId },
        data: { versionsCount: newVersionNumber }
      });
      
      return newVersion;
    } catch (error) {
      logger.error('创建查询版本失败', error);
      throw new ApiError(ERROR_CODES.QUERY_VERSION_CREATE_FAILED, '创建查询版本失败');
    }
  }
  
  /**
   * 更新草稿版本
   * @param versionId 版本ID
   * @param params 更新参数
   * @returns 更新后的版本
   */
  async updateDraftVersion(versionId: string, params: UpdateQueryVersionParams): Promise<QueryVersion> {
    try {
      logger.debug('更新查询版本', { versionId, params });
      
      // 获取当前版本
      const currentVersion = await prisma.queryVersion.findUnique({
        where: { id: versionId }
      });
      
      if (!currentVersion) {
        throw new ApiError(ERROR_CODES.QUERY_VERSION_NOT_FOUND, '查询版本不存在');
      }
      
      // 只有草稿状态的版本可以更新
      if (currentVersion.versionStatus !== QueryVersionStatus.DRAFT) {
        throw new ApiError(ERROR_CODES.QUERY_VERSION_NOT_DRAFT, '只有草稿状态的查询版本可以更新');
      }
      
      // 更新版本
      const updatedVersion = await prisma.queryVersion.update({
        where: { id: versionId },
        data: {
          sqlContent: params.sqlContent ?? currentVersion.sqlContent,
          description: params.description !== undefined ? params.description : currentVersion.description,
          parameters: params.parameters ? JSON.stringify(params.parameters) : currentVersion.parameters
        }
      });
      
      return updatedVersion;
    } catch (error) {
      logger.error('更新查询版本失败', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(ERROR_CODES.QUERY_VERSION_UPDATE_FAILED, '更新查询版本失败');
    }
  }
  
  /**
   * 发布版本
   * @param versionId 版本ID
   * @returns 发布后的版本
   */
  async publishVersion(versionId: string): Promise<QueryVersion> {
    try {
      logger.debug('发布查询版本', { versionId });
      
      // 获取当前版本
      const currentVersion = await prisma.queryVersion.findUnique({
        where: { id: versionId }
      });
      
      if (!currentVersion) {
        throw new ApiError(ERROR_CODES.QUERY_VERSION_NOT_FOUND, '查询版本不存在');
      }
      
      // 只有草稿状态的版本可以发布
      if (currentVersion.versionStatus !== QueryVersionStatus.DRAFT) {
        throw new ApiError(ERROR_CODES.QUERY_VERSION_NOT_DRAFT, '只有草稿状态的查询版本可以发布');
      }
      
      // 发布版本
      const publishedVersion = await prisma.queryVersion.update({
        where: { id: versionId },
        data: {
          versionStatus: QueryVersionStatus.PUBLISHED,
          publishedAt: new Date()
        }
      });
      
      // 设置为当前活跃版本
      await prisma.query.update({
        where: { id: currentVersion.queryId },
        data: { currentVersionId: versionId }
      });
      
      return publishedVersion;
    } catch (error) {
      logger.error('发布查询版本失败', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(ERROR_CODES.QUERY_VERSION_PUBLISH_FAILED, '发布查询版本失败');
    }
  }
  
  /**
   * 废弃版本
   * @param versionId 版本ID
   * @returns 废弃后的版本
   */
  async deprecateVersion(versionId: string): Promise<QueryVersion> {
    try {
      logger.debug('废弃查询版本', { versionId });
      
      // 获取当前版本
      const currentVersion = await prisma.queryVersion.findUnique({
        where: { id: versionId },
        include: { query: true }
      });
      
      if (!currentVersion) {
        throw new ApiError(ERROR_CODES.QUERY_VERSION_NOT_FOUND, '查询版本不存在');
      }
      
      // 只有已发布状态的版本可以废弃
      if (currentVersion.versionStatus !== QueryVersionStatus.PUBLISHED) {
        throw new ApiError(ERROR_CODES.QUERY_VERSION_NOT_PUBLISHED, '只有已发布状态的查询版本可以废弃');
      }
      
      // 检查是否是当前活跃版本
      if (currentVersion.query.currentVersionId === versionId) {
        throw new ApiError(ERROR_CODES.QUERY_VERSION_IS_ACTIVE, '当前活跃版本不能废弃，请先切换到其他版本');
      }
      
      // 废弃版本
      const deprecatedVersion = await prisma.queryVersion.update({
        where: { id: versionId },
        data: {
          versionStatus: QueryVersionStatus.DEPRECATED,
          deprecatedAt: new Date()
        }
      });
      
      return deprecatedVersion;
    } catch (error) {
      logger.error('废弃查询版本失败', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(ERROR_CODES.QUERY_VERSION_DEPRECATE_FAILED, '废弃查询版本失败');
    }
  }
  
  /**
   * 设置活跃版本
   * @param versionId 版本ID
   * @returns 更新后的查询服务
   */
  async activateVersion(versionId: string): Promise<Query> {
    try {
      logger.debug('设置查询活跃版本', { versionId });
      
      // 获取版本信息
      const version = await prisma.queryVersion.findUnique({
        where: { id: versionId }
      });
      
      if (!version) {
        throw new ApiError(ERROR_CODES.QUERY_VERSION_NOT_FOUND, '查询版本不存在');
      }
      
      // 只有已发布状态的版本可以设为活跃版本
      if (version.versionStatus !== QueryVersionStatus.PUBLISHED) {
        throw new ApiError(ERROR_CODES.QUERY_VERSION_NOT_PUBLISHED, '只有已发布状态的查询版本可以设为活跃版本');
      }
      
      // 更新查询服务的当前版本
      const updatedQuery = await prisma.query.update({
        where: { id: version.queryId },
        data: { currentVersionId: versionId }
      });
      
      return updatedQuery;
    } catch (error) {
      logger.error('设置查询活跃版本失败', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(ERROR_CODES.QUERY_VERSION_ACTIVATE_FAILED, '设置查询活跃版本失败');
    }
  }
  
  /**
   * 获取查询服务的版本列表
   * @param queryId 查询服务ID
   * @returns 版本列表
   */
  async getVersions(queryId: string): Promise<QueryVersion[]> {
    try {
      logger.debug('获取查询版本列表', { queryId });
      
      const versions = await prisma.queryVersion.findMany({
        where: { queryId },
        orderBy: { versionNumber: 'desc' }
      });
      
      return versions;
    } catch (error) {
      logger.error('获取查询版本列表失败', error);
      throw new ApiError(ERROR_CODES.QUERY_VERSION_LIST_FAILED, '获取查询版本列表失败');
    }
  }
  
  /**
   * 获取查询版本详情
   * @param versionId 版本ID
   * @returns 版本详情
   */
  async getVersionById(versionId: string): Promise<QueryVersion> {
    try {
      logger.debug('获取查询版本详情', { versionId });
      
      const version = await prisma.queryVersion.findUnique({
        where: { id: versionId }
      });
      
      if (!version) {
        throw new ApiError(ERROR_CODES.QUERY_VERSION_NOT_FOUND, '查询版本不存在');
      }
      
      return version;
    } catch (error) {
      logger.error('获取查询版本详情失败', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(ERROR_CODES.QUERY_VERSION_NOT_FOUND, '获取查询版本详情失败');
    }
  }
  
  /**
   * 禁用查询服务
   * @param queryId 查询服务ID
   * @param reason 禁用原因
   * @returns 更新后的查询服务
   */
  async disableQuery(queryId: string, reason: string): Promise<Query> {
    try {
      logger.debug('禁用查询服务', { queryId, reason });
      
      const query = await prisma.query.findUnique({
        where: { id: queryId }
      });
      
      if (!query) {
        throw new ApiError(ERROR_CODES.QUERY_NOT_FOUND, '查询服务不存在');
      }
      
      // 如果已经是禁用状态，不需要重复操作
      if (query.serviceStatus === QueryServiceStatus.DISABLED) {
        return query;
      }
      
      // 禁用查询服务
      const disabledQuery = await prisma.query.update({
        where: { id: queryId },
        data: {
          serviceStatus: QueryServiceStatus.DISABLED,
          disabledReason: reason,
          disabledAt: new Date()
        }
      });
      
      return disabledQuery;
    } catch (error) {
      logger.error('禁用查询服务失败', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(ERROR_CODES.QUERY_DISABLE_FAILED, '禁用查询服务失败');
    }
  }
  
  /**
   * 启用查询服务
   * @param queryId 查询服务ID
   * @returns 更新后的查询服务
   */
  async enableQuery(queryId: string): Promise<Query> {
    try {
      logger.debug('启用查询服务', { queryId });
      
      const query = await prisma.query.findUnique({
        where: { id: queryId }
      });
      
      if (!query) {
        throw new ApiError(ERROR_CODES.QUERY_NOT_FOUND, '查询服务不存在');
      }
      
      // 如果已经是启用状态，不需要重复操作
      if (query.serviceStatus === QueryServiceStatus.ENABLED) {
        return query;
      }
      
      // 启用查询服务
      const enabledQuery = await prisma.query.update({
        where: { id: queryId },
        data: {
          serviceStatus: QueryServiceStatus.ENABLED,
          disabledReason: null,
          disabledAt: null
        }
      });
      
      return enabledQuery;
    } catch (error) {
      logger.error('启用查询服务失败', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(ERROR_CODES.QUERY_ENABLE_FAILED, '启用查询服务失败');
    }
  }
  
  /**
   * 获取查询服务状态
   * @param queryId 查询服务ID
   * @returns 查询服务状态信息
   */
  async getQueryStatus(queryId: string): Promise<{ status: QueryServiceStatus; disabledReason?: string; disabledAt?: Date }> {
    try {
      logger.debug('获取查询服务状态', { queryId });
      
      const query = await prisma.query.findUnique({
        where: { id: queryId },
        select: {
          serviceStatus: true,
          disabledReason: true,
          disabledAt: true
        }
      });
      
      if (!query) {
        throw new ApiError(ERROR_CODES.QUERY_NOT_FOUND, '查询服务不存在');
      }
      
      return {
        status: query.serviceStatus as QueryServiceStatus,
        disabledReason: query.disabledReason,
        disabledAt: query.disabledAt
      };
    } catch (error) {
      logger.error('获取查询服务状态失败', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(ERROR_CODES.QUERY_STATUS_FAILED, '获取查询服务状态失败');
    }
  }
  
  /**
   * 检查查询服务是否已禁用
   * @param queryId 查询服务ID
   * @returns 是否已禁用
   */
  async isQueryDisabled(queryId: string): Promise<boolean> {
    try {
      const status = await this.getQueryStatus(queryId);
      return status.status === QueryServiceStatus.DISABLED;
    } catch (error) {
      logger.error('检查查询服务状态失败', error);
      throw error;
    }
  }
}

export default new QueryVersionService();