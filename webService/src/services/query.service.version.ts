/**
 * 查询版本服务
 */
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/errors/types/api-error';
import { ERROR_CODES } from '../utils/errors/error-codes';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';

// 定义版本相关错误码
const VERSION_ERROR = {
  VERSION_NOT_FOUND: 50001,
  VERSION_CREATE_FAILED: 50002,
  VERSION_UPDATE_FAILED: 50003,
  VERSION_PUBLISH_FAILED: 50004,
  VERSION_ACTIVATE_FAILED: 50005
};

// 创建Prisma客户端实例
const prismaClient = new PrismaClient();

/**
 * 根据ID获取版本详情
 * @param versionId 版本ID
 * @returns 版本详情
 */
export async function getVersionById(versionId: string) {
  try {
    logger.info(`获取查询版本详情, 版本ID: ${versionId}`);
    
    // 查找版本
    const version = await prismaClient.queryVersion.findUnique({
      where: { id: versionId }
    });
    
    if (!version) {
      logger.warn(`查询版本不存在, ID: ${versionId}`);
      throw new ApiError(VERSION_ERROR.VERSION_NOT_FOUND, '查询版本不存在');
    }
    
    return version;
  } catch (error) {
    logger.error(`获取查询版本详情失败, ID: ${versionId}`, error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(VERSION_ERROR.VERSION_NOT_FOUND, '获取查询版本详情失败');
  }
}

/**
 * 获取查询的所有版本
 * @param queryId 查询ID
 * @returns 版本列表
 */
export async function getVersions(queryId: string) {
  try {
    // 检查查询是否存在
    const query = await prismaClient.query.findUnique({
      where: { id: queryId }
    });
    
    if (!query) {
      throw new ApiError(ERROR_CODES.QUERY_NOT_FOUND, '查询不存在');
    }
    
    // 获取所有版本
    const versions = await prismaClient.queryVersion.findMany({
      where: { queryId },
      orderBy: { versionNumber: 'desc' }
    });
    
    return versions;
  } catch (error) {
    logger.error(`获取查询版本失败，查询ID: ${queryId}`, error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(VERSION_ERROR.VERSION_NOT_FOUND, '获取查询版本失败');
  }
}

/**
 * 创建查询版本
 * @param queryId 查询ID
 * @param versionData 版本数据
 * @returns 创建的版本
 */
export async function createVersion(queryId: string, versionData: any) {
  try {
    // 检查查询是否存在
    const query = await prismaClient.query.findUnique({
      where: { id: queryId }
    });
    
    if (!query) {
      throw new ApiError(ERROR_CODES.QUERY_NOT_FOUND, `查询不存在，ID: ${queryId}`);
    }
    
    // 获取该查询的最新版本号
    const latestVersion = await prismaClient.queryVersion.findFirst({
      where: { queryId },
      orderBy: { versionNumber: 'desc' }
    });
    
    // 计算新版本号
    const versionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1;
    
    // 创建新版本
    const newVersion = await prismaClient.queryVersion.create({
      data: {
        id: uuidv4(),
        queryId,
        versionNumber,
        versionStatus: versionData.versionStatus || 'DRAFT',
        sqlContent: versionData.sqlContent || query.sqlContent,
        dataSourceId: versionData.dataSourceId || query.dataSourceId,
        description: versionData.description || `版本 ${versionNumber}`,
        createdBy: versionData.createdBy || 'system'
      }
    });
    
    // 更新查询的版本计数
    await prismaClient.query.update({
      where: { id: queryId },
      data: { 
        versionsCount: { increment: 1 }
      }
    });
    
    // 如果是已发布版本，更新查询的当前版本
    if (versionData.versionStatus === 'PUBLISHED') {
      await prismaClient.query.update({
        where: { id: queryId },
        data: { 
          currentVersionId: newVersion.id
        }
      });
    }
    
    return newVersion;
  } catch (error) {
    logger.error(`创建查询版本失败，查询ID: ${queryId}`, error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(VERSION_ERROR.VERSION_CREATE_FAILED, '创建查询版本失败');
  }
}

/**
 * 发布查询版本
 * @param versionId 版本ID
 * @returns 发布后的版本
 */
export async function publishVersion(versionId: string) {
  try {
    logger.info(`尝试发布查询版本, ID: ${versionId}`);
    
    // 查找版本
    const version = await prismaClient.queryVersion.findUnique({
      where: { id: versionId }
    });
    
    if (!version) {
      logger.warn(`要发布的查询版本不存在, ID: ${versionId}`);
      throw new ApiError(VERSION_ERROR.VERSION_NOT_FOUND, '查询版本不存在');
    }
    
    // 检查查询是否存在
    const query = await prismaClient.query.findUnique({
      where: { id: version.queryId }
    });
    
    if (!query) {
      logger.warn(`版本对应的查询不存在, 查询ID: ${version.queryId}`);
      throw new ApiError(ERROR_CODES.QUERY_NOT_FOUND, '查询不存在');
    }
    
    // 事务处理：更新版本状态和查询的当前版本ID
    const result = await prismaClient.$transaction(async (prisma) => {
      // 1. 更新版本状态
      const updatedVersion = await prisma.queryVersion.update({
        where: { id: versionId },
        data: { 
          versionStatus: 'PUBLISHED',
          updatedAt: new Date() // 使用更新时间字段代替publishedAt
        }
      });
      
      // 2. 更新查询信息
      await prisma.query.update({
        where: { id: version.queryId },
        data: {
          currentVersionId: versionId,
          status: 'PUBLISHED',
          updatedAt: new Date(),
          updatedBy: 'system'
        }
      });
      
      return updatedVersion;
    });
    
    logger.info(`查询版本发布成功, ID: ${versionId}, 查询ID: ${version.queryId}`);
    return result;
  } catch (error) {
    logger.error(`发布查询版本失败, ID: ${versionId}`, error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(VERSION_ERROR.VERSION_PUBLISH_FAILED, '发布查询版本失败');
  }
}

/**
 * 激活查询版本（设置为当前活跃版本）
 * @param versionId 版本ID
 * @returns 激活后的版本
 */
export async function activateVersion(versionId: string) {
  try {
    logger.info(`尝试激活查询版本, ID: ${versionId}`);
    
    // 查找版本
    const version = await prismaClient.queryVersion.findUnique({
      where: { id: versionId }
    });
    
    if (!version) {
      logger.warn(`要激活的查询版本不存在, ID: ${versionId}`);
      throw new ApiError(VERSION_ERROR.VERSION_NOT_FOUND, '查询版本不存在');
    }
    
    // 检查版本状态，只有已发布的版本才能被激活
    if (version.versionStatus !== 'PUBLISHED') {
      logger.warn(`只有已发布的版本才能被激活, 当前状态: ${version.versionStatus}`);
      throw new ApiError(VERSION_ERROR.VERSION_ACTIVATE_FAILED, '只有已发布的版本才能被激活');
    }
    
    // 检查查询是否存在
    const query = await prismaClient.query.findUnique({
      where: { id: version.queryId }
    });
    
    if (!query) {
      logger.warn(`版本对应的查询不存在, 查询ID: ${version.queryId}`);
      throw new ApiError(ERROR_CODES.QUERY_NOT_FOUND, '查询不存在');
    }
    
    // 事务处理：设置查询的当前活跃版本
    const result = await prismaClient.$transaction(async (prisma) => {
      // 更新查询信息，设置当前版本ID
      await prisma.query.update({
        where: { id: version.queryId },
        data: {
          currentVersionId: versionId,
          status: 'ACTIVE',
          updatedAt: new Date(),
          updatedBy: 'system'
        }
      });
      
      // 更新版本状态为最新更新时间
      const updatedVersion = await prisma.queryVersion.update({
        where: { id: versionId },
        data: { 
          updatedAt: new Date()
        }
      });
      
      return updatedVersion;
    });
    
    logger.info(`查询版本激活成功, ID: ${versionId}, 查询ID: ${version.queryId}`);
    return result;
  } catch (error) {
    logger.error(`激活查询版本失败, ID: ${versionId}`, error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(VERSION_ERROR.VERSION_ACTIVATE_FAILED, '激活查询版本失败');
  }
}

/**
 * 获取查询版本，支持分页
 * @param queryId 查询ID
 * @param options 分页选项
 * @returns 分页后的版本列表
 */
export async function getVersionsPaginated(queryId: string, options: { page?: number, size?: number } = {}) {
  try {
    logger.info(`获取查询版本（分页），查询ID: ${queryId}, 页码: ${options.page}, 每页数量: ${options.size}`);
    
    // 检查查询是否存在
    const query = await prismaClient.query.findUnique({
      where: { id: queryId }
    });
    
    if (!query) {
      throw new ApiError(ERROR_CODES.QUERY_NOT_FOUND, '查询不存在');
    }
    
    // 计算分页参数
    const page = options.page || 1;
    const size = options.size || 50;
    const skip = (page - 1) * size;
    
    // 获取总记录数
    const total = await prismaClient.queryVersion.count({
      where: { queryId }
    });
    
    // 获取当前页的版本列表
    const versions = await prismaClient.queryVersion.findMany({
      where: { queryId },
      orderBy: { versionNumber: 'desc' },
      skip,
      take: size
    });
    
    // 构建结果对象
    const result = {
      items: versions,
      pagination: {
        page,
        pageSize: size,
        total,
        totalPages: Math.ceil(total / size),
        hasMore: page < Math.ceil(total / size)
      }
    };
    
    return result;
  } catch (error) {
    logger.error(`获取查询版本（分页）失败，查询ID: ${queryId}`, error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(VERSION_ERROR.VERSION_NOT_FOUND, '获取查询版本失败');
  }
}