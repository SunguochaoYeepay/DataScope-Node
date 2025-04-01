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
  const isUpdateLoading = ref(false)
  const isUpdateError = ref(false)
  const updateError = ref<string | null>(null)
  const isCreateLoading = ref(false)
  const isCreateError = ref(false)
  const createError = ref<string | null>(null)
  
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
    isCreateLoading.value = true
    isCreateError.value = false
    createError.value = null

    try {
      const response = await dataSourceService.createDataSource(params)
      // 添加到数据源列表
      dataSources.value.push(response)
      message.success('数据源创建成功')
      return response
    } catch (error) {
      console.error('创建数据源失败:', error)
      isCreateError.value = true
      createError.value = error instanceof Error ? error.message : '未知错误'
      message.error(`创建数据源失败: ${createError.value}`)
      throw error
    } finally {
      isCreateLoading.value = false
    }
  }
  
  // 更新数据源
  const updateDataSource = async (params: UpdateDataSourceParams) => {
    isUpdateLoading.value = true
    isUpdateError.value = false
    updateError.value = null

    try {
      const response = await dataSourceService.updateDataSource(params)
      
      // 更新当前选中的数据源
      const index = dataSources.value.findIndex(ds => ds.id === params.id)
      if (index !== -1) {
        dataSources.value[index] = response
      }
      
      // 若当前选中的数据源就是更新的数据源，也更新currentDataSource
      if (currentDataSource.value && currentDataSource.value.id === params.id) {
        currentDataSource.value = response
      }

      message.success('数据源更新成功')
      return response
    } catch (error) {
      console.error('更新数据源失败:', error)
      isUpdateError.value = true
      updateError.value = error instanceof Error ? error.message : '未知错误'
      message.error(`更新数据源失败: ${updateError.value}`)
      throw error
    } finally {
      isUpdateLoading.value = false
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
      let result;
      
      // 如果是已存在的数据源，使用testExistingConnection
      if (params.id) {
        result = await dataSourceService.testExistingConnection(params.id)
      } else {
        result = await dataSourceService.testConnection(params)
      }
      
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
      console.log('元数据同步结果:', result)
      
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
        message.error(`元数据同步失败: ${result.message || '未知错误'}`)
      }
      
      return result
    } catch (err) {
      console.error('同步元数据失败:', err)
      message.error('同步元数据失败: ' + (err instanceof Error ? err.message : '未知错误'))
      return { 
        success: false, 
        message: err instanceof Error ? err.message : String(err) 
      }
    } finally {
      loading.hide()
    }
  }
  
  // 获取数据源的元数据信息（表结构等）
  const getDataSourceMetadata = async (dataSourceId: string): Promise<Metadata | null> => {
    if (isLoadingMetadata.value) {
      console.warn('元数据加载中，请勿重复请求')
      return null
    }
    
    isLoadingMetadata.value = true
    
    try {
      // 首先尝试获取已有数据源，如果存在则直接加载其元数据
      const dataSource = dataSources.value.find(ds => ds.id === dataSourceId)
      
      if (dataSource && dataSource.metadata && dataSource.metadata.tables && dataSource.metadata.tables.length > 0) {
        console.log(`数据源 ${dataSourceId} 已有元数据`)
        isLoadingMetadata.value = false
        return dataSource.metadata
      }
      
      // 如果数据源不存在或无元数据，尝试同步
      console.log(`开始同步元数据，数据源ID: ${dataSourceId}`)
      
      let syncResult
      try {
        syncResult = await dataSourceService.syncMetadata({
          id: dataSourceId,
          filters: {
            includeSchemas: [],
            excludeSchemas: [],
            includeTables: [],
            excludeTables: []
          }
        })
        console.log('元数据同步结果:', syncResult)
      } catch (syncError) {
        console.error('同步元数据API返回错误:', syncError)
        
        // 同步出错时，不直接返回错误，而是尝试直接从API获取基础元数据
        try {
          console.log('尝试直接从API获取表列表...')
          const tablesResult = await dataSourceService.getTableMetadata(dataSourceId);
          
          if (tablesResult && tablesResult.length > 0) {
            console.log(`直接获取到 ${tablesResult.length} 个表的信息`);
            
            // 创建或更新数据源的元数据
            const metadata: Metadata = {
              tables: tablesResult,
              lastSyncTime: new Date().toISOString()
            };
            
            // 更新数据源对象
            if (dataSource) {
              dataSource.metadata = metadata;
              
              // 更新数据源列表
              const index = dataSources.value.findIndex(ds => ds.id === dataSourceId);
              if (index !== -1) {
                dataSources.value[index] = dataSource;
              }
            }
            
            return metadata;
          }
        } catch (directError) {
          console.error('直接获取表信息失败:', directError);
        }
        
        // 如果上述方法都失败，则返回一个最小的元数据对象，避免UI报错
        const emptyMetadata: Metadata = {
          tables: [],
          lastSyncTime: new Date().toISOString()
        };
        return emptyMetadata;
      }
      
      // 同步成功后，重新获取数据源信息
      try {
        const updatedDataSource = await dataSourceService.getDataSource(dataSourceId);
        
        // 如果获取不到元数据，尝试直接获取表列表
        if (!updatedDataSource.metadata || !updatedDataSource.metadata.tables || updatedDataSource.metadata.tables.length === 0) {
          console.log('更新后的数据源仍然没有元数据，尝试直接获取表列表');
          const tablesResult = await dataSourceService.getTableMetadata(dataSourceId);
          
          if (tablesResult && tablesResult.length > 0) {
            updatedDataSource.metadata = {
              tables: tablesResult,
              lastSyncTime: new Date().toISOString()
            };
          }
        }
        
        // 更新数据源列表
        const index = dataSources.value.findIndex(ds => ds.id === dataSourceId);
        if (index !== -1) {
          dataSources.value[index] = updatedDataSource;
        }
        
        // 处理metadata可能为undefined的情况
        return updatedDataSource.metadata || null;
      } catch (getDataSourceError) {
        console.error('获取更新后的数据源信息失败:', getDataSourceError);
        
        // 返回一个最小的元数据对象，避免UI报错
        const emptyMetadata: Metadata = {
          tables: [],
          lastSyncTime: new Date().toISOString()
        };
        return emptyMetadata;
      }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
      console.error('加载元数据失败:', err);
      
      // 返回一个最小的元数据对象，避免UI报错
      const emptyMetadata: Metadata = {
        tables: [],
        lastSyncTime: new Date().toISOString()
      };
      return emptyMetadata;
    } finally {
      isLoadingMetadata.value = false;
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
    isUpdateLoading,
    isUpdateError,
    updateError,
    isCreateLoading,
    isCreateError,
    createError,
    
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