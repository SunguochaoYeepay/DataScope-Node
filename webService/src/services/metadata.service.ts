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
      // 检查是否已存在元数据记录
      const existingMetadata = await prisma.$queryRaw<PrismaMetadata[]>`
        SELECT id FROM "Metadata" WHERE "dataSourceId" = ${dataSourceId} LIMIT 1
      `;
      
      const structureJson = JSON.stringify(structure);
      const now = new Date();
      
      if (existingMetadata && existingMetadata.length > 0) {
        // 更新现有记录
        await prisma.$executeRaw`
          UPDATE "Metadata"
          SET structure = ${structureJson}, "updatedAt" = ${now}
          WHERE id = ${existingMetadata[0].id}
        `;
        logger.debug(`更新元数据记录 ID: ${existingMetadata[0].id}`);
      } else {
        // 创建新记录
        const metadataId = uuidv4();
        await prisma.$executeRaw`
          INSERT INTO "Metadata" (id, "dataSourceId", structure, "createdAt", "updatedAt")
          VALUES (${metadataId}, ${dataSourceId}, ${structureJson}, ${now}, ${now})
        `;
        logger.debug(`创建新元数据记录 ID: ${metadataId}`);
      }
      
      // 关闭连接
      await connector.close();
      
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
      
      logger.info(`同步数据源 ${dataSourceId} 的元数据成功, 共同步了 ${tablesCount} 张表`);
      
      return {
        tablesCount,
        viewsCount,
        syncHistoryId
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
   * @returns 同步历史记录
   */
  async getSyncHistory(
    dataSourceId: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<{
    history: any[];
    total: number;
    limit: number;
    offset: number;
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
      
      return {
        history,
        total,
        limit,
        offset
      };
    } catch (error: any) {
      logger.error(`获取数据源 ${dataSourceId} 的同步历史失败`, { error });
      throw new ApiError(`获取同步历史失败: ${error.message}`, 500);
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
      await connector.close();
      
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
      const tables = await this.getTables(dataSourceId);
      return tables;
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
   * @returns 表名列表
   */
  async getTables(dataSourceId: string): Promise<any[]> {
    try {
      logger.info(`获取数据源 ${dataSourceId} 的表列表`);
      
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
      
      // 关闭连接
      await connector.close();
      
      logger.info(`获取到数据源 ${dataSourceId} 的表列表，共 ${tables.length} 张表`);
      
      // 格式化返回结果
      return tables.map(tableName => ({
        name: tableName,
        type: 'TABLE',
        schema: 'public'
      }));
    } catch (error: any) {
      logger.error(`获取数据源 ${dataSourceId} 的表列表失败`, { error });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`获取表列表失败: ${error.message}`, 500);
    }
  }

  /**
   * 获取表的列信息
   * @param dataSourceId 数据源ID
   * @param tableName 表名
   * @returns 列信息列表
   */
  async getColumns(dataSourceId: string, tableName: string): Promise<any[]> {
    try {
      logger.info(`获取数据源 ${dataSourceId} 表 ${tableName} 的列信息`);
      
      // 创建连接器
      const connector = await DatabaseConnectorFactory.createConnectorFromDataSourceId(dataSourceId);
      
      // 获取列信息
      const columns = await connector.getColumns(tableName);
      
      // 关闭连接
      await connector.close();
      
      logger.info(`获取到数据源 ${dataSourceId} 表 ${tableName} 的列信息，共 ${columns.length} 列`);
      
      return columns;
    } catch (error: any) {
      logger.error(`获取数据源 ${dataSourceId} 表 ${tableName} 的列信息失败`, { error });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`获取列信息失败: ${error.message}`, 500);
    }
  }

  /**
   * 获取数据源的元数据结构
   * @param dataSourceId 数据源ID
   * @returns 元数据结构
   */
  async getStructure(dataSourceId: string): Promise<any> {
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
      const tablesWithColumns = await Promise.all(
        tables.map(async (tableName: string) => {
          const columns = await connector.getColumns(tableName);
          return {
            name: tableName,
            columns: columns
          };
        })
      );
      
      // 关闭连接
      await connector.close();
      
      logger.info(`获取到数据源 ${dataSourceId} 的元数据结构，共 ${tables.length} 张表`);
      
      return {
        databaseName: dataSource.databaseName,
        tables: tablesWithColumns
      };
    } catch (error: any) {
      logger.error(`获取数据源 ${dataSourceId} 的元数据结构失败`, { error });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`获取元数据结构失败: ${error.message}`, 500);
    }
  }

  /**
   * 获取元数据结构
   * @param dataSourceId 数据源ID
   * @returns 元数据结构
   */
  async getMetadataStructure(dataSourceId: string): Promise<any> {
    try {
      // 从数据库中获取保存的元数据结构
      const metadata = await prisma.$queryRaw<PrismaMetadata[]>`
        SELECT structure FROM "Metadata" 
        WHERE "dataSourceId" = ${dataSourceId}
        ORDER BY "updatedAt" DESC
        LIMIT 1
      `;
      
      if (metadata && metadata.length > 0 && metadata[0].structure) {
        // 解析存储的结构
        return JSON.parse(metadata[0].structure);
      }
      
      // 如果没有找到存储的元数据，则实时获取
      return await this.getStructure(dataSourceId);
    } catch (error: any) {
      logger.error(`获取数据源 ${dataSourceId} 的元数据结构失败`, { error });
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
        
        await connector.close();
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