/**
 * 元数据服务
 * 
 * 负责从数据源同步元数据，包括数据库结构、表、列和关系
 */
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';
import ApiError from '../utils/apiError';
import { DatabaseConnectorFactory } from '../utils/database-utils';
import dataSourceService from './datasource.service';
import { v4 as uuidv4 } from 'uuid';
import { createPaginatedResponse, offsetToPage } from '../utils/api.utils';

// 定义自定义类型，用于表示元数据表
type PrismaMetadata = {
  id: string;
  dataSourceId: string;
  structure: string;
  createdAt: Date;
  updatedAt: Date;
};

// 创建Prisma客户端实例
const prisma = new PrismaClient();

// 定义表结构类型
interface TableStructure {
  name: string;
  columns: any[];
}

/**
 * 元数据服务类，处理数据源的元数据管理
 */
class MetadataService {
  /**
   * 同步数据源的元数据
   * @param dataSourceId 数据源ID
   * @param options 同步选项
   * @returns 同步结果
   */
  async syncMetadata(
    dataSourceId: string,
    options: { 
      syncType?: 'FULL' | 'INCREMENTAL';
      schemaPattern?: string;
      tablePattern?: string;
    } = {}
  ): Promise<{
    tablesCount: number;
    viewsCount: number;
    syncHistoryId: string;
    lastSyncTime: string;
  }> {
    const syncType = options.syncType || 'FULL';
    let syncHistoryId: string | null = null;
    let tablesCount = 0;
    let viewsCount = 0;
    
    try {
      // 创建同步历史记录
      const syncHistory = await prisma.metadataSyncHistory.create({
        data: {
          dataSourceId,
          status: 'RUNNING',
          startTime: new Date(),
          syncType,
          createdBy: 'system'
        },
      });
      
      syncHistoryId = syncHistory.id;
      logger.info(`开始同步数据源元数据 [${dataSourceId}], 同步历史ID: ${syncHistoryId}`);
      
      // 获取数据源连接器
      const connector = await DatabaseConnectorFactory.createConnectorFromDataSourceId(dataSourceId);
      
      // 获取元数据结构
      const structure = await this.getStructure(dataSourceId);
      
      // 保存元数据结构到数据库
      // 使用Prisma查询代替原始SQL查询
      const existingMetadata = await prisma.metadata.findFirst({
        where: { dataSourceId }
      });
      
      const structureJson = JSON.stringify(structure);
      
      if (existingMetadata) {
        // 更新现有记录
        await prisma.metadata.update({
          where: { id: existingMetadata.id },
          data: {
            structure: structureJson,
            updatedAt: new Date()
          }
        });
        logger.debug(`更新元数据记录 ID: ${existingMetadata.id}`);
      } else {
        // 创建新记录
        const metadataId = uuidv4();
        await prisma.metadata.create({
          data: {
            id: metadataId,
            dataSourceId,
            structure: structureJson,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
        logger.debug(`创建新元数据记录 ID: ${metadataId}`);
      }
      
      // 关闭连接
      await connector.disconnect();
      
      // 更新同步历史记录
      const endTime = new Date();
      const duration = endTime.getTime() - syncHistory.startTime.getTime();
      
      tablesCount = structure.tables ? structure.tables.length : 0;
      
      await prisma.metadataSyncHistory.update({
        where: { id: syncHistoryId },
        data: {
          status: 'COMPLETED',
          endTime,
          duration,
          tablesCount,
          viewsCount
        }
      });
      
      // 更新数据源的最后同步时间和状态
      const dataSourceService = (await import('./datasource.service')).default;
      await dataSourceService.updateDataSource(dataSourceId, {
        lastSyncTime: endTime,
        status: 'ACTIVE'
      });
      
      logger.info(`同步数据源 ${dataSourceId} 的元数据成功, 共同步了 ${tablesCount} 张表，最后同步时间已更新为 ${endTime.toISOString()}`);
      
      return {
        tablesCount,
        viewsCount,
        syncHistoryId,
        lastSyncTime: endTime.toISOString()
      };
    } catch (error: any) {
      logger.error(`同步数据源 ${dataSourceId} 的元数据失败`, { error });
      
      // 更新同步历史记录为失败状态
      if (syncHistoryId) {
        try {
          await prisma.metadataSyncHistory.update({
            where: { id: syncHistoryId },
            data: {
              status: 'FAILED',
              endTime: new Date(),
              errorMessage: error.message
            }
          });
        } catch (err) {
          logger.error('更新同步历史记录失败', { err });
        }
      }
      
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`同步元数据失败: ${error.message}`, 500);
    }
  }

  /**
   * 获取元数据同步历史
   * @param dataSourceId 数据源ID
   * @param limit 记录数限制
   * @param offset 偏移量
   * @returns 标准格式的分页响应
   */
  async getSyncHistory(
    dataSourceId: string,
    limit: number = 10,
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
      // 获取同步历史记录
      const history = await prisma.metadataSyncHistory.findMany({
        where: { dataSourceId },
        orderBy: { startTime: 'desc' },
        take: limit,
        skip: offset
      });
      
      // 获取总记录数
      const total = await prisma.metadataSyncHistory.count({
        where: { dataSourceId }
      });
      
      // 转换为页码
      const { page, pageSize } = offsetToPage(offset, limit);
      
      // 返回标准格式的分页响应
      return createPaginatedResponse(history, total, page, pageSize);
    } catch (error: any) {
      logger.error(`获取数据源 ${dataSourceId} 的元数据同步历史失败`, { error });
      throw new ApiError(`获取元数据同步历史失败: ${error.message}`, 500);
    }
  }

  /**
   * 预览表数据
   * @param dataSourceId 数据源ID
   * @param schemaName 模式名
   * @param tableName 表名
   * @param limit 记录数限制
   * @returns 表数据预览
   */
  async previewTableData(
    dataSourceId: string,
    schemaName: string,
    tableName: string,
    limit: number = 100
  ): Promise<any> {
    try {
      // 创建连接器
      const connector = await DatabaseConnectorFactory.createConnectorFromDataSourceId(dataSourceId);
      
      // 构建查询
      let query = `SELECT * FROM `;
      if (schemaName && schemaName !== 'public') {
        query += `"${schemaName}"."${tableName}"`;
      } else {
        query += `"${tableName}"`;
      }
      query += ` LIMIT ${limit}`;
      
      // 执行查询
      const result = await connector.executeQuery(query);
      
      // 关闭连接
      await connector.disconnect();
      
      return result;
    } catch (error: any) {
      logger.error(`预览表 ${tableName} 数据失败`, { error });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`预览表数据失败: ${error.message}`, 500);
    }
  }

  /**
   * 获取表结构列表
   * @param dataSourceId 数据源ID
   * @returns 表结构列表
   */
  async getTableList(dataSourceId: string): Promise<any[]> {
    try {
      // 与getTables方法类似，但返回格式不同
      const tablesResponse = await this.getTables(dataSourceId);
      // 直接返回items数组，而不是完整的分页响应对象
      return tablesResponse.items;
    } catch (error: any) {
      logger.error(`获取数据源 ${dataSourceId} 的表结构列表失败`, { error });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`获取表结构列表失败: ${error.message}`, 500);
    }
  }

  /**
   * 获取表结构
   * @param dataSourceId 数据源ID
   * @param tableName 表名
   * @returns 表结构
   */
  async getTableStructure(dataSourceId: string, tableName: string): Promise<any> {
    try {
      // 获取表列信息
      const columns = await this.getColumns(dataSourceId, tableName);
      
      // 获取数据源信息
      const dataSource = await prisma.dataSource.findUnique({
        where: { id: dataSourceId }
      });
      
      if (!dataSource) {
        throw new ApiError(`数据源 ${dataSourceId} 不存在`, 404);
      }
      
      return {
        name: tableName,
        schema: 'public',
        columns: columns
      };
    } catch (error: any) {
      logger.error(`获取数据源 ${dataSourceId} 表 ${tableName} 的结构失败`, { error });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`获取表结构失败: ${error.message}`, 500);
    }
  }

  /**
   * 获取数据源的表列表
   * @param dataSourceId 数据源ID
   * @param options 分页选项
   * @returns 标准格式的分页响应
   */
  async getTables(
    dataSourceId: string,
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
      logger.debug(`获取数据源 ${dataSourceId} 的表列表`);
      
      // 处理分页参数
      const limit = options?.limit || options?.size || 10;
      const offset = options?.offset !== undefined ? options.offset : 
                    (options?.page ? (options.page - 1) * limit : 0);
      const page = options?.page || Math.floor(offset / limit) + 1;
      
      // 从元数据中获取表列表
      let tables: any[] = [];
      
      // 尝试从元数据中获取表列表
      const metadata = await prisma.metadata.findFirst({
        where: { dataSourceId }
      });
      
      if (metadata) {
        // 从保存的元数据中提取表信息
        try {
          const structure = JSON.parse(metadata.structure);
          if (structure && structure.tables) {
            tables = structure.tables.map((table: any) => ({
              name: table.name,
              columnsCount: Array.isArray(table.columns) ? table.columns.length : 0,
              createdAt: metadata.createdAt,
              updatedAt: metadata.updatedAt
            }));
          }
        } catch (error) {
          logger.error('解析元数据结构失败', { error, dataSourceId });
        }
      }
      
      // 如果元数据中没有表信息，则尝试从数据库中获取
      if (tables.length === 0) {
        // 获取数据源连接器
        const connector = await DatabaseConnectorFactory.createConnectorFromDataSourceId(dataSourceId);
        
        // 获取表列表
        const result = await connector.getTables();
        
        // 关闭连接
        await connector.disconnect();
        
        tables = result;
      }
      
      // 获取表的总数
      const total = tables.length;
      
      // 应用分页
      const paginatedTables = tables.slice(offset, offset + limit);
      
      // 返回标准格式的分页响应
      return createPaginatedResponse(paginatedTables, total, page, limit);
    } catch (error: any) {
      logger.error(`获取数据源 ${dataSourceId} 的表列表失败`, { error });
      throw new ApiError(`获取表列表失败: ${error.message}`, 500);
    }
  }

  /**
   * 获取表的列信息
   * @param dataSourceId 数据源ID
   * @param tableName 表名
   * @returns 列定义数组
   */
  async getColumns(dataSourceId: string, tableName: string): Promise<any[]> {
    try {
      // 创建连接器
      const connector = await DatabaseConnectorFactory.createConnectorFromDataSourceId(dataSourceId);
      
      // 使用getTableStructure方法替代直接调用getColumns
      const tableStructure = await connector.getTableStructure(tableName);
      const columns = tableStructure.columns || [];
      
      // 关闭连接
      await connector.disconnect();
      
      logger.info(`获取到数据源 ${dataSourceId} 表 ${tableName} 的列信息，共 ${columns.length} 列`);
      
      return columns;
    } catch (error: any) {
      logger.error(`获取表 ${tableName} 的列定义失败`, { error });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`获取表列定义失败: ${error.message}`, 500);
    }
  }

  /**
   * 获取数据源的元数据结构
   * @param dataSourceId 数据源ID
   * @returns 元数据结构
   */
  async getStructure(dataSourceId: string): Promise<{
    databaseName: string;
    tables: TableStructure[];
  }> {
    try {
      logger.info(`获取数据源 ${dataSourceId} 的元数据结构`);
      
      // 获取数据源信息
      const dataSource = await prisma.dataSource.findUnique({
        where: { id: dataSourceId }
      });
      
      if (!dataSource) {
        throw new ApiError(`数据源 ${dataSourceId} 不存在`, 404);
      }
      
      // 创建连接器
      const connector = await DatabaseConnectorFactory.createConnectorFromDataSourceId(dataSourceId);
      
      // 获取表列表
      const tables = await connector.getTables();
      
      // 获取每个表的列信息
      const result: {
        databaseName: string;
        tables: TableStructure[];
      } = {
        databaseName: dataSource.databaseName,
        tables: []
      };
      
      for (const table of tables) {
        try {
          // 使用getTableStructure方法替代直接调用getColumns
          const tableStructure = await connector.getTableStructure(table.name);
          const columns = tableStructure.columns || [];
          
          // 添加到表中
          result.tables.push({
            name: table.name,
            columns: columns
          });
        } catch (tableError) {
          logger.warn(`获取表 ${table.name} 的结构失败`, { tableError });
        }
      }
      
      // 关闭连接
      await connector.disconnect();
      
      logger.info(`获取到数据源 ${dataSourceId} 的元数据结构，共 ${tables.length} 张表`);
      
      return result;
    } catch (error: any) {
      logger.error(`获取数据源 ${dataSourceId} 的元数据结构失败`, { error });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`获取元数据结构失败: ${error.message}`, 500);
    }
  }

  /**
   * 从保存的元数据记录中获取结构
   * @param dataSourceId 数据源ID
   * @returns 元数据结构
   */
  async getMetadataStructure(dataSourceId: string): Promise<any> {
    try {
      // 使用Prisma查询代替原始SQL查询
      const metadata = await prisma.metadata.findFirst({
        where: { dataSourceId },
        orderBy: { updatedAt: 'desc' }
      });
      
      if (!metadata) {
        logger.info(`数据源 ${dataSourceId} 无元数据记录，尝试实时获取`);
        return await this.getStructure(dataSourceId);
      }
      
      try {
        return JSON.parse(metadata.structure);
      } catch (parseError) {
        logger.error(`解析元数据结构失败`, { dataSourceId, parseError });
        throw new ApiError('元数据结构格式无效', 500);
      }
    } catch (error: any) {
      logger.error(`获取元数据结构失败`, { dataSourceId, error });
      
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`获取元数据结构失败: ${error.message}`, 500);
    }
  }

  /**
   * 获取数据源的统计信息
   * @param dataSourceId 数据源ID
   * @returns 数据源统计信息
   */
  async getStats(dataSourceId: string): Promise<{
    tableCount: number;
    viewCount: number;
    totalSize?: string;
    lastSyncAt?: Date;
  }> {
    try {
      logger.info(`获取数据源 ${dataSourceId} 的统计信息`);
      
      // 检查数据源是否存在
      const dataSource = await dataSourceService.getDataSourceById(dataSourceId);
      if (!dataSource) {
        throw new ApiError(`数据源 ${dataSourceId} 不存在`, 404);
      }
      
      // 获取最后同步时间
      const lastSync = await prisma.metadataSyncHistory.findFirst({
        where: { 
          dataSourceId,
          status: 'COMPLETED'
        },
        orderBy: {
          endTime: 'desc'
        }
      });
      
      let tableCount = 0;
      let viewCount = 0;
      let totalSize: string | undefined = undefined;
      
      // 直接从数据库获取表计数
      try {
        const connector = await DatabaseConnectorFactory.createConnectorFromDataSourceId(dataSourceId);
        const tables = await connector.getTables();
        
        if (Array.isArray(tables)) {
          // 计算表和视图数量，确保tables是数组并且每个表项都有type属性
          tableCount = tables.filter((table: any) => 
            table.type === 'TABLE' || !table.type
          ).length;
          
          viewCount = tables.filter((table: any) => 
            table.type === 'VIEW'
          ).length;
        }
        
        // 尝试获取数据库大小 - 需要确保connector有此方法
        if (typeof (connector as any).getDatabaseSize === 'function') {
          totalSize = await (connector as any).getDatabaseSize();
        }
        
        await connector.disconnect();
      } catch (error: any) {
        logger.error(`从数据库获取表计数失败: ${error.message}`);
        // 失败时不抛出错误，返回0计数
      }
      
      return {
        tableCount,
        viewCount,
        totalSize,
        lastSyncAt: lastSync?.endTime || undefined
      };
    } catch (error: any) {
      logger.error(`获取数据源 ${dataSourceId} 的统计信息失败`, { error });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`获取数据源统计信息失败: ${error.message}`, 500);
    }
  }
}

// 创建实例导出，使其可以在其他文件中使用
const metadataService = new MetadataService();
export default metadataService;