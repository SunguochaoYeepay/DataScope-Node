import type { Metadata } from './metadata'

// 数据源类型
export type DataSourceType = 'MYSQL' | 'POSTGRESQL' | 'ORACLE' | 'SQLSERVER' | 'MONGODB' | 'ELASTICSEARCH'

// 数据源状态
export type DataSourceStatus = 'ACTIVE' | 'INACTIVE' | 'ERROR' | 'SYNCING'

// 同步频率类型
export type SyncFrequency = 'MANUAL' | 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY'

// 数据库连接加密方式
export type EncryptionType = 'NONE' | 'SSL' | 'TLS'

// 数据源模型
export interface DataSource {
  id: string
  name: string
  description: string
  type: DataSourceType
  host: string
  port: number
  databaseName: string
  database?: string
  username: string
  password?: string
  status: DataSourceStatus
  syncFrequency: SyncFrequency
  lastSyncTime?: string
  createdAt: string
  updatedAt: string
  errorMessage?: string
  connectionOptions?: Record<string, string>
  encryptionType?: EncryptionType
  encryptionOptions?: Record<string, string>
  
  // 元数据信息
  metadata?: Metadata
}

// 创建数据源参数
export interface CreateDataSourceParams {
  name: string
  description: string
  type: DataSourceType
  host: string
  port: number
  databaseName: string
  database?: string
  username: string
  password: string
  syncFrequency: SyncFrequency
  connectionOptions?: Record<string, string>
  encryptionType?: EncryptionType
  encryptionOptions?: Record<string, string>
}

// 更新数据源参数
export interface UpdateDataSourceParams {
  id: string
  name?: string
  description?: string
  host?: string
  port?: number
  databaseName?: string
  database?: string
  username?: string
  password?: string
  syncFrequency?: SyncFrequency
  connectionOptions?: Record<string, string>
  encryptionType?: EncryptionType
  encryptionOptions?: Record<string, string>
}

// 测试连接参数
export interface TestConnectionParams {
  type: DataSourceType
  host: string
  port: number
  databaseName: string
  database?: string
  username: string
  password?: string
  connectionParams?: Record<string, string>
}

// 同步元数据参数
export interface SyncMetadataParams {
  id: string
  filters?: {
    includeSchemas?: string[]
    excludeSchemas?: string[]
    includeTables?: string[]
    excludeTables?: string[]
  }
}

// 数据源查询参数
export interface DataSourceQueryParams {
  name?: string
  type?: DataSourceType
  status?: DataSourceStatus
  page?: number
  size?: number
}

// 分页响应
export interface PageResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  totalPages: number
}

// 连接测试结果
export interface ConnectionTestResult {
  success: boolean
  message: string
  details?: any
}

// 元数据同步结果
export interface MetadataSyncResult {
  success: boolean
  message?: string
  tablesCount?: number
  viewsCount?: number
  syncDuration?: number
  lastSyncTime?: string
}

// 数据源统计信息
export interface DataSourceStats {
  dataSourceId: string
  tablesCount: number
  viewsCount: number
  totalRows: number
  totalSize: string
  lastUpdate: string
  queriesCount: number
  connectionPoolSize: number
  activeConnections: number
  avgQueryTime: string
  totalTables: number
  totalViews: number
  totalQueries: number
  avgResponseTime: number
  peakConnections: number
}

// 数据源权限配置
export interface DataSourcePermissions {
  id: string
  dataSourceId: string
  roleId: string
  canView: boolean
  canEdit: boolean
  canExecute: boolean
  canManage: boolean
  filters?: {
    schemas?: string[]
    tables?: string[]
    columns?: { table: string, columns: string[] }[]
  }
}