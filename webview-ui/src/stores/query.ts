import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Query,
  QueryResult,
  QueryStatus,
  ExecuteQueryParams,
  NaturalLanguageQueryParams,
  SaveQueryParams,
  QueryHistoryParams,
  QueryDisplayConfig,
  QueryFavorite,
  QuerySuggestion,
  QueryExecutionPlan,
  QueryVisualization,
  ChartConfig
} from '@/types/query'
import { queryService, isUsingMockApi } from '@/services/query'
import { message } from '@/services/message'
import { loading } from '@/services/loading'

// 查询参数接口
export interface FetchQueryParams {
  dataSourceId?: string
  status?: QueryStatus
  queryType?: string
  search?: string
  page?: number
  size?: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}

// 查询API类型定义
export interface QueryAPI {
  getQueries(): Promise<Query[]>
  getQuery(id: string): Promise<Query | null>
  saveQuery(query: Query): Promise<Query>
  favoriteQuery(id: string): Promise<boolean>
  unfavoriteQuery(id: string): Promise<boolean>
  executeQuery(query: Query): Promise<QueryResult>
  getFavorites(): Promise<Query[]>
  getQueryHistory(): Promise<Query[]>
  getQueryVisualization(id: string): Promise<QueryVisualization | null>
  getQueryExecutionPlan(id: string): Promise<QueryExecutionPlan | null>
  getQuerySuggestions(id: string): Promise<QuerySuggestion[]>
  exportQueryResults(id: string, format: 'csv' | 'excel' | 'json'): Promise<boolean>
  // 新增方法：获取查询执行历史
  getQueryExecutionHistory(id: string): Promise<QueryExecution[]>
  // 新增方法：获取特定执行记录的结果
  getExecutionResults(executionId: string): Promise<QueryResult | null>
  // 新增方法：获取执行错误信息
  getExecutionError(executionId: string): Promise<QueryExecutionError | null>
}

// 查询执行记录类型
export interface QueryExecution {
  id: string                    // 执行ID
  queryId: string               // 关联的查询ID
  executedAt: string            // 执行时间
  executionTime: number         // 执行耗时（毫秒）
  status: QueryStatus           // 执行状态
  rowCount?: number             // 结果行数（如果成功）
  errorMessage?: string         // 错误信息（如果失败）
}

// 查询执行错误信息
export interface QueryExecutionError {
  executionId: string           // 执行ID
  errorCode: string             // 错误代码
  errorMessage: string          // 错误消息
  errorDetails?: string         // 详细错误信息
  stackTrace?: string           // 堆栈跟踪
}

export const useQueryStore = defineStore('query', () => {
  // 状态
  const queries = ref<Query[]>([])
  const currentQuery = ref<Query | null>(null)
  const currentQueryResult = ref<QueryResult | null>(null)
  const queryHistory = ref<Query[]>([])
  const favorites = ref<QueryFavorite[]>([])
  const displayConfig = ref<QueryDisplayConfig | null>(null)
  const executionPlan = ref<QueryExecutionPlan | null>(null)
  const suggestions = ref<QuerySuggestion[]>([])
  const visualization = ref<QueryVisualization | null>(null)
  const pagination = ref({
    total: 0,
    page: 1,
    size: 10,
    totalPages: 0
  })
  const isExecuting = ref(false)
  const isLoadingHistory = ref(false)
  const error = ref<Error | null>(null)
  
  // 计算属性
  const hasResult = computed(() => !!currentQueryResult.value && currentQueryResult.value.rows.length > 0)
  
  const completedQueries = computed(() => {
    return queryHistory.value.filter(q => q.status === 'COMPLETED')
  })
  
  const favoriteQueries = computed(() => {
    return queryHistory.value.filter(q => q.isFavorite)
  })

  // 执行 SQL 查询
  const executeQuery = async (params: ExecuteQueryParams) => {
    isExecuting.value = true
    error.value = null
    loading.show('执行查询中...', {
      showCancelButton: true,
      onCancel: () => {
        if (currentQuery.value?.id) {
          cancelQuery(currentQuery.value.id)
        } else {
          isExecuting.value = false
        }
      }
    })
    
    try {
      const result = await queryService.executeQuery(params)
      currentQueryResult.value = result
      
      // 如果没有错误，更新当前查询
      currentQuery.value = {
        id: result.id || '',
        dataSourceId: params.dataSourceId,
        queryType: params.queryType,
        queryText: params.queryText,
        status: result.status || 'COMPLETED',
        createdAt: result.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        executionTime: result.executionTime,
        resultCount: result.rowCount
      }
      
      // 获取查询优化建议
      getQuerySuggestions(result.id)
      
      // 尝试获取执行计划
      if (params.queryType === 'SQL') {
        getQueryExecutionPlan(result.id)
      }
      
      message.success(`查询成功，返回 ${result.rowCount} 条记录${result.executionTime ? `，执行时间 ${result.executionTime}ms` : ''}`)
      fetchQueryHistory()
      return result
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      currentQueryResult.value = null
      
      // 如果有错误，更新当前查询状态
      if (currentQuery.value) {
        currentQuery.value = {
          ...currentQuery.value,
          status: 'FAILED',
          error: err instanceof Error ? err.message : String(err)
        }
      }
      
      message.error(`查询失败: ${error.value.message}`)
      throw error.value
    } finally {
      isExecuting.value = false
      loading.hide()
    }
  }
  
  // 执行自然语言查询
  const executeNaturalLanguageQuery = async (params: NaturalLanguageQueryParams) => {
    isExecuting.value = true
    error.value = null
    loading.show('处理自然语言查询中...', {
      showCancelButton: true,
      onCancel: () => {
        if (currentQuery.value?.id) {
          cancelQuery(currentQuery.value.id)
        } else {
          isExecuting.value = false
        }
      }
    })
    
    try {
      const response = await queryService.executeNaturalLanguageQuery(params)
      currentQueryResult.value = response.result
      
      // 更新当前查询
      currentQuery.value = {
        id: response.query.id || '',
        dataSourceId: params.dataSourceId,
        queryType: 'NATURAL_LANGUAGE',
        queryText: params.question,
        status: 'COMPLETED',
        createdAt: response.query.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        executionTime: response.result.executionTime,
        resultCount: response.result.rowCount
      }
      
      message.success(`查询成功，返回 ${response.result.rowCount} 条记录${response.result.executionTime ? `，执行时间 ${response.result.executionTime}ms` : ''}`)
      fetchQueryHistory()
      return response
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      currentQueryResult.value = null
      
      // 如果有错误，更新当前查询状态
      if (currentQuery.value) {
        currentQuery.value = {
          ...currentQuery.value,
          status: 'FAILED',
          error: err instanceof Error ? err.message : String(err)
        }
      }
      
      message.error(`查询失败: ${error.value.message}`)
      throw error.value
    } finally {
      isExecuting.value = false
      loading.hide()
    }
  }
  
  // 取消查询
  const cancelQuery = async (queryId: string) => {
    try {
      loading.show('取消查询中...')
      
      await queryService.cancelQuery(queryId)
      
      // 更新当前查询状态
      if (currentQuery.value && currentQuery.value.id === queryId) {
        currentQuery.value.status = 'CANCELLED'
      }
      
      // 更新历史中的查询状态
      const historyQuery = queryHistory.value.find(q => q.id === queryId)
      if (historyQuery) {
        historyQuery.status = 'CANCELLED'
      }
      
      // 强制设置执行状态为未执行
      isExecuting.value = false
      
      // 更新结果状态（如果有结果）
      if (currentQueryResult.value && currentQueryResult.value.id === queryId) {
        currentQueryResult.value.status = 'CANCELLED'
      }
      
      message.success('查询已取消')
      return true
    } catch (err) {
      console.error('取消查询错误:', err)
      error.value = err instanceof Error ? err : new Error(String(err))
      message.error('取消查询失败')
      
      // 即使API调用失败，也要强制停止执行状态
      isExecuting.value = false
      
      return false
    } finally {
      loading.hide()
    }
  }
  
  // 获取查询状态
  const getQueryStatus = async (queryId: string) => {
    try {
      const status = await queryService.getQueryStatus(queryId)
      
      // 更新当前查询状态
      if (currentQuery.value && currentQuery.value.id === queryId) {
        currentQuery.value.status = status.status
        
        if (status.result && status.status === 'COMPLETED') {
          currentQueryResult.value = status.result
        }
      }
      
      return status
    } catch (err) {
      console.error('获取查询状态失败', err)
      return null
    }
  }
  
  // 加载查询历史
  const fetchQueryHistory = async (params: QueryHistoryParams = {}) => {
    isLoadingHistory.value = true
    
    try {
      const response = await queryService.getQueryHistory({
        ...params,
        page: params.page || pagination.value.page,
        size: params.size || pagination.value.size
      })
      
      queryHistory.value = response.items
      pagination.value = {
        total: response.total,
        page: response.page,
        size: response.size,
        totalPages: response.totalPages
      }
      
      return response
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      console.error('加载查询历史失败', error.value)
      return null
    } finally {
      isLoadingHistory.value = false
    }
  }
  
  // 获取查询详情
  const getQuery = async (id: string) => {
    try {
      loading.show('加载查询信息...')
      
      const query = await queryService.getQuery(id)
      currentQuery.value = query
      return query
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      message.error('加载查询信息失败')
      return null
    } finally {
      loading.hide()
    }
  }
  
  // 保存查询
  const saveQuery = async (params: SaveQueryParams) => {
    try {
      loading.show('保存查询中...')
      
      const savedQuery = await queryService.saveQuery(params)
      
      // 如果当前查询是被保存的查询，更新当前查询
      if (currentQuery.value && (params.id === currentQuery.value.id || !params.id)) {
        currentQuery.value = savedQuery
      }
      
      message.success('查询保存成功')
      fetchQueryHistory()
      return savedQuery
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      message.error('保存查询失败')
      throw error.value
    } finally {
      loading.hide()
    }
  }
  
  // 删除查询
  const deleteQuery = async (id: string) => {
    try {
      loading.show('删除查询中...')
      
      await queryService.deleteQuery(id)
      
      // 如果当前查询是被删除的查询，清空当前查询
      if (currentQuery.value && currentQuery.value.id === id) {
        currentQuery.value = null
        currentQueryResult.value = null
      }
      
      // 从历史中移除
      queryHistory.value = queryHistory.value.filter(q => q.id !== id)
      
      message.success('查询已删除')
      return true
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      message.error('删除查询失败')
      return false
    } finally {
      loading.hide()
    }
  }
  
  // 收藏查询
  const favoriteQuery = async (id: string) => {
    try {
      await queryService.favoriteQuery(id)
      
      // 更新本地状态
      const query = queryHistory.value.find(q => q.id === id)
      if (query) {
        query.isFavorite = true
      }
      
      if (currentQuery.value && currentQuery.value.id === id) {
        currentQuery.value.isFavorite = true
      }
      
      message.success('已添加到收藏夹')
      getFavorites()
      return true
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      message.error('收藏查询失败')
      return false
    }
  }
  
  // 取消收藏
  const unfavoriteQuery = async (id: string) => {
    try {
      await queryService.unfavoriteQuery(id)
      
      // 更新本地状态
      const query = queryHistory.value.find(q => q.id === id)
      if (query) {
        query.isFavorite = false
      }
      
      if (currentQuery.value && currentQuery.value.id === id) {
        currentQuery.value.isFavorite = false
      }
      
      // 从收藏夹中移除
      favorites.value = favorites.value.filter(f => f.queryId !== id)
      
      message.success('已从收藏夹中移除')
      return true
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      message.error('取消收藏失败')
      return false
    }
  }
  
  // 加载收藏列表
  const getFavorites = async () => {
    try {
      const result = await queryService.getFavorites()
      favorites.value = result
      return result
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      console.error('加载收藏夹失败', error.value)
      return []
    }
  }
  
  // 保存显示配置
  const saveDisplayConfig = async (queryId: string, config: Partial<QueryDisplayConfig>) => {
    try {
      loading.show('保存显示配置...')
      
      const result = await queryService.saveDisplayConfig(queryId, config)
      displayConfig.value = result
      
      message.success('显示配置已保存')
      return result
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      message.error('保存显示配置失败')
      return null
    } finally {
      loading.hide()
    }
  }
  
  // 加载显示配置
  const getDisplayConfig = async (queryId: string) => {
    try {
      const result = await queryService.getDisplayConfig(queryId)
      displayConfig.value = result
      return result
    } catch (err) {
      // 如果没有显示配置，不显示错误
      console.log('No display config found for query', queryId)
      displayConfig.value = null
      return null
    }
  }
  
  // 获取查询优化建议
  const getQuerySuggestions = async (queryId: string) => {
    try {
      const result = await queryService.getQuerySuggestions(queryId)
      suggestions.value = result
      return result
    } catch (err) {
      console.error('获取查询优化建议失败', err)
      return []
    }
  }
  
  // 获取查询执行计划
  const getQueryExecutionPlan = async (queryId: string) => {
    try {
      const plan = await queryService.getQueryExecutionPlan(queryId)
      executionPlan.value = plan
      return plan
    } catch (err) {
      console.error('获取查询执行计划失败', err)
      return null
    }
  }
  
  // 获取查询可视化
  const getQueryVisualization = async (queryId: string) => {
    try {
      const visualizationData = await queryService.getQueryVisualization(queryId)
      if (visualizationData) {
        visualization.value = visualizationData
        return visualizationData.config
      }
      return null
    } catch (err) {
      console.error('获取查询可视化失败', err)
      return null
    }
  }
  
  // 保存查询可视化
  const saveQueryVisualization = async (queryId: string, config: ChartConfig) => {
    try {
      const result = await queryService.saveQueryVisualization(queryId, config)
      visualization.value = result
      return result
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      console.error('保存查询可视化失败', error.value)
      throw error.value
    }
  }
  
  // 导出查询结果
  const exportQueryResults = async (queryId: string, format: 'csv' | 'excel' | 'json') => {
    try {
      loading.show(`正在导出为 ${format.toUpperCase()} 格式...`)
      
      await queryService.exportQueryResults(queryId, format)
      
      message.success(`查询结果已导出为 ${format.toUpperCase()} 格式`)
      return true
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      message.error(`导出查询结果失败: ${error.value.message}`)
      return false
    } finally {
      loading.hide()
    }
  }
  
  // 重置状态
  const resetState = () => {
    currentQuery.value = null
    currentQueryResult.value = null
    displayConfig.value = null
    executionPlan.value = null
    suggestions.value = []
    visualization.value = null
    error.value = null
  }
  
  // 初始化
  const init = async () => {
    await Promise.all([
      fetchQueryHistory(),
      getFavorites()
    ])
  }

  // 获取查询执行历史
  async function getQueryExecutionHistory(queryId: string): Promise<QueryExecution[]> {
    try {
      if (isUsingMockApi()) {
        // 生成模拟数据
        return mockQueryExecutionHistory(queryId)
      }
      
      // 这里应该通过queryService调用，但后端API尚未提供此功能
      console.error('后端API尚未提供查询执行历史功能')
      return []
    } catch (error) {
      console.error('Failed to get query execution history:', error)
      return []
    }
  }
  
  // 获取特定执行记录的结果
  async function getExecutionResults(executionId: string): Promise<QueryResult | null> {
    try {
      if (isUsingMockApi()) {
        // 使用当前结果作为模拟数据
        return currentQueryResult.value
      }
      
      // 这里应该通过queryService调用，但后端API尚未提供此功能
      console.error('后端API尚未提供查询执行结果获取功能')
      return null
    } catch (error) {
      console.error('Failed to get execution results:', error)
      return null
    }
  }
  
  // 获取执行错误信息
  async function getExecutionError(executionId: string): Promise<QueryExecutionError | null> {
    try {
      if (isUsingMockApi()) {
        // 生成模拟错误数据
        return {
          executionId,
          errorCode: 'SYNTAX_ERROR',
          errorMessage: '查询语法错误',
          errorDetails: '在SQL语句中发现未闭合的引号或括号',
          stackTrace: 'ErrorClass: Syntax error at line 2, position 15...'
        }
      }
      
      // 这里应该通过queryService调用，但后端API尚未提供此功能
      console.error('后端API尚未提供查询执行错误获取功能')
      return null
    } catch (error) {
      console.error('Failed to get execution error:', error)
      return null
    }
  }

  // 获取查询列表
  const fetchQueries = async (params?: FetchQueryParams) => {
    try {
      console.log('Query store: fetchQueries called with params:', params);
      
      const result = await queryService.getQueryHistory({
        dataSourceId: params?.dataSourceId,
        queryType: params?.queryType as any,
        page: params?.page || 0,
        size: params?.size || 100
      });
      
      console.log('Query store: fetchQueries result:', result);
      
      // 确保每个查询都有name属性
      const queriesWithNames = result.items.map(query => {
        if (!query.name) {
          return { ...query, name: `查询 ${query.id}` };
        }
        return query;
      });
      
      console.log('Query store: queriesWithNames:', queriesWithNames);
      
      return queriesWithNames;
    } catch (err) {
      console.error('获取查询列表失败', err);
      return [];
    }
  };
  
  return {
    // 状态
    queries,
    currentQuery,
    currentQueryResult,
    queryHistory,
    favorites,
    displayConfig,
    executionPlan,
    suggestions,
    visualization,
    pagination,
    isExecuting,
    isLoadingHistory,
    error,
    
    // 计算属性
    hasResult,
    completedQueries,
    favoriteQueries,
    
    // 方法
    executeQuery,
    executeNaturalLanguageQuery,
    cancelQuery,
    getQueryStatus,
    fetchQueryHistory,
    getQuery,
    saveQuery,
    deleteQuery,
    favoriteQuery,
    unfavoriteQuery,
    getFavorites,
    saveDisplayConfig,
    getDisplayConfig,
    getQuerySuggestions,
    getQueryExecutionPlan,
    getQueryVisualization,
    saveQueryVisualization,
    exportQueryResults,
    resetState,
    init,
    getQueryExecutionHistory,
    getExecutionResults,
    getExecutionError,
    fetchQueries
  }
})

export default useQueryStore

// 模拟查询执行历史数据
function mockQueryExecutionHistory(queryId: string): QueryExecution[] {
  const now = Date.now()
  return [
    {
      id: `exec-${queryId}-1`,
      queryId,
      executedAt: new Date(now - 3600000).toISOString(),
      executionTime: 1250,
      status: 'COMPLETED',
      rowCount: 128
    },
    {
      id: `exec-${queryId}-2`,
      queryId,
      executedAt: new Date(now - 7200000).toISOString(),
      executionTime: 2100,
      status: 'COMPLETED',
      rowCount: 256
    },
    {
      id: `exec-${queryId}-3`,
      queryId,
      executedAt: new Date(now - 14400000).toISOString(),
      executionTime: 890,
      status: 'FAILED',
      errorMessage: '查询超时或语法错误'
    },
    {
      id: `exec-${queryId}-4`,
      queryId,
      executedAt: new Date(now - 86400000).toISOString(),
      executionTime: 1500,
      status: 'COMPLETED',
      rowCount: 64
    },
    {
      id: `exec-${queryId}-5`,
      queryId,
      executedAt: new Date(now - 172800000).toISOString(),
      executionTime: 3200,
      status: 'CANCELLED'
    }
  ]
}