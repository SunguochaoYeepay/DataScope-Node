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

// 模拟 API 服务
export const mockDataSourceApi = {
  // 获取数据源列表
  getDataSources: async (params: any) => {
    const { name, type, status, page = 1, size = 10 } = params
    
    // 应用筛选条件
    let filtered = [...mockDataSources]
    
    if (name) {
      filtered = filtered.filter(ds => ds.name.toLowerCase().includes(name.toLowerCase()))
    }
    
    if (type) {
      filtered = filtered.filter(ds => ds.type === type)
    }
    
    if (status) {
      filtered = filtered.filter(ds => ds.status === status)
    }
    
    // 计算分页
    const total = filtered.length
    const totalPages = Math.ceil(total / size)
    const start = (page - 1) * size
    const end = start + size
    const items = filtered.slice(start, end)
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      items,
      total,
      page,
      size,
      totalPages
    }
  },
  
  // 获取数据源详情
  getDataSource: async (id: string) => {
    const dataSource = mockDataSources.find(ds => ds.id === id)
    
    if (!dataSource) {
      throw new Error('Data source not found')
    }
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return dataSource
  },
  
  // 创建数据源
  createDataSource: async (params: any) => {
    const newDataSource: DataSource = {
      id: generateId(),
      name: params.name,
      description: params.description || '',
      type: params.type as DataSourceType,
      host: params.host,
      port: params.port,
      databaseName: params.databaseName,
      username: params.username,
      status: 'ACTIVE' as DataSourceStatus,
      syncFrequency: params.syncFrequency as SyncFrequency,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    mockDataSources.unshift(newDataSource)
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    return newDataSource
  },
  
  // 更新数据源
  updateDataSource: async (params: any) => {
    const index = mockDataSources.findIndex(ds => ds.id === params.id)
    
    if (index === -1) {
      throw new Error('Data source not found')
    }
    
    const updatedDataSource = {
      ...mockDataSources[index],
      ...params,
      updatedAt: new Date().toISOString()
    }
    
    mockDataSources[index] = updatedDataSource
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 600))
    
    return updatedDataSource
  },
  
  // 删除数据源
  deleteDataSource: async (id: string) => {
    const index = mockDataSources.findIndex(ds => ds.id === id)
    
    if (index === -1) {
      throw new Error('Data source not found')
    }
    
    mockDataSources.splice(index, 1)
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return { success: true }
  },
  
  // 测试连接
  testConnection: async (params: any) => {
    console.log('Testing connection with params:', params)
    
    // 模拟连接成功率80%
    const success = Math.random() > 0.2
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      success,
      message: success ? '连接成功' : '连接失败: 无法连接到数据库，请检查连接参数',
      connectionInfo: success ? {
        databaseType: params.type,
        databaseVersion: '8.0.27',
        driverVersion: '8.0.25',
        pingTime: Math.floor(Math.random() * 50) + 10
      } : undefined
    }
  },
  
  // 同步元数据
  syncMetadata: async (params: { id: string }) => {
    const index = mockDataSources.findIndex(ds => ds.id === params.id)
    
    if (index === -1) {
      throw new Error('Data source not found')
    }
    
    // 模拟同步过程
    mockDataSources[index].status = 'SYNCING'
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 更新同步状态
    mockDataSources[index].status = 'ACTIVE'
    mockDataSources[index].lastSyncTime = new Date().toISOString()
    mockDataSources[index].updatedAt = new Date().toISOString()
    
    // 生成模拟元数据
    if (!mockDataSources[index].metadata) {
      mockDataSources[index].metadata = {
        tables: generateMockTables(5 + Math.floor(Math.random() * 10), mockDataSources[index].type),
        databaseVersion: '8.0.27',
        databaseProductName: getDatabaseProductName(mockDataSources[index].type),
        lastSyncTime: new Date().toISOString()
      }
    }
    
    return { 
      success: true, 
      message: '元数据同步成功',
      tablesCount: mockDataSources[index].metadata?.tables.length || 0,
      viewsCount: mockDataSources[index].metadata?.views?.length || 0,
      syncDuration: Math.floor(Math.random() * 500) + 100,
      lastSyncTime: mockDataSources[index].lastSyncTime
    }
  },
  
  // 获取数据源元数据
  getDataSourceMetadata: async (dataSourceId: string) => {
    const dataSource = mockDataSources.find(ds => ds.id === dataSourceId)
    
    if (!dataSource) {
      throw new Error('Data source not found')
    }
    
    // 如果还没有元数据，生成一些模拟数据
    if (!dataSource.metadata) {
      dataSource.metadata = {
        tables: generateMockTables(5 + Math.floor(Math.random() * 10), dataSource.type),
        databaseVersion: '8.0.27',
        databaseProductName: getDatabaseProductName(dataSource.type),
        lastSyncTime: new Date().toISOString()
      }
    }
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return dataSource.metadata
  },
  
  // 获取表元数据
  getTableMetadata: async (dataSourceId: string, tableName: string) => {
    const dataSource = mockDataSources.find(ds => ds.id === dataSourceId)
    
    if (!dataSource || !dataSource.metadata || !dataSource.metadata.tables) {
      throw new Error('Data source metadata not found')
    }
    
    const table = dataSource.metadata.tables.find(t => t.name === tableName)
    
    if (!table) {
      throw new Error('Table not found')
    }
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return table
  },
  
  // 搜索元数据
  searchMetadata: async (dataSourceId: string, term: string) => {
    const dataSource = mockDataSources.find(ds => ds.id === dataSourceId)
    
    if (!dataSource || !dataSource.metadata || !dataSource.metadata.tables) {
      return { tables: [], columns: [] }
    }
    
    const result = {
      tables: [],
      columns: []
    }
    
    if (!term) return result
    
    const searchTerm = term.toLowerCase()
    
    // 搜索表
    result.tables = dataSource.metadata.tables.filter(table => 
      table.name.toLowerCase().includes(searchTerm)
    )
    
    // 搜索列
    dataSource.metadata.tables.forEach(table => {
      table.columns.forEach(column => {
        if (column.name.toLowerCase().includes(searchTerm)) {
          result.columns.push({
            table: table.name,
            column: column.name
          })
        }
      })
    })
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return result
  },
  
  // 获取表关系
  getTableRelationships: async (dataSourceId: string) => {
    const dataSource = mockDataSources.find(ds => ds.id === dataSourceId)
    
    if (!dataSource) {
      throw new Error('Data source not found')
    }
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 生成一些模拟关系
    return generateMockRelationships(dataSource)
  },
  
  // 保存表关系
  saveTableRelationship: async (dataSourceId: string, relationship: Omit<TableRelationship, 'id'>) => {
    const dataSource = mockDataSources.find(ds => ds.id === dataSourceId)
    
    if (!dataSource) {
      throw new Error('Data source not found')
    }
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 400))
    
    return {
      ...relationship,
      id: generateId()
    } as TableRelationship
  },
  
  // 删除表关系
  deleteTableRelationship: async (dataSourceId: string, relationshipId: string) => {
    const dataSource = mockDataSources.find(ds => ds.id === dataSourceId)
    
    if (!dataSource) {
      throw new Error('Data source not found')
    }
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return { success: true }
  },
  
  // 获取表数据预览
  getTableDataPreview: async (
    dataSourceId: string, 
    tableName: string, 
    params: {
      page?: number, 
      size?: number, 
      sort?: string, 
      order?: 'asc' | 'desc',
      filters?: Record<string, any>
    } = {}
  ) => {
    const dataSource = mockDataSources.find(ds => ds.id === dataSourceId)
    
    if (!dataSource) {
      throw new Error('Data source not found')
    }
    
    // 查找表元数据
    let tableMetadata = null
    if (dataSource.metadata && dataSource.metadata.tables) {
      tableMetadata = dataSource.metadata.tables.find(t => t.name === tableName)
    }
    
    if (!tableMetadata) {
      throw new Error('Table not found')
    }
    
    // 生成模拟数据
    const columns = tableMetadata.columns.map(col => ({
      name: col.name,
      type: col.type
    }))
    
    // 生成随机行数据
    const totalRows = 100
    let allRows = []
    
    for (let i = 0; i < totalRows; i++) {
      const row: Record<string, any> = {}
      
      // 为每一列生成模拟数据
      tableMetadata.columns.forEach(column => {
        switch (column.type) {
          case 'INT':
            row[column.name] = Math.floor(Math.random() * 10000)
            break
          case 'VARCHAR':
            row[column.name] = `Value-${Math.random().toString(36).substring(2, 7)}`
            break
          case 'DECIMAL':
            row[column.name] = +(Math.random() * 1000).toFixed(2)
            break
          case 'TIMESTAMP':
            row[column.name] = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
            break
          case 'BOOLEAN':
            row[column.name] = Math.random() > 0.5
            break
          case 'TEXT':
            row[column.name] = `This is a sample text for ${column.name}. It can contain multiple sentences.`
            break
          case 'DATE':
            const date = new Date()
            date.setDate(date.getDate() - Math.floor(Math.random() * 365))
            row[column.name] = date.toISOString().split('T')[0]
            break
          default:
            row[column.name] = `Default-${Math.random().toString(36).substring(2, 7)}`
        }
      })
      
      allRows.push(row)
    }
    
    // 应用排序
    if (params.sort) {
      const sortField = params.sort
      const sortOrder = params.order || 'asc'
      
      allRows.sort((a, b) => {
        if (a[sortField] === b[sortField]) return 0
        if (sortOrder === 'asc') {
          return a[sortField] < b[sortField] ? -1 : 1
        } else {
          return a[sortField] > b[sortField] ? -1 : 1
        }
      })
    }
    
    // 应用分页
    const page = params.page || 1
    const size = params.size || 10
    const start = (page - 1) * size
    const end = Math.min(start + size, allRows.length)
    const data = allRows.slice(start, end)
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      data,
      columns,
      total: totalRows,
      page,
      size,
      totalPages: Math.ceil(totalRows / size)
    }
  },
  
  // 获取数据源统计信息
  getDataSourceStats: async (dataSourceId: string) => {
    const dataSource = mockDataSources.find(ds => ds.id === dataSourceId)
    
    if (!dataSource) {
      throw new Error('Data source not found')
    }
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 生成模拟统计数据
    return {
      tablesCount: dataSource.metadata?.tables?.length || 0,
      viewsCount: Math.floor(Math.random() * 5),
      totalRows: Math.floor(Math.random() * 1000000),
      totalSize: Math.floor(Math.random() * 10000) + 'MB',
      lastUpdate: new Date().toISOString(),
      queriesCount: Math.floor(Math.random() * 500),
      connectionPoolSize: Math.floor(Math.random() * 20) + 5,
      activeConnections: Math.floor(Math.random() * 10),
      avgQueryTime: Math.floor(Math.random() * 1000) + 'ms'
    }
  },
  
  // 获取数据源权限
  getDataSourcePermissions: async (dataSourceId: string) => {
    const dataSource = mockDataSources.find(ds => ds.id === dataSourceId)
    
    if (!dataSource) {
      throw new Error('Data source not found')
    }
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 生成模拟权限数据
    const users = ['admin', 'user1', 'user2', 'analyst', 'developer']
    const permissions = ['READ', 'WRITE', 'ADMIN', 'EXECUTE']
    
    return users.map(user => ({
      id: generateId(),
      dataSourceId,
      userId: user,
      permission: permissions[Math.floor(Math.random() * permissions.length)],
      createdAt: getRandomDate(30),
      updatedAt: getRandomDate(10)
    }))
  },
  
  // 更新数据源权限
  updateDataSourcePermissions: async (dataSourceId: string, permissions: any[]) => {
    const dataSource = mockDataSources.find(ds => ds.id === dataSourceId)
    
    if (!dataSource) {
      throw new Error('Data source not found')
    }
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 400))
    
    // 生成响应数据
    return permissions.map(p => ({
      ...p,
      id: p.id || generateId(),
      dataSourceId,
      updatedAt: new Date().toISOString()
    }))
  },
  
  // 高级搜索
  advancedSearch: async (
    params: {
      keyword: string,
      dataSourceIds: string[],
      entityTypes: ('table' | 'column' | 'view')[],
      caseSensitive?: boolean,
      page?: number,
      size?: number
    }
  ) => {
    // 获取所选的数据源
    const selectedDataSources = mockDataSources.filter(ds => 
      params.dataSourceIds.includes(ds.id)
    )
    
    if (selectedDataSources.length === 0) {
      return {
        tables: [],
        columns: [],
        views: [],
        total: 0
      }
    }
    
    const result = {
      tables: [] as { dataSourceId: string, dataSourceName: string, tables: { name: string, type: string, schema: string }[] }[],
      columns: [] as { dataSourceId: string, dataSourceName: string, columns: { table: string, column: string, type: string }[] }[],
      views: [] as { dataSourceId: string, dataSourceName: string, views: { name: string, schema: string }[] }[],
      total: 0
    }
    
    const searchTerm = params.caseSensitive 
      ? params.keyword 
      : params.keyword.toLowerCase()
    
    // 对每个选定的数据源执行搜索
    for (const ds of selectedDataSources) {
      // 跳过没有元数据的数据源
      if (!ds.metadata || !ds.metadata.tables) {
        continue
      }
      
      const tablesResult: { name: string, type: string, schema: string }[] = []
      const columnsResult: { table: string, column: string, type: string }[] = []
      const viewsResult: { name: string, schema: string }[] = []
      
      // 搜索表和视图
      if (params.entityTypes.includes('table') || params.entityTypes.includes('view')) {
        ds.metadata.tables.forEach(table => {
          const tableName = params.caseSensitive 
            ? table.name 
            : table.name.toLowerCase()
          
          const isView = table.type === 'VIEW'
          
          // 表名匹配
          if (tableName.includes(searchTerm)) {
            if (!isView && params.entityTypes.includes('table')) {
              tablesResult.push({
                name: table.name,
                type: table.type || 'TABLE',
                schema: table.schema || 'public'
              })
            } else if (isView && params.entityTypes.includes('view')) {
              viewsResult.push({
                name: table.name,
                schema: table.schema || 'public'
              })
            }
          }
        })
      }
      
      // 搜索列
      if (params.entityTypes.includes('column')) {
        ds.metadata.tables.forEach(table => {
          const matchingColumns: { table: string, column: string, type: string }[] = []
          
          table.columns.forEach(column => {
            const columnName = params.caseSensitive 
              ? column.name
              : column.name.toLowerCase()
            
            if (columnName.includes(searchTerm)) {
              matchingColumns.push({
                table: table.name,
                column: column.name,
                type: column.type
              })
            }
          })
          
          if (matchingColumns.length > 0) {
            columnsResult.push(...matchingColumns)
          }
        })
      }
      
      // 只有在有匹配结果时才添加到结果中
      if (tablesResult.length > 0) {
        result.tables.push({
          dataSourceId: ds.id,
          dataSourceName: ds.name,
          tables: tablesResult
        })
      }
      
      if (columnsResult.length > 0) {
        result.columns.push({
          dataSourceId: ds.id,
          dataSourceName: ds.name,
          columns: columnsResult
        })
      }
      
      if (viewsResult.length > 0) {
        result.views.push({
          dataSourceId: ds.id,
          dataSourceName: ds.name,
          views: viewsResult
        })
      }
    }
    
    // 计算总匹配数
    result.total = 
      result.tables.reduce((sum, item) => sum + item.tables.length, 0) +
      result.columns.reduce((sum, item) => sum + item.columns.length, 0) +
      result.views.reduce((sum, item) => sum + item.views.length, 0)
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    return result
  }
}

export default mockDataSourceApi