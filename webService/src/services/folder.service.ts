import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/errors/types/api-error';
import { ERROR_CODES } from '../utils/errors/error-codes';
import { CreateFolderParams, UpdateFolderParams } from '../types/query';
import logger from '../utils/logger';
import { createPaginatedResponse } from '../utils/api.utils';

const prisma = new PrismaClient();

/**
 * 查询文件夹服务
 * 管理查询的分类和组织
 */
export class FolderService {
  /**
   * 获取查询文件夹列表
   * @param options 分页和筛选参数
   * @returns 分页的文件夹列表
   */
  async getFolders(options?: {
    parentId?: string | null;
    page?: number;
    size?: number;
    offset?: number;
    limit?: number;
  }): Promise<{
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
      // 构建查询条件
      const where: any = {};
      
      // 如果指定了parentId，则查询该父文件夹下的子文件夹
      if (options?.parentId !== undefined) {
        where.parentId = options.parentId;
      }
      
      // 处理分页参数
      const limit = options?.limit || options?.size || 10;
      const offset = options?.offset !== undefined ? options.offset : 
                    (options?.page ? (options.page - 1) * limit : 0);
      const page = options?.page || Math.floor(offset / limit) + 1;
      
      // 查询总数
      const total = await prisma.queryFolder.count({ where });
      
      // 查询数据
      const folders = await prisma.queryFolder.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: offset,
        take: limit,
        include: {
          // 包含父文件夹信息
          parent: {
            select: { id: true, name: true }
          },
          // 包含子文件夹数量
          _count: {
            select: { children: true, queries: true }
          }
        }
      });
      
      // 处理返回数据，增加子文件夹和查询数量信息
      const items = folders.map(folder => ({
        id: folder.id,
        name: folder.name,
        description: folder.description,
        parentId: folder.parentId,
        parentName: folder.parent?.name,
        childrenCount: folder._count.children,
        queriesCount: folder._count.queries,
        createdAt: folder.createdAt,
        updatedAt: folder.updatedAt
      }));
      
      // 返回标准格式的分页响应
      return createPaginatedResponse(items, total, page, limit);
    } catch (error: any) {
      logger.error('获取文件夹列表失败', { error, options });
      throw new ApiError('获取文件夹列表失败', 500, error.message);
    }
  }
  
  /**
   * 创建文件夹
   * @param data 文件夹创建参数
   * @returns 创建的文件夹
   */
  async createFolder(data: CreateFolderParams): Promise<any> {
    try {
      // 如果指定了父文件夹，验证其是否存在
      if (data.parentId) {
        const parentFolder = await prisma.queryFolder.findUnique({
          where: { id: data.parentId }
        });
        
        if (!parentFolder) {
          throw new ApiError('父文件夹不存在', 404);
        }
      }
      
      // 创建文件夹
      const folder = await prisma.queryFolder.create({
        data: {
          name: data.name,
          description: data.description,
          parentId: data.parentId
        }
      });
      
      logger.info(`创建文件夹成功: ${folder.id}`);
      return folder;
    } catch (error: any) {
      logger.error('创建文件夹失败', { error, data });
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError('创建文件夹失败', 500, error.message);
    }
  }
  
  /**
   * 更新文件夹
   * @param id 文件夹ID
   * @param data 更新数据
   * @returns 更新后的文件夹
   */
  async updateFolder(id: string, data: UpdateFolderParams): Promise<any> {
    try {
      // 验证文件夹是否存在
      const folder = await prisma.queryFolder.findUnique({
        where: { id }
      });
      
      if (!folder) {
        throw new ApiError('文件夹不存在', 404);
      }
      
      // 如果指定了父文件夹，验证其是否存在
      if (data.parentId) {
        const parentFolder = await prisma.queryFolder.findUnique({
          where: { id: data.parentId }
        });
        
        if (!parentFolder) {
          throw new ApiError('父文件夹不存在', 404);
        }
        
        // 防止循环引用
        if (data.parentId === id) {
          throw new ApiError('不能将文件夹设置为自己的父文件夹', 400);
        }
      }
      
      // 更新文件夹
      const updatedFolder = await prisma.queryFolder.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          parentId: data.parentId
        }
      });
      
      logger.info(`更新文件夹成功: ${id}`);
      return updatedFolder;
    } catch (error: any) {
      logger.error(`更新文件夹失败: ${id}`, { error, data });
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError('更新文件夹失败', 500, error.message);
    }
  }
  
  /**
   * 删除文件夹
   * @param id 文件夹ID
   * @returns 删除结果
   */
  async deleteFolder(id: string): Promise<{ success: boolean }> {
    try {
      // 验证文件夹是否存在
      const folder = await prisma.queryFolder.findUnique({
        where: { id },
        include: {
          _count: {
            select: { children: true, queries: true }
          }
        }
      });
      
      if (!folder) {
        throw new ApiError('文件夹不存在', 404);
      }
      
      // 检查文件夹中是否有子文件夹或查询
      if (folder._count.children > 0 || folder._count.queries > 0) {
        throw new ApiError('无法删除非空文件夹', 400);
      }
      
      // 删除文件夹
      await prisma.queryFolder.delete({
        where: { id }
      });
      
      logger.info(`删除文件夹成功: ${id}`);
      return { success: true };
    } catch (error: any) {
      logger.error(`删除文件夹失败: ${id}`, { error });
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError('删除文件夹失败', 500, error.message);
    }
  }
  
  /**
   * 根据ID获取文件夹
   * @param id 文件夹ID
   * @returns 文件夹信息
   */
  async getFolderById(id: string): Promise<any> {
    try {
      // 获取文件夹
      const folder = await prisma.queryFolder.findUnique({
        where: { id },
        include: {
          parent: {
            select: { id: true, name: true }
          },
          children: {
            select: { id: true, name: true, description: true }
          },
          queries: {
            select: { id: true, name: true, description: true }
          }
        }
      });
      
      if (!folder) {
        throw new ApiError('文件夹不存在', 404);
      }
      
      return {
        id: folder.id,
        name: folder.name,
        description: folder.description,
        parentId: folder.parentId,
        parent: folder.parent,
        children: folder.children,
        queries: folder.queries,
        createdAt: folder.createdAt,
        updatedAt: folder.updatedAt
      };
    } catch (error: any) {
      logger.error(`获取文件夹详情失败: ${id}`, { error });
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError('获取文件夹详情失败', 500, error.message);
    }
  }
}

// 创建单例实例导出
const folderService = new FolderService();
export default folderService; 