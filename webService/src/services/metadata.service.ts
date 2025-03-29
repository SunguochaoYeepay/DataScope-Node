/**
 * 元数据服务
 * 
 * 负责从数据源同步元数据，包括数据库结构、表、列和关系
 */
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/error';
import dataSourceService from './datasource.service';
import logger from '../utils/logger';

const prisma = new PrismaClient();

export class MetadataService {
  /**
   * 同步数据源元数据
   * 
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
        },
      });
      
      syncHistoryId = syncHistory.id;
      logger.info(`开始同步数据源元数据 [${dataSourceId}], 同步历史ID: ${syncHistoryId}`);
      
      // 获取数据源连接器
      const connector = await dataSourceService.getConnector(dataSourceId);
      
      // 1. 先获取数据库架构列表
      const schemas = await connector.getSchemas();
      logger.info(`发现 ${schemas.length} 个数据库架构: ${schemas.join(', ')}`);
      
      for (const schemaName of schemas) {
        // 检查schema名称是否匹配模式
        if (options.schemaPattern && !new RegExp(options.schemaPattern).test(schemaName)) {
          logger.debug(`跳过架构: ${schemaName}, 不符合模式: ${options.schemaPattern}`);
          continue;
        }
        
        // 2. 创建或更新Schema记录
        let schema = await prisma.schema.findFirst({
          where: {
            dataSourceId,
            name: schemaName,
          },
        });
        
        if (!schema) {
          schema = await prisma.schema.create({
            data: {
              dataSourceId,
              name: schemaName,
              description: `${schemaName} 架构`,
            },
          });
          logger.debug(`创建新架构: ${schemaName}, ID: ${schema.id}`);
        } else {
          schema = await prisma.schema.update({
            where: { id: schema.id },
            data: {
              updatedAt: new Date(),
              nonce: { increment: 1 },
            },
          });
          logger.debug(`更新现有架构: ${schemaName}, ID: ${schema.id}`);
        }
        
        // 3. 获取表列表
        const tables = await connector.getTables(schemaName);
        logger.info(`在架构 ${schemaName} 中发现 ${tables.length} 个表/视图`);
        
        for (const tableInfo of tables) {
          // 检查表名是否匹配模式
          if (options.tablePattern && !new RegExp(options.tablePattern).test(tableInfo.name)) {
            logger.debug(`跳过表: ${tableInfo.name}, 不符合模式: ${options.tablePattern}`);
            continue;
          }
          
          // 表类型 TABLE 或 VIEW
          if (tableInfo.type === 'TABLE') {
            tablesCount++;
          } else if (tableInfo.type === 'VIEW') {
            viewsCount++;
          }
          
          // 4. 创建或更新Table记录
          let table = await prisma.table.findFirst({
            where: {
              schemaId: schema.id,
              name: tableInfo.name,
            },
          });
          
          if (!table) {
            table = await prisma.table.create({
              data: {
                schemaId: schema.id,
                name: tableInfo.name,
                type: tableInfo.type || 'TABLE',
                description: tableInfo.description || `${tableInfo.name} 表`,
              },
            });
            logger.debug(`创建新表: ${tableInfo.name}, ID: ${table.id}`);
          } else {
            table = await prisma.table.update({
              where: { id: table.id },
              data: {
                type: tableInfo.type || 'TABLE',
                description: tableInfo.description || table.description,
                updatedAt: new Date(),
                nonce: { increment: 1 },
              },
            });
            logger.debug(`更新现有表: ${tableInfo.name}, ID: ${table.id}`);
          }
          
          // 如果是全量同步，先删除旧的列记录
          if (syncType === 'FULL') {
            await prisma.column.deleteMany({
              where: { tableId: table.id },
            });
            logger.debug(`删除表 ${tableInfo.name} 的所有列记录`);
          }
          
          // 5. 获取表的列信息
          const columns = await connector.getColumns(schemaName, tableInfo.name);
          logger.info(`在表 ${tableInfo.name} 中发现 ${columns.length} 个列`);
          
          // 6. 获取主键信息
          const primaryKeys = await connector.getPrimaryKeys(schemaName, tableInfo.name);
          const primaryKeyNames = primaryKeys.map(pk => pk.columnName);
          
          // 7. 获取外键信息
          const foreignKeys = await connector.getForeignKeys(schemaName, tableInfo.name);
          
          // 8. 创建或更新列记录
          for (const columnInfo of columns) {
            // 判断是否为主键
            const isPrimaryKey = primaryKeyNames.includes(columnInfo.name);
            
            // 判断是否为外键
            const isForeignKey = foreignKeys.some(fk => 
              fk.columnName === columnInfo.name
            );
            
            // 创建或更新列记录
            let column = await prisma.column.findFirst({
              where: {
                tableId: table.id,
                name: columnInfo.name,
              },
            });
            
            if (!column) {
              column = await prisma.column.create({
                data: {
                  tableId: table.id,
                  name: columnInfo.name,
                  dataType: columnInfo.dataType,
                  length: columnInfo.maxLength,
                  precision: columnInfo.precision,
                  scale: columnInfo.scale,
                  nullable: columnInfo.isNullable,
                  isPrimaryKey,
                  isForeignKey,
                  defaultValue: columnInfo.defaultValue,
                  description: columnInfo.description || `${columnInfo.name} 列`,
                },
              });
              logger.debug(`创建新列: ${columnInfo.name}, ID: ${column.id}`);
            } else if (syncType === 'INCREMENTAL') {
              column = await prisma.column.update({
                where: { id: column.id },
                data: {
                  dataType: columnInfo.dataType,
                  length: columnInfo.maxLength,
                  precision: columnInfo.precision,
                  scale: columnInfo.scale,
                  nullable: columnInfo.isNullable,
                  isPrimaryKey,
                  isForeignKey,
                  defaultValue: columnInfo.defaultValue,
                  description: columnInfo.description || column.description,
                  updatedAt: new Date(),
                  nonce: { increment: 1 },
                },
              });
              logger.debug(`更新现有列: ${columnInfo.name}, ID: ${column.id}`);
            }
          }
          
          // 9. 处理外键关系
          if (syncType === 'FULL') {
            // 先删除旧的关系
            await prisma.columnRelationship.deleteMany({
              where: {
                tableRelationship: {
                  sourceTableId: table.id,
                },
              },
            });
            
            await prisma.tableRelationship.deleteMany({
              where: {
                sourceTableId: table.id,
              },
            });
            
            logger.debug(`删除表 ${tableInfo.name} 的所有关系记录`);
          }
          
          // 处理新的外键关系
          for (const fk of foreignKeys) {
            // 寻找目标表
            const targetSchemaName = fk.referencedSchema || schemaName;
            
            // 先找到目标Schema
            const targetSchema = await prisma.schema.findFirst({
              where: {
                dataSourceId,
                name: targetSchemaName,
              },
            });
            
            if (!targetSchema) {
              logger.warn(`找不到目标架构: ${targetSchemaName}, 跳过外键关系`);
              continue;
            }
            
            // 寻找目标表
            const targetTable = await prisma.table.findFirst({
              where: {
                schemaId: targetSchema.id,
                name: fk.referencedTable,
              },
            });
            
            if (!targetTable) {
              logger.warn(`找不到目标表: ${fk.referencedTable}, 跳过外键关系`);
              continue;
            }
            
            // 寻找源列和目标列
            const sourceColumn = await prisma.column.findFirst({
              where: {
                tableId: table.id,
                name: fk.columnName,
              },
            });
            
            const targetColumn = await prisma.column.findFirst({
              where: {
                tableId: targetTable.id,
                name: fk.referencedColumn,
              },
            });
            
            if (!sourceColumn || !targetColumn) {
              logger.warn(`找不到外键关系的源列或目标列, 跳过此关系`);
              continue;
            }
            
            // 创建表关系
            const tableRelationship = await prisma.tableRelationship.create({
              data: {
                sourceTableId: table.id,
                targetTableId: targetTable.id,
                type: 'MANY_TO_ONE', // 默认外键关系类型
                confidence: 1.0,
                isAutoDetected: true,
              },
            });
            
            // 创建列关系
            await prisma.columnRelationship.create({
              data: {
                tableRelationshipId: tableRelationship.id,
                sourceColumnId: sourceColumn.id,
                targetColumnId: targetColumn.id,
              },
            });
            
            logger.debug(`创建外键关系: ${fk.constraintName} (${table.name}.${sourceColumn.name} -> ${targetTable.name}.${targetColumn.name})`);
          }
        }
      }
      
      // 更新同步历史记录为完成状态
      await prisma.metadataSyncHistory.update({
        where: { id: syncHistoryId },
        data: {
          endTime: new Date(),
          status: 'COMPLETED',
          tablesCount,
          viewsCount,
        },
      });
      
      logger.info(`数据源元数据同步完成 [${dataSourceId}], 共同步了 ${tablesCount} 个表和 ${viewsCount} 个视图`);
      
      return {
        tablesCount,
        viewsCount,
        syncHistoryId,
      };
    } catch (error: any) {
      logger.error(`数据源元数据同步失败 [${dataSourceId}]`, { error });
      
      // 更新同步历史记录为失败状态
      if (syncHistoryId) {
        await prisma.metadataSyncHistory.update({
          where: { id: syncHistoryId },
          data: {
            endTime: new Date(),
            status: 'FAILED',
            errorMessage: error.message,
          },
        });
      }
      
      throw new ApiError(
        `数据源元数据同步失败: ${error.message}`,
        500,
        { dataSourceId, error: error.stack }
      );
    }
  }
  
  /**
   * 获取数据源的元数据结构
   * 
   * @param dataSourceId 数据源ID
   * @returns 元数据结构
   */
  async getMetadataStructure(dataSourceId: string): Promise<any> {
    try {
      // 获取该数据源下的所有Schema
      const schemas = await prisma.schema.findMany({
        where: {
          dataSourceId,
        },
        include: {
          tables: {
            include: {
              columns: true,
              sourceRelationships: {
                include: {
                  targetTable: true,
                  columnRelationships: {
                    include: {
                      sourceColumn: true,
                      targetColumn: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      
      if (schemas.length === 0) {
        throw new ApiError('数据源元数据未同步', 404);
      }
      
      return schemas;
    } catch (error: any) {
      logger.error('获取元数据结构失败', { error, dataSourceId });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('获取元数据结构失败', 500, { message: error?.message || '未知错误' });
    }
  }
  
  /**
   * 获取同步历史记录
   * 
   * @param dataSourceId 数据源ID
   * @param limit 限制返回数量
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
      const [history, total] = await Promise.all([
        prisma.metadataSyncHistory.findMany({
          where: { dataSourceId },
          orderBy: { startTime: 'desc' },
          take: limit,
          skip: offset,
        }),
        prisma.metadataSyncHistory.count({
          where: { dataSourceId },
        }),
      ]);
      
      return {
        history,
        total,
        limit,
        offset,
      };
    } catch (error: any) {
      logger.error('获取同步历史失败', { error, dataSourceId });
      throw new ApiError('获取同步历史失败', 500, { message: error?.message || '未知错误' });
    }
  }
  
  /**
   * 获取表数据预览
   * 
   * @param dataSourceId 数据源ID
   * @param schemaName 架构名称
   * @param tableName 表名称
   * @param limit 限制返回行数
   * @returns 表数据预览
   */
  async previewTableData(
    dataSourceId: string,
    schemaName: string,
    tableName: string,
    limit: number = 100
  ): Promise<any> {
    try {
      // 获取数据源连接器
      const connector = await dataSourceService.getConnector(dataSourceId);
      
      // 预览表数据
      return await connector.previewTableData(schemaName, tableName, limit);
    } catch (error: any) {
      logger.error('获取表数据预览失败', { error, dataSourceId, schemaName, tableName });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('获取表数据预览失败', 500, { message: error?.message || '未知错误' });
    }
  }
}

export default new MetadataService();