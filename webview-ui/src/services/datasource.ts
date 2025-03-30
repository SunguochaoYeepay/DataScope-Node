import type {
  DataSource,
  CreateDataSourceParams,
  UpdateDataSourceParams,
  TestConnectionParams,
  SyncMetadataParams,
  DataSourceQueryParams,
  PageResponse,
  ConnectionTestResult,
  MetadataSyncResult,
  DataSourceStats,
  DataSourcePermissions,
  DataSourceType,
  DataSourceStatus,
  SyncFrequency
} from '@/types/datasource'
import type { TableMetadata, TableRelationship } from '@/types/metadata'
import { mockDataSourceApi } from '@/mocks/datasource'

// 使用环境变量判断是否使用模拟API
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'

// API 基础路径
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ? 
  `${import.meta.env.VITE_API_BASE_URL}/api/datasources` : '/api/datasources'

// 元数据API基础路径
const METADATA_API_BASE_URL = import.meta.env.VITE_API_BASE_URL ? 
  `${import.meta.env.VITE_API_BASE_URL}/api/metadata/datasources` : '/api/metadata/datasources'

// 处理统一响应格式
const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json()
  // 处理后端统一响应格式
  if (data.success === false) {
    throw new Error(data.error?.message || '请求失败')
  }
  return data.success === undefined ? data : data.data
}

// 将后端返回的数据源对象转换为前端所需的格式
const adaptDataSource = (source: any): DataSource => {
  return {
    id: source.id,
    name: source.name,
    description: source.description || '',
    type: (source.type?.toUpperCase() || 'MYSQL') as DataSourceType, // 后端返回小写的类型
    host: source.host,
    port: source.port,
    databaseName: source.databaseName,
    username: source.username,
    // 密码通常不会返回
    status: (source.status || 'ACTIVE') as DataSourceStatus,
    syncFrequency: (source.syncFrequency || 'MANUAL') as SyncFrequency,
    lastSyncTime: source.lastSyncTime,
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
    // 其他可选字段
    errorMessage: source.errorMessage,
    connectionOptions: source.connectionParams || {},
    // 额外字段处理
    metadata: source.metadata
  }
}

// 数据源服务
export const dataSourceService = {
  // 获取数据源列表
  async getDataSources(params: DataSourceQueryParams): Promise<PageResponse<DataSource>> {
    if (USE_MOCK_API) {
      return mockDataSourceApi.getDataSources(params)
    }

    try {
      // 构建查询参数
      const queryParams = new URLSearchParams()
      if (params.name) queryParams.append('name', params.name)
      if (params.type) queryParams.append('type', params.type.toLowerCase()) // 发送小写类型
      if (params.status) queryParams.append('status', params.status)
      if (params.page !== undefined) queryParams.append('page', params.page.toString())
      if (params.size) queryParams.append('size', params.size.toString())
      
      // 发送请求
      const response = await fetch(`${API_BASE_URL}?${queryParams.toString()}`)
      if (!response.ok) {
        throw new Error(`获取数据源列表失败: ${response.statusText}`)
      }
      
      // 处理响应数据 - 文档中明确返回的是数组而非分页对象
      const rawData = await handleResponse<any[]>(response)
      
      // 将后端数据适配为前端需要的格式
      const adaptedData: DataSource[] = Array.isArray(rawData) 
        ? rawData.map(adaptDataSource) 
        : [];
      
      // 手动构造分页对象
      return {
        items: adaptedData,
        total: adaptedData.length,
        page: params.page || 1,
        size: params.size || adaptedData.length,
        totalPages: Math.ceil(adaptedData.length / (params.size || adaptedData.length || 10))
      }
    } catch (error) {
      console.error('获取数据源列表错误:', error)
      throw error
    }
  },
  
  // 获取单个数据源详情
  async getDataSource(id: string): Promise<DataSource> {
    if (USE_MOCK_API) {
      return mockDataSourceApi.getDataSource(id)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`)
      if (!response.ok) {
        throw new Error(`获取数据源详情失败: ${response.statusText}`)
      }
      
      const data = await handleResponse<any>(response)
      return adaptDataSource(data)
    } catch (error) {
      console.error(`获取数据源${id}详情错误:`, error)
      throw error
    }
  },
  
  // 创建数据源
  async createDataSource(params: CreateDataSourceParams): Promise<DataSource> {
    if (USE_MOCK_API) {
      return mockDataSourceApi.createDataSource(params)
    }

    try {
      // 转换参数格式以匹配后端期望
      const requestBody = {
        name: params.name,
        description: params.description,
        type: params.type.toLowerCase(), // 后端期望小写的类型
        host: params.host,
        port: params.port,
        databaseName: params.databaseName,
        username: params.username,
        password: params.password,
        syncFrequency: params.syncFrequency,
        // 转换字段名称不同的属性
        connectionParams: params.connectionOptions || {} // 后端使用connectionParams
      }
      
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
      
      if (!response.ok) {
        throw new Error(`创建数据源失败: ${response.statusText}`)
      }
      
      const data = await handleResponse<any>(response)
      return adaptDataSource(data)
    } catch (error) {
      console.error('创建数据源错误:', error)
      throw error
    }
  },
  
  // 更新数据源
  async updateDataSource(params: UpdateDataSourceParams): Promise<DataSource> {
    if (USE_MOCK_API) {
      return mockDataSourceApi.updateDataSource(params)
    }

    try {
      // 构建符合后端期望的请求体
      const requestBody: any = {
        id: params.id,
        name: params.name,
        description: params.description,
        host: params.host,
        port: params.port,
        databaseName: params.databaseName,
        username: params.username,
        // 只有在明确提供时才发送密码
        ...(params.password && { password: params.password }),
        syncFrequency: params.syncFrequency,
        // 转换字段名称不同的属性
        connectionParams: params.connectionOptions || {} // 后端使用connectionParams
      }
      
      const response = await fetch(`${API_BASE_URL}/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
      
      if (!response.ok) {
        throw new Error(`更新数据源失败: ${response.statusText}`)
      }
      
      const data = await handleResponse<any>(response)
      return adaptDataSource(data)
    } catch (error) {
      console.error(`更新数据源${params.id}错误:`, error)
      throw error
    }
  },
  
  // 删除数据源
  async deleteDataSource(id: string): Promise<void> {
    if (USE_MOCK_API) {
      await mockDataSourceApi.deleteDataSource(id)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error(`删除数据源失败: ${response.statusText}`)
      }
      
      await handleResponse<void>(response)
    } catch (error) {
      console.error(`删除数据源${id}错误:`, error)
      throw error
    }
  },
  
  // 测试数据源连接
  async testConnection(params: TestConnectionParams): Promise<ConnectionTestResult> {
    if (USE_MOCK_API) {
      return mockDataSourceApi.testConnection(params)
    }

    try {
      // 转换参数格式以匹配后端期望
      const requestBody = {
        type: params.type.toLowerCase(), // 转小写
        host: params.host,
        port: params.port,
        databaseName: params.databaseName,
        username: params.username,
        password: params.password,
        // 转换字段名不同的属性
        connectionParams: params.connectionOptions || {} // 后端使用connectionParams
      }
      
      const response = await fetch(`${API_BASE_URL}/test-connection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
      
      if (!response.ok) {
        throw new Error(`测试连接失败: ${response.statusText}`)
      }
      
      const result = await handleResponse<any>(response)
      // 适配后端返回的测试结果格式为前端需要的格式
      return {
        success: result.success || false,
        message: result.message || '',
        connectionInfo: result.connectionInfo || {
          databaseType: '',
          databaseVersion: '',
          driverVersion: '',
          pingTime: 0
        }
      }
    } catch (error) {
      console.error('测试连接错误:', error)
      throw error
    }
  },
  
  // 同步数据源元数据
  async syncMetadata(params: SyncMetadataParams): Promise<MetadataSyncResult> {
    if (USE_MOCK_API) {
      return mockDataSourceApi.syncMetadata(params)
    }

    try {
      // 构建符合后端预期的请求体
      const requestBody = {
        filters: {
          includeSchemas: params.filters?.includeSchemas || [],
          excludeSchemas: params.filters?.excludeSchemas || [],
          includeTables: params.filters?.includeTables || [],
          excludeTables: params.filters?.excludeTables || []
        }
      }
      
      // 使用正确的元数据API路径
      const response = await fetch(`${METADATA_API_BASE_URL}/${params.id}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
      
      if (!response.ok) {
        throw new Error(`同步元数据失败: ${response.statusText}`)
      }
      
      const result = await handleResponse<any>(response)
      // 适配后端返回的同步结果格式为前端需要的格式
      return {
        success: result.success || false,
        message: result.message || '',
        tablesCount: result.tablesCount || 0,
        viewsCount: result.viewsCount || 0,
        syncDuration: result.syncDuration || 0,
        lastSyncTime: result.lastSyncTime || new Date().toISOString()
      }
    } catch (error) {
      console.error(`同步数据源${params.id}元数据错误:`, error)
      throw error
    }
  },
  
  // 获取数据源的表元数据 - 使用新的API路径
  async getTableMetadata(dataSourceId: string, tableName?: string): Promise<TableMetadata | Record<string, TableMetadata>> {
    if (USE_MOCK_API) {
      return mockDataSourceApi.getTableMetadata(dataSourceId, tableName as string)
    }

    try {
      // 构建查询参数
      const queryParams = new URLSearchParams()
      if (tableName) queryParams.append('tableName', tableName)
      
      // 使用新的元数据结构API
      const response = await fetch(`${METADATA_API_BASE_URL}/${dataSourceId}/structure?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(`获取表元数据失败: ${response.statusText}`)
      }
      
      const data = await handleResponse<Record<string, TableMetadata>>(response)
      // 如果指定了表名，返回特定表的元数据；否则返回所有表
      return tableName && data[tableName] ? data[tableName] : data
    } catch (error) {
      console.error(`获取数据源${dataSourceId}表元数据错误:`, error)
      throw error
    }
  },
  
  // 获取表关系
  async getTableRelationships(dataSourceId: string): Promise<TableRelationship[]> {
    if (USE_MOCK_API) {
      return mockDataSourceApi.getTableRelationships(dataSourceId)
    }

    try {
      // 构建查询参数获取表关系，这可能在structure API中返回或有专门的端点
      const response = await fetch(`${METADATA_API_BASE_URL}/${dataSourceId}/structure?includeRelationships=true`)
      
      if (!response.ok) {
        throw new Error(`获取表关系失败: ${response.statusText}`)
      }
      
      // 从响应中提取关系信息
      const data = await handleResponse<any>(response)
      return data.relationships || []
    } catch (error) {
      console.error(`获取数据源${dataSourceId}表关系错误:`, error)
      throw error
    }
  },
  
  // 获取表数据预览
  async getTablePreview(dataSourceId: string, tableName: string, limit: number = 10): Promise<any[]> {
    if (USE_MOCK_API) {
      // 使用mock api中类似的功能
      const result = await mockDataSourceApi.getTableDataPreview(dataSourceId, tableName, { size: limit });
      return result.data || [];
    }

    try {
      const queryParams = new URLSearchParams()
      queryParams.append('tableName', tableName)
      queryParams.append('limit', limit.toString())
      
      // 使用新的预览API
      const response = await fetch(`${METADATA_API_BASE_URL}/${dataSourceId}/preview?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(`获取表预览数据失败: ${response.statusText}`)
      }
      
      return handleResponse<any[]>(response)
    } catch (error) {
      console.error(`获取数据源${dataSourceId}表${tableName}预览错误:`, error)
      throw error
    }
  },
  
  // 搜索数据源元数据
  async searchMetadata(dataSourceId: string, keyword: string): Promise<any> {
    if (USE_MOCK_API) {
      return mockDataSourceApi.searchMetadata(dataSourceId, keyword)
    }

    try {
      const queryParams = new URLSearchParams()
      queryParams.append('keyword', keyword)
      
      // 这个接口在文档中不确定是否存在，可能需要调整
      const response = await fetch(`${METADATA_API_BASE_URL}/${dataSourceId}/search?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(`搜索元数据失败: ${response.statusText}`)
      }
      
      return handleResponse<any>(response)
    } catch (error) {
      console.error(`搜索数据源${dataSourceId}元数据错误:`, error)
      throw error
    }
  },
  
  // 获取数据源统计信息
  async getDataSourceStats(dataSourceId: string): Promise<DataSourceStats> {
    if (USE_MOCK_API) {
      return mockDataSourceApi.getDataSourceStats(dataSourceId)
    }

    try {
      // 这个接口在文档中不确定是否存在，可能需要调整
      const response = await fetch(`${API_BASE_URL}/${dataSourceId}/stats`)
      
      if (!response.ok) {
        throw new Error(`获取数据源统计信息失败: ${response.statusText}`)
      }
      
      // 获取后端原始数据
      const data = await handleResponse<any>(response)
      
      // 构造前端需要的格式
      // 确保按照DataSourceStats接口定义进行转换
      const stats: DataSourceStats = {
        dataSourceId: dataSourceId,
        totalTables: data.tablesCount || 0,
        totalViews: data.viewsCount || 0,
        totalQueries: data.queriesCount || 0,
        avgQueryTime: data.avgQueryTime ? parseFloat(data.avgQueryTime) : 0,
        lastAccessTime: data.lastUpdate || new Date().toISOString(),
        storageUsed: data.totalSize ? parseFloat(data.totalSize) : 0,
        popularity: data.activeConnections || 0
      };
      
      return stats;
    } catch (error) {
      console.error(`获取数据源${dataSourceId}统计信息错误:`, error)
      throw error
    }
  },
  
  // 新增: 获取同步历史记录
  async getSyncHistory(dataSourceId: string): Promise<any[]> {
    if (USE_MOCK_API) {
      // 模拟数据
      return []
    }

    try {
      const response = await fetch(`${METADATA_API_BASE_URL}/${dataSourceId}/sync-history`)
      
      if (!response.ok) {
        throw new Error(`获取同步历史失败: ${response.statusText}`)
      }
      
      return handleResponse<any[]>(response)
    } catch (error) {
      console.error(`获取数据源${dataSourceId}同步历史错误:`, error)
      throw error
    }
  },

  // 新增: 分析表列的详细信息
  async analyzeColumns(dataSourceId: string, tableName: string, columnNames?: string[]): Promise<any> {
    if (USE_MOCK_API) {
      // 模拟数据
      return {}
    }

    try {
      // 构建查询参数
      const queryParams = new URLSearchParams()
      queryParams.append('tableName', tableName)
      if (columnNames && columnNames.length) {
        queryParams.append('columns', columnNames.join(','))
      }
      
      const response = await fetch(`${METADATA_API_BASE_URL}/${dataSourceId}/columns/analyze?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(`分析列详情失败: ${response.statusText}`)
      }
      
      return handleResponse<any>(response)
    } catch (error) {
      console.error(`分析数据源${dataSourceId}表${tableName}列错误:`, error)
      throw error
    }
  }
}

export default dataSourceService