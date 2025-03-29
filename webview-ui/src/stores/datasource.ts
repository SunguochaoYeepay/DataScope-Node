import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { 
  DataSource, 
  DataSourceType, 
  DataSourceStatus,
  CreateDataSourceParams,
  UpdateDataSourceParams,
  DataSourceQueryParams,
  PageResponse
} from '@/types/datasource'
import type { Metadata, TableMetadata } from '@/types/metadata'
import { dataSourceService } from '@/services/datasource'
import { message } from '@/services/message'
import { loading } from '@/services/loading'

export const useDataSourceStore = defineStore('dataSource', () => {
  // 状态
  const dataSources = ref<DataSource[]>([])
  const currentDataSource = ref<DataSource | null>(null)
  const pagination = ref({
    total: 0,
    page: 1,
    size: 10,
    totalPages: 0
  })
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  const isLoadingMetadata = ref(false)
  
  // 计算属性
  const activeDataSources = computed(() => {
    return dataSources.value.filter(ds => ds.status === 'ACTIVE')
  })
  
  const dataSourcesByType = computed(() => {
    const result: Record<DataSourceType, DataSource[]> = {
      'MYSQL': [],
      'POSTGRESQL': [],
      'ORACLE': [],
      'SQLSERVER': [],
      'MONGODB': [],
      'ELASTICSEARCH': []
    }
    
    dataSources.value.forEach(ds => {
      result[ds.type].push(ds)
    })
    
    return result
  })
  
  // 获取数据源列表
  const fetchDataSources = async (params: DataSourceQueryParams = {}) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response: PageResponse<DataSource> = await dataSourceService.getDataSources({
        ...params,
        page: params.page || pagination.value.page,
        size: params.size || pagination.value.size
      })
      
      dataSources.value = response.items
      pagination.value = {
        total: response.total,
        page: response.page,
        size: response.size,
        totalPages: response.totalPages
      }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      message.error('加载数据源列表失败')
    } finally {
      isLoading.value = false
    }
  }
  
  // 获取单个数据源
  const getDataSourceById = async (id: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const data = await dataSourceService.getDataSource(id)
      currentDataSource.value = data
      return data
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      message.error('加载数据源详情失败')
      return null
    } finally {
      isLoading.value = false
    }
  }
  
  // 创建数据源
  const createDataSource = async (params: CreateDataSourceParams) => {
    isLoading.value = true
    error.value = null
    
    try {
      const newDataSource = await dataSourceService.createDataSource(params)
      message.success('数据源创建成功')
      fetchDataSources() // 刷新列表
      return newDataSource
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      message.error('创建数据源失败')
      return null
    } finally {
      isLoading.value = false
    }
  }
  
  // 更新数据源
  const updateDataSource = async (params: UpdateDataSourceParams) => {
    isLoading.value = true
    error.value = null
    
    try {
      const updatedDataSource = await dataSourceService.updateDataSource(params)
      
      // 更新本地状态
      const index = dataSources.value.findIndex(ds => ds.id === params.id)
      if (index !== -1) {
        dataSources.value[index] = updatedDataSource
      }
      
      if (currentDataSource.value?.id === params.id) {
        currentDataSource.value = updatedDataSource
      }
      
      message.success('数据源更新成功')
      return updatedDataSource
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      message.error('更新数据源失败')
      return null
    } finally {
      isLoading.value = false
    }
  }
  
  // 删除数据源
  const deleteDataSource = async (id: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      await dataSourceService.deleteDataSource(id)
      
      // 更新本地状态
      dataSources.value = dataSources.value.filter(ds => ds.id !== id)
      
      if (currentDataSource.value?.id === id) {
        currentDataSource.value = null
      }
      
      message.success('数据源删除成功')
      return true
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      message.error('删除数据源失败')
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  // 测试连接
  const testDataSourceConnection = async (params: any) => {
    try {
      loading.show('测试连接中...')
      const result = await dataSourceService.testConnection(params)
      
      if (result.success) {
        message.success('连接成功')
      } else {
        message.error(`连接失败: ${result.message}`)
      }
      
      return result
    } catch (err) {
      message.error('测试连接失败')
      return { success: false, message: err instanceof Error ? err.message : String(err) }
    } finally {
      loading.hide()
    }
  }
  
  // 同步元数据
  const syncDataSourceMetadata = async (id: string) => {
    try {
      loading.show('同步元数据中...')
      const result = await dataSourceService.syncMetadata({ id })
      
      if (result.success) {
        message.success('元数据同步成功')
        
        // 更新当前数据源的元数据
        if (currentDataSource.value?.id === id) {
          currentDataSource.value = await getDataSourceById(id)
        }
        
        // 更新列表中的数据源
        const index = dataSources.value.findIndex(ds => ds.id === id)
        if (index !== -1) {
          const updatedDataSource = await dataSourceService.getDataSource(id)
          dataSources.value[index] = updatedDataSource
        }
      } else {
        message.error(`元数据同步失败: ${result.message}`)
      }
      
      return result
    } catch (err) {
      message.error('同步元数据失败')
      return { success: false, message: err instanceof Error ? err.message : String(err) }
    } finally {
      loading.hide()
    }
  }
  
  // 加载元数据
  const getDataSourceMetadata = async (dataSourceId: string) => {
    isLoadingMetadata.value = true
    error.value = null
    
    try {
      // 检查数据源是否已经加载了元数据
      const ds = dataSources.value.find(d => d.id === dataSourceId)
      
      if (ds && ds.metadata && ds.metadata.tables && ds.metadata.tables.length > 0) {
        return ds.metadata
      }
      
      // 如果没有元数据或元数据为空，则获取单个数据源的详细信息
      const dataSource = await dataSourceService.getDataSource(dataSourceId)
      
      // 如果仍然没有元数据，尝试同步
      if (!dataSource.metadata || !dataSource.metadata.tables || dataSource.metadata.tables.length === 0) {
        const syncResult = await syncDataSourceMetadata(dataSourceId)
        
        if (!syncResult.success) {
          throw new Error(`无法同步元数据: ${syncResult.message}`)
        }
        
        // 再次获取数据源详情以获取更新后的元数据
        const updatedDataSource = await dataSourceService.getDataSource(dataSourceId)
        
        // 更新当前数据源的元数据
        if (currentDataSource.value?.id === dataSourceId) {
          currentDataSource.value = updatedDataSource
        }
        
        // 更新列表中的数据源
        const index = dataSources.value.findIndex(ds => ds.id === dataSourceId)
        if (index !== -1) {
          dataSources.value[index] = updatedDataSource
        }
        
        return updatedDataSource.metadata
      }
      
      // 更新当前数据源的元数据
      if (currentDataSource.value?.id === dataSourceId) {
        currentDataSource.value = dataSource
      }
      
      // 更新列表中的数据源
      const index = dataSources.value.findIndex(ds => ds.id === dataSourceId)
      if (index !== -1) {
        dataSources.value[index] = dataSource
      }
      
      return dataSource.metadata
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      message.error('加载元数据失败')
      throw error.value
    } finally {
      isLoadingMetadata.value = false
    }
  }
  
  // 获取表的元数据
  const getTableMetadata = (dataSourceId: string, tableName: string): TableMetadata | null => {
    const ds = dataSources.value.find(d => d.id === dataSourceId)
    
    if (!ds || !ds.metadata || !ds.metadata.tables) {
      return null
    }
    
    return ds.metadata.tables.find(t => t.name === tableName) || null
  }
  
  // 搜索表和列
  const searchMetadata = (dataSourceId: string, term: string): { tables: TableMetadata[], columns: { table: string, column: string }[] } => {
    const result = {
      tables: [] as TableMetadata[],
      columns: [] as { table: string, column: string }[]
    }
    
    if (!term) return result
    
    const ds = dataSources.value.find(d => d.id === dataSourceId)
    
    if (!ds || !ds.metadata || !ds.metadata.tables) {
      return result
    }
    
    const searchTerm = term.toLowerCase()
    
    // 搜索表
    result.tables = ds.metadata.tables.filter(table => 
      table.name.toLowerCase().includes(searchTerm)
    )
    
    // 搜索列
    ds.metadata.tables.forEach(table => {
      table.columns.forEach(column => {
        if (column.name.toLowerCase().includes(searchTerm)) {
          result.columns.push({
            table: table.name,
            column: column.name
          })
        }
      })
    })
    
    return result
  }
  
  return {
    // 状态
    dataSources,
    currentDataSource,
    pagination,
    isLoading,
    error,
    isLoadingMetadata,
    
    // 计算属性
    activeDataSources,
    dataSourcesByType,
    
    // 方法
    fetchDataSources,
    getDataSourceById,
    createDataSource,
    updateDataSource,
    deleteDataSource,
    testDataSourceConnection,
    syncDataSourceMetadata,
    getDataSourceMetadata,
    getTableMetadata,
    searchMetadata,
    
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
      try {
        return await dataSourceService.getTableDataPreview(
          dataSourceId,
          tableName,
          params
        )
      } catch (err) {
        error.value = err instanceof Error ? err : new Error(String(err))
        throw error.value
      }
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
      try {
        return await dataSourceService.advancedSearch(params)
      } catch (err) {
        error.value = err instanceof Error ? err : new Error(String(err))
        throw error.value
      }
    }
  }
})

export default useDataSourceStore