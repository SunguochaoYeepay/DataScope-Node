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
  DataSourcePermissions
} from '@/types/datasource'
import type { TableMetadata, TableRelationship } from '@/types/metadata'
import { mockDataSourceApi } from '@/mocks/datasource'

// 使用环境变量判断是否使用模拟API
const USE_MOCK_API = true

// API 基础路径
const API_BASE_URL = '/api/datasources'

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
      if (params.type) queryParams.append('type', params.type)
      if (params.status) queryParams.append('status', params.status)
      if (params.page) queryParams.append('page', params.page.toString())
      if (params.size) queryParams.append('size', params.size.toString())
      
      // 发送请求
      const response = await fetch(`${API_BASE_URL}?${queryParams.toString()}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch data sources: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching data sources:', error)
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
        throw new Error(`Failed to fetch data source: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Error fetching data source ${id}:`, error)
      throw error
    }
  },
  
  // 创建数据源
  async createDataSource(params: CreateDataSourceParams): Promise<DataSource> {
    if (USE_MOCK_API) {
      return mockDataSourceApi.createDataSource(params)
    }

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to create data source: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error creating data source:', error)
      throw error
    }
  },
  
  // 更新数据源
  async updateDataSource(params: UpdateDataSourceParams): Promise<DataSource> {
    if (USE_MOCK_API) {
      return mockDataSourceApi.updateDataSource(params)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to update data source: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Error updating data source ${params.id}:`, error)
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
        throw new Error(`Failed to delete data source: ${response.statusText}`)
      }
    } catch (error) {
      console.error(`Error deleting data source ${id}:`, error)
      throw error
    }
  },
  
  // 测试数据源连接
  async testConnection(params: TestConnectionParams): Promise<ConnectionTestResult> {
    if (USE_MOCK_API) {
      return mockDataSourceApi.testConnection(params)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/test-connection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      })
      
      return await response.json()
    } catch (error) {
      console.error('Error testing connection:', error)
      throw error
    }
  },
  
  // 同步数据源元数据
  async syncMetadata(params: SyncMetadataParams): Promise<MetadataSyncResult> {
    if (USE_MOCK_API) {
      return mockDataSourceApi.syncMetadata(params)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${params.id}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params.filters || {})
      })
      
      if (!response.ok) {
        throw new Error(`Failed to sync metadata: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Error syncing metadata for data source ${params.id}:`, error)
      throw error
    }
  },
  
  // 获取数据源的表元数据
  async getTableMetadata(dataSourceId: string, tableName: string): Promise<TableMetadata> {
    if (USE_MOCK_API) {
      return mockDataSourceApi.getTableMetadata(dataSourceId, tableName)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${dataSourceId}/tables/${tableName}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch table metadata: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Error fetching table metadata for ${tableName}:`, error)
      throw error
    }
  },
  
  // 搜索数据源的表和列
  async searchMetadata(dataSourceId: string, term: string): Promise<{
    tables: TableMetadata[],
    columns: { table: string, column: string }[]
  }> {
    if (USE_MOCK_API) {
      return mockDataSourceApi.searchMetadata(dataSourceId, term)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${dataSourceId}/search?term=${encodeURIComponent(term)}`)
      
      if (!response.ok) {
        throw new Error(`Failed to search metadata: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Error searching metadata for ${dataSourceId}:`, error)
      throw error
    }
  },
  
  // 获取表关系
  async getTableRelationships(dataSourceId: string): Promise<TableRelationship[]> {
    if (USE_MOCK_API) {
      return mockDataSourceApi.getTableRelationships(dataSourceId)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${dataSourceId}/relationships`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch table relationships: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Error fetching table relationships for ${dataSourceId}:`, error)
      throw error
    }
  },
  
  // 创建或更新表关系
  async saveTableRelationship(dataSourceId: string, relationship: Omit<TableRelationship, 'id'>): Promise<TableRelationship> {
    if (USE_MOCK_API) {
      return mockDataSourceApi.saveTableRelationship(dataSourceId, relationship)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${dataSourceId}/relationships`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(relationship)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to save table relationship: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Error saving table relationship for ${dataSourceId}:`, error)
      throw error
    }
  },
  
  // 删除表关系
  async deleteTableRelationship(dataSourceId: string, relationshipId: string): Promise<void> {
    if (USE_MOCK_API) {
      return mockDataSourceApi.deleteTableRelationship(dataSourceId, relationshipId)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${dataSourceId}/relationships/${relationshipId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error(`Failed to delete table relationship: ${response.statusText}`)
      }
    } catch (error) {
      console.error(`Error deleting table relationship ${relationshipId}:`, error)
      throw error
    }
  },
  
  // 获取数据源统计信息
  async getDataSourceStats(dataSourceId: string): Promise<DataSourceStats> {
    if (USE_MOCK_API) {
      return mockDataSourceApi.getDataSourceStats(dataSourceId)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${dataSourceId}/stats`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data source stats: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Error fetching stats for data source ${dataSourceId}:`, error)
      throw error
    }
  },
  
  // 获取数据源权限
  async getDataSourcePermissions(dataSourceId: string): Promise<DataSourcePermissions[]> {
    if (USE_MOCK_API) {
      return mockDataSourceApi.getDataSourcePermissions(dataSourceId)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${dataSourceId}/permissions`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data source permissions: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Error fetching permissions for data source ${dataSourceId}:`, error)
      throw error
    }
  },
  
  // 更新数据源权限
  async updateDataSourcePermissions(dataSourceId: string, permissions: Omit<DataSourcePermissions, 'id'>[]): Promise<DataSourcePermissions[]> {
    if (USE_MOCK_API) {
      return mockDataSourceApi.updateDataSourcePermissions(dataSourceId, permissions)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${dataSourceId}/permissions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(permissions)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to update data source permissions: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Error updating permissions for data source ${dataSourceId}:`, error)
      throw error
    }
  },
  
  // 获取表数据预览
  async getTableDataPreview(
    dataSourceId: string, 
    tableName: string, 
    params: {
      page?: number, 
      size?: number, 
      sort?: string, 
      order?: 'asc' | 'desc',
      filters?: Record<string, any>
    } = {}
  ): Promise<{
    data: any[],
    columns: { name: string, type: string }[],
    total: number,
    page: number,
    size: number,
    totalPages: number
  }> {
    if (USE_MOCK_API) {
      return mockDataSourceApi.getTableDataPreview(dataSourceId, tableName, params)
    }

    try {
      // 构建查询参数
      const queryParams = new URLSearchParams()
      if (params.page !== undefined) queryParams.append('page', params.page.toString())
      if (params.size !== undefined) queryParams.append('size', params.size.toString())
      if (params.sort) queryParams.append('sort', params.sort)
      if (params.order) queryParams.append('order', params.order)
      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(`filter[${key}]`, value.toString())
          }
        })
      }
      
      const response = await fetch(`${API_BASE_URL}/${dataSourceId}/tables/${tableName}/preview?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch table data preview: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Error fetching preview data for table ${tableName}:`, error)
      throw error
    }
  },
  
  // 高级搜索
  async advancedSearch(
    params: {
      keyword: string,
      dataSourceIds: string[],
      entityTypes: ('table' | 'column' | 'view')[],
      caseSensitive?: boolean,
      page?: number,
      size?: number
    }
  ): Promise<{
    tables: { 
      dataSourceId: string, 
      dataSourceName: string, 
      tables: { name: string, type: string, schema: string }[] 
    }[],
    columns: { 
      dataSourceId: string, 
      dataSourceName: string, 
      columns: { table: string, column: string, type: string }[] 
    }[],
    views: {
      dataSourceId: string,
      dataSourceName: string,
      views: { name: string, schema: string }[]
    }[],
    total: number
  }> {
    if (USE_MOCK_API) {
      return mockDataSourceApi.advancedSearch(params)
    }

    try {
      // 构建查询参数
      const queryParams = new URLSearchParams()
      queryParams.append('keyword', params.keyword)
      params.dataSourceIds.forEach(id => queryParams.append('dataSourceIds', id))
      params.entityTypes.forEach(type => queryParams.append('entityTypes', type))
      if (params.caseSensitive !== undefined) queryParams.append('caseSensitive', String(params.caseSensitive))
      if (params.page !== undefined) queryParams.append('page', params.page.toString())
      if (params.size !== undefined) queryParams.append('size', params.size.toString())
      
      const response = await fetch(`${API_BASE_URL}/search?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(`Failed to perform advanced search: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error performing advanced search:', error)
      throw error
    }
  }
}

export default dataSourceService