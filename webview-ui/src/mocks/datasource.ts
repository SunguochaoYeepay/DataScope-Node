import type { DataSource, DataSourceType, DataSourceStatus, SyncFrequency } from '@/types/datasource'
import type { TableMetadata, ColumnMetadata, TableRelationship } from '@/types/metadata'

// 生成随机ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// 获取随机日期（最近30天内）
const getRandomDate = (days = 30) => {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * days))
  return date.toISOString()
}

// 模拟数据源数据
const mockDataSources: DataSource[] = [
  {
    id: generateId(),
    name: 'MySQL 产品数据库',
    description: '存储产品信息的MySQL数据库',
    type: 'MYSQL',
    host: 'db-mysql-product.example.com',
    port: 3306,
    databaseName: 'product_db',
    username: 'product_user',
    status: 'ACTIVE',
    syncFrequency: 'DAILY',
    lastSyncTime: getRandomDate(2),
    createdAt: getRandomDate(60),
    updatedAt: getRandomDate(1)
  },
  {
    id: generateId(),
    name: 'PostgreSQL 用户数据库',
    description: '存储用户信息的PostgreSQL数据库',
    type: 'POSTGRESQL',
    host: 'db-pg-user.example.com',
    port: 5432,
    databaseName: 'user_db',
    username: 'user_admin',
    status: 'ACTIVE',
    syncFrequency: 'WEEKLY',
    lastSyncTime: getRandomDate(5),
    createdAt: getRandomDate(90),
    updatedAt: getRandomDate(5)
  },
  {
    id: generateId(),
    name: 'Oracle 财务数据库',
    description: '存储财务信息的Oracle数据库',
    type: 'ORACLE',
    host: 'db-oracle-finance.example.com',
    port: 1521,
    databaseName: 'finance_db',
    username: 'finance_user',
    status: 'INACTIVE',
    syncFrequency: 'MANUAL',
    lastSyncTime: getRandomDate(30),
    createdAt: getRandomDate(120),
    updatedAt: getRandomDate(30)
  },
  {
    id: generateId(),
    name: 'SQL Server 销售数据库',
    description: '存储销售信息的SQL Server数据库',
    type: 'SQLSERVER',
    host: 'db-mssql-sales.example.com',
    port: 1433,
    databaseName: 'sales_db',
    username: 'sales_user',
    status: 'ERROR',
    syncFrequency: 'DAILY',
    lastSyncTime: getRandomDate(7),
    createdAt: getRandomDate(150),
    updatedAt: getRandomDate(7)
  },
  {
    id: generateId(),
    name: 'MongoDB 日志数据库',
    description: '存储应用日志的MongoDB数据库',
    type: 'MONGODB',
    host: 'db-mongo-logs.example.com',
    port: 27017,
    databaseName: 'logs_db',
    username: 'logs_user',
    status: 'ACTIVE',
    syncFrequency: 'HOURLY',
    lastSyncTime: getRandomDate(1),
    createdAt: getRandomDate(45),
    updatedAt: getRandomDate(1)
  },
  {
    id: generateId(),
    name: 'Elasticsearch 搜索服务',
    description: '用于全文搜索的Elasticsearch服务',
    type: 'ELASTICSEARCH',
    host: 'es-search.example.com',
    port: 9200,
    databaseName: 'search_index',
    username: 'elastic',
    status: 'ACTIVE',
    syncFrequency: 'DAILY',
    lastSyncTime: getRandomDate(1),
    createdAt: getRandomDate(30),
    updatedAt: getRandomDate(1)
  }
]

// 获取数据库产品名称
const getDatabaseProductName = (type: DataSourceType): string => {
  const productNameMap: Record<DataSourceType, string> = {
    'MYSQL': 'MySQL Server',
    'POSTGRESQL': 'PostgreSQL',
    'ORACLE': 'Oracle Database',
    'SQLSERVER': 'Microsoft SQL Server',
    'MONGODB': 'MongoDB',
    'ELASTICSEARCH': 'Elasticsearch'
  }
  
  return productNameMap[type] || type
}

// 生成模拟数据库列
const generateMockColumns = (count: number, tableType: string): ColumnMetadata[] => {
  const columns: ColumnMetadata[] = []
  
  // 始终添加ID列作为主键
  columns.push({
    name: 'id',
    type: 'INT',
    nullable: false,
    primaryKey: true,
    foreignKey: false,
    unique: true,
    autoIncrement: true,
    comment: '主键ID'
  })
  
  // 添加创建时间和更新时间列
  columns.push({
    name: 'created_at',
    type: 'TIMESTAMP',
    nullable: true,
    primaryKey: false,
    foreignKey: false,
    unique: false,
    autoIncrement: false,
    defaultValue: 'CURRENT_TIMESTAMP',
    comment: '创建时间'
  })
  
  columns.push({
    name: 'updated_at',
    type: 'TIMESTAMP',
    nullable: true,
    primaryKey: false,
    foreignKey: false,
    unique: false,
    autoIncrement: false,
    defaultValue: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
    comment: '更新时间'
  })
  
  // 生成一些随机列
  const columnTypes = ['VARCHAR', 'INT', 'DECIMAL', 'TEXT', 'BOOLEAN', 'DATE', 'TIMESTAMP']
  const columnNamePrefixes = ['name', 'desc', 'code', 'status', 'amount', 'price', 'count', 'date', 'user', 'type']
  
  for (let i = 0; i < count - 3; i++) { // -3 是因为已经添加了3个列
    const type = columnTypes[Math.floor(Math.random() * columnTypes.length)]
    const prefix = columnNamePrefixes[Math.floor(Math.random() * columnNamePrefixes.length)]
    const suffix = Math.floor(Math.random() * 100)
    
    const column: ColumnMetadata = {
      name: `${prefix}_${suffix}`,
      type: type,
      nullable: Math.random() > 0.3, // 70%可为空
      primaryKey: false,
      foreignKey: Math.random() > 0.9, // 10%是外键
      unique: Math.random() > 0.9, // 10%是唯一
      autoIncrement: false
    }
    
    if (type === 'VARCHAR') {
      column.size = Math.floor(Math.random() * 200) + 50
    } else if (type === 'DECIMAL') {
      column.size = 10
      column.scale = 2
    }
    
    if (column.foreignKey) {
      column.referencedTable = `table_${Math.floor(Math.random() * 10)}`
      column.referencedColumn = 'id'
    }
    
    columns.push(column)
  }
  
  return columns
}

// 生成模拟数据库表
const generateMockTables = (count: number, dbType: DataSourceType): TableMetadata[] => {
  const tables: TableMetadata[] = []
  const tableNames = [
    'users', 'products', 'orders', 'customers', 'invoices',
    'payments', 'categories', 'inventory', 'suppliers', 'shipping',
    'reviews', 'cart_items', 'promotions', 'employees', 'departments',
    'logs', 'settings', 'notifications', 'roles', 'permissions'
  ]
  
  // 确保不会重复
  const usedNames = new Set<string>()
  
  for (let i = 0; i < count; i++) {
    let tableName = ''
    
    // 生成唯一表名
    do {
      const nameIndex = Math.floor(Math.random() * tableNames.length)
      const suffix = Math.random() > 0.7 ? `_${Math.floor(Math.random() * 100)}` : ''
      tableName = tableNames[nameIndex] + suffix
    } while (usedNames.has(tableName))
    
    usedNames.add(tableName)
    
    const table: TableMetadata = {
      name: tableName,
      type: Math.random() > 0.2 ? 'TABLE' : 'VIEW', // 80%是表，20%是视图
      comment: `${tableName} table`,
      schema: 'public',
      catalog: dbType === 'ORACLE' ? 'SYSTEM' : undefined,
      columns: generateMockColumns(Math.floor(Math.random() * 10) + 5, tableName),
      primaryKey: ['id']
    }
    
    tables.push(table)
  }
  
  return tables
}

// 生成模拟表关系
const generateMockRelationships = (dataSource: DataSource): TableRelationship[] => {
  const relationships: TableRelationship[] = []
  
  if (!dataSource.metadata || !dataSource.metadata.tables || dataSource.metadata.tables.length < 2) {
    return relationships
  }
  
  const tables = dataSource.metadata.tables
  const relationTypes = ['ONE_TO_ONE', 'ONE_TO_MANY', 'MANY_TO_ONE', 'MANY_TO_MANY'] as const
  
  // 生成一些随机关系
  for (let i = 0; i < Math.min(tables.length * 0.7, 10); i++) {
    const sourceIndex = Math.floor(Math.random() * tables.length)
    let targetIndex
    
    do {
      targetIndex = Math.floor(Math.random() * tables.length)
    } while (targetIndex === sourceIndex)
    
    const relationType = relationTypes[Math.floor(Math.random() * relationTypes.length)]
    
    relationships.push({
      id: generateId(),
      sourceTable: tables[sourceIndex].name,
      sourceColumn: 'id',
      targetTable: tables[targetIndex].name,
      targetColumn: `${tables[sourceIndex].name.slice(0, -1)}_id`,
      relationType,
      isForeignKey: Math.random() > 0.3,
      name: `${tables[sourceIndex].name}_${tables[targetIndex].name}_relation`,
      description: `Relationship between ${tables[sourceIndex].name} and ${tables[targetIndex].name}`
    })
  }
  
  return relationships
}

// 模拟数据源API
export const mockDataSourceApi = {
  // 获取数据源列表
  async getDataSources(params: any) {
    const { page = 1, size = 10, name, type, status } = params

    // 过滤数据源
    let filteredSources = [...mockDataSources]
    if (name) {
      filteredSources = filteredSources.filter(ds => ds.name.toLowerCase().includes(name.toLowerCase()))
    }
    if (type) {
      filteredSources = filteredSources.filter(ds => ds.type === type)
    }
    if (status) {
      filteredSources = filteredSources.filter(ds => ds.status === status)
    }

    // 计算分页
    const start = (page - 1) * size
    const end = start + size
    const items = filteredSources.slice(start, end)

    return {
      items,
      total: filteredSources.length,
      page,
      size,
      totalPages: Math.ceil(filteredSources.length / size)
    }
  },

  // 获取单个数据源
  async getDataSource(id: string) {
    const dataSource = mockDataSources.find(ds => ds.id === id)
    if (!dataSource) {
      throw new Error(`数据源 ${id} 不存在`)
    }
    return dataSource
  },

  // 创建数据源
  async createDataSource(data: any) {
    const newDataSource: DataSource = {
      id: generateId(),
      name: data.name,
      description: data.description || '',
      type: data.type as DataSourceType,
      host: data.host,
      port: data.port,
      databaseName: data.database || data.databaseName || '',
      username: data.username,
      status: 'ACTIVE' as DataSourceStatus,
      syncFrequency: (data.syncFrequency || 'MANUAL') as SyncFrequency,
      lastSyncTime: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockDataSources.push(newDataSource)
    return newDataSource
  },

  // 更新数据源
  async updateDataSource(params: any) {
    const index = mockDataSources.findIndex(ds => ds.id === params.id)
    if (index === -1) {
      throw new Error(`数据源 ${params.id} 不存在`)
    }

    const updatedDataSource = {
      ...mockDataSources[index],
      ...params,
      updatedAt: new Date().toISOString()
    }
    mockDataSources[index] = updatedDataSource
    return updatedDataSource
  },

  // 删除数据源
  async deleteDataSource(id: string) {
    const index = mockDataSources.findIndex(ds => ds.id === id)
    if (index === -1) {
      throw new Error(`数据源 ${id} 不存在`)
    }
    mockDataSources.splice(index, 1)
  },

  // 测试连接
  async testConnection(data: any) {
    // 模拟连接测试
    await new Promise(resolve => setTimeout(resolve, 1000))
    return true
  },

  // 同步元数据
  async syncMetadata(params: any) {
    // 模拟同步过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    return {
      success: true,
      message: '元数据同步成功',
      tablesCount: 10,
      viewsCount: 2,
      syncDuration: 2000,
      lastSyncTime: new Date().toISOString()
    }
  },

  /**
   * 获取表元数据
   */
  async getTableMetadata(dataSourceId: string, tableName?: string): Promise<TableMetadata[]> {
    // 获取数据源
    const dataSource = await this.getDataSource(dataSourceId);
    
    if (!dataSource) {
      throw new Error(`找不到ID为${dataSourceId}的数据源`);
    }
    
    // 如果数据源没有元数据，创建模拟元数据
    if (!dataSource.metadata || !dataSource.metadata.tables || dataSource.metadata.tables.length < 2) {
      const dbType = dataSource.type as DataSourceType;
      console.log(`为数据源${dataSource.name}生成模拟表元数据`);
      
      // 生成或使用现有表
      const tables = dataSource.metadata?.tables || generateMockTables(15, dbType);
      
      // 如果指定了表名，返回单个表
      if (tableName) {
        const table = tables.find((t: TableMetadata) => t.name === tableName);
        return table ? [table] : [];
      }
      
      // 否则返回所有表
      return tables;
    }
    
    // 返回已有元数据
    if (tableName) {
      const table = dataSource.metadata.tables.find((t: TableMetadata) => t.name === tableName);
      return table ? [table] : [];
    }
    
    return dataSource.metadata.tables;
  },

  // 获取表字段信息
  async getTableColumns(dataSourceId: string, tableName: string) {
    return generateMockColumns(10, tableName)
  },

  // 获取表关系
  async getTableRelationships(dataSourceId: string) {
    const dataSource = await this.getDataSource(dataSourceId)
    return generateMockRelationships(dataSource)
  },

  // 获取表数据预览
  async getTableDataPreview(dataSourceId: string, tableName: string, params: any) {
    const { page = 1, size = 10 } = params
    const columns = await this.getTableColumns(dataSourceId, tableName)
    
    // 生成模拟数据
    const data = Array(size).fill(null).map((_, rowIndex) => {
      const row: Record<string, any> = {}
      columns.forEach(col => {
        switch (col.type) {
          case 'INT':
            row[col.name] = rowIndex + 1
            break
          case 'VARCHAR':
            row[col.name] = `${col.name}_value_${rowIndex + 1}`
            break
          case 'TIMESTAMP':
            row[col.name] = new Date(Date.now() - rowIndex * 86400000).toISOString()
            break
          default:
            row[col.name] = `${col.name}_${rowIndex + 1}`
        }
      })
      return row
    })

    return {
      data,
      columns,
      page,
      size,
      total: 100,
      totalPages: 10
    }
  },

  // 搜索元数据
  async searchMetadata(dataSourceId: string, keyword: string) {
    const tables = await this.getTableMetadata(dataSourceId)
    const results = []
    
    for (const tableName in tables) {
      if (tableName.toLowerCase().includes(keyword.toLowerCase())) {
        results.push({
          type: 'table',
          name: tableName,
          score: 1.0
        })
      }
      
      const columns = await this.getTableColumns(dataSourceId, tableName)
      for (const column of columns) {
        if (column.name.toLowerCase().includes(keyword.toLowerCase())) {
          results.push({
            type: 'column',
            table: tableName,
            name: column.name,
            score: 0.8
          })
        }
      }
    }
    
    return results
  },

  // 获取数据源统计信息
  async getDataSourceStats(id: string) {
    const dataSource = await this.getDataSource(id)
    return {
      dataSourceId: id,
      tablesCount: 100,
      viewsCount: 20,
      totalRows: 1000000,
      totalSize: '1.5 GB',
      lastUpdate: dataSource.updatedAt,
      queriesCount: 5000,
      connectionPoolSize: 10,
      activeConnections: 5,
      avgQueryTime: '100ms',
      totalTables: 100,
      totalViews: 20,
      totalQueries: 5000,
      avgResponseTime: 100,
      peakConnections: 15
    }
  }
}

export default mockDataSourceApi