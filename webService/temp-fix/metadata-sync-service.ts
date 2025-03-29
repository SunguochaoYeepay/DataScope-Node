/**
 * 元数据同步服务
 * 负责将数据源的表结构等元数据同步到系统中
 */
export class MetadataSyncService {
  /**
   * 同步数据源的元数据
   * @param dataSourceId 数据源ID
   * @param fullSync 是否进行全量同步
   */
  async syncMetadata(dataSourceId: string, fullSync: boolean = false): Promise<any> {
    // 创建同步历史记录
    const syncHistory = await prisma.metadataSyncHistory.create({
      data: {
        dataSourceId,
        status: 'RUNNING',
        startTime: new Date(),
        syncType: fullSync ? 'FULL' : 'INCREMENTAL'
      }
    });
    
    const startTime = Date.now();
    let tablesCount = 0;
    let viewsCount = 0;
    let relationshipsCount = 0; // 添加关系计数
    let errorMessage: string | null = null;
    
    try {
      // 获取数据源信息
      const dataSource = await dataSourceService.getDataSourceById(dataSourceId);
      if (!dataSource) {
        throw new Error('数据源不存在');
      }
      
      // 更新数据源状态为同步中
      await dataSourceService.updateDataSourceStatus(dataSourceId, 'SYNCING');
      
      // 获取数据源连接器
      const connector = await dataSourceService.getConnector(dataSourceId);
      
      // 获取所有schema
      const schemas = await connector.getSchemas();
      
      // 对每个schema同步元数据
      for (const schemaName of schemas) {
        // 获取或创建schema记录
        const schema = await this.getOrCreateSchema(dataSourceId, schemaName);
        
        // 同步表
        const { tables, views, relationships } = await this.syncTables(connector, schema.id, schemaName, fullSync);
        tablesCount += tables;
        viewsCount += views;
        relationshipsCount += relationships;
      }
      
      // 更新最后同步时间
      await dataSourceService.updateDataSource(dataSourceId, {
        lastSyncTime: new Date(),
        status: 'ACTIVE'
      });
      
      // 成功完成同步
      await this.updateSyncHistory(syncHistory.id, {
        status: 'COMPLETED',
        tablesCount,
        viewsCount,
        relationshipsCount,
        endTime: new Date(),
        duration: Date.now() - startTime
      });
      
      return {
        success: true,
        syncId: syncHistory.id,
        tablesCount,
        viewsCount,
        relationshipsCount,
        duration: Date.now() - startTime
      };
    } catch (error: any) {
      // 发生错误
      errorMessage = error?.message || '未知错误';
      logger.error('元数据同步失败', { error, dataSourceId });
      
      // 更新数据源状态为错误
      await dataSourceService.updateDataSourceStatus(dataSourceId, 'ERROR');
      
      // 更新同步历史
      await this.updateSyncHistory(syncHistory.id, {
        status: 'FAILED',
        tablesCount,
        viewsCount,
        relationshipsCount,
        errorMessage,
        endTime: new Date(),
        duration: Date.now() - startTime
      });
      
      throw error;
    }
  }
  
  /**
   * 更新同步历史记录
   */
  private async updateSyncHistory(id: string, data: any): Promise<void> {
    await prisma.metadataSyncHistory.update({
      where: { id },
      data
    });
  }
  
  /**
   * 获取或创建Schema记录
   */
  private async getOrCreateSchema(dataSourceId: string, schemaName: string): Promise<any> {
    // 尝试查找已存在的schema
    const existingSchema = await prisma.schema.findFirst({
      where: {
        dataSourceId,
        name: schemaName
      }
    });
    
    if (existingSchema) {
      return existingSchema;
    }
    
    // 创建新schema
    return await prisma.schema.create({
      data: {
        dataSourceId,
        name: schemaName,
        description: `Schema ${schemaName}`
      }
    });
  }
  
  /**
   * 同步指定schema的表
   */
  private async syncTables(
    connector: DatabaseConnector, 
    schemaId: string, 
    schemaName: string, 
    fullSync: boolean
  ): Promise<{ tables: number; views: number; relationships: number }> {
    let tablesCount = 0;
    let viewsCount = 0;
    let relationshipsCount = 0;
    
    // 获取所有表
    const tables = await connector.getTables(schemaName);
    
    // 如果是全量同步，先删除现有的表记录
    if (fullSync) {
      await prisma.table.deleteMany({
        where: { schemaId }
      });
    }
    
    // 同步每个表
    for (const tableInfo of tables) {
      try {
        const tableType = tableInfo.type.toUpperCase();
        const isView = tableType === 'VIEW';
        
        // 创建表记录
        const table = await prisma.table.create({
          data: {
            schemaId,
            name: tableInfo.name,
            description: tableInfo.description || `${isView ? 'View' : 'Table'} ${tableInfo.name}`,
            type: tableType
          }
        });
        
        // 同步列
        await this.syncColumns(connector, table.id, schemaName, tableInfo.name);
        
        // 更新计数
        if (isView) {
          viewsCount++;
        } else {
          tablesCount++;
        }
      } catch (error) {
        logger.error(`同步表 ${tableInfo.name} 失败`, { error, schemaId, schemaName });
        // 继续同步其他表
      }
    }
    
    // 同步表关系
    if (!fullSync) {
      // 只有在增量同步时才需要检查，全量同步已经清空了表
      await this.cleanupOrphanedTables(schemaId, tables.map(t => t.name));
    }
    
    // 分析并创建表关系
    const relationships = await this.analyzeTableRelationships(connector, schemaId, schemaName);
    relationshipsCount = relationships.length;
    
    return { tables: tablesCount, views: viewsCount, relationships: relationshipsCount };
  }
}