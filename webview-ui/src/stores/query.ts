import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Query,
  QueryResult,
  QueryStatus,
  QueryType,
  ExecuteQueryParams,
  NaturalLanguageQueryParams,
  SaveQueryParams,
  QueryHistoryParams,
  QueryDisplayConfig,
  QueryFavorite,
  PageResponse,
  QuerySuggestion,
  QueryExecutionPlan,
  QueryVisualization,
  ChartConfig,
  FetchQueryParams,
  PaginatedResponse,
  QueryServiceStatus
} from '@/types/query'
import type {
  PaginationParams,
  PaginationInfo,
  PaginationResponse,
  BaseQueryParams
} from '@/types/common'
import { queryService, getApiBaseUrl } from '@/services/query'
import { useMessageService } from '@/services/message'
import { loading } from '@/services/loading'
import { getErrorMessage } from '@/utils/error'

// 查询参数接口
interface QueryParams extends BaseQueryParams {
  dataSourceId?: string
  status?: QueryStatus
  serviceStatus?: string
  queryType?: QueryType
  includeDrafts?: boolean
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
  // 获取消息服务
  const messageService = useMessageService()
  
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
  const executionHistory = ref<QueryExecution[]>([])
  const pagination = ref<PaginationInfo>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    hasMore: false
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
  const executeQuery = async (params: ExecuteQueryParams): Promise<QueryResult> => {
    try {
      isExecuting.value = true
      loading.show('正在执行查询...')
      
      // 使用查询服务执行查询
      const result = await queryService.executeQuery(params)
      
      // 更新当前查询结果
      currentQueryResult.value = result
      
      // 创建查询对象，确保包含所有必需属性
      const tempQuery: Query = {
        id: result.id,
        name: 'Query at ' + new Date().toLocaleString(),
        description: '',
        folderId: '',
        dataSourceId: params.dataSourceId,
        queryType: params.queryType || 'SQL',
        queryText: params.queryText,
        status: result.status as QueryStatus,
        serviceStatus: 'ACTIVE',
        createdAt: result.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        executionTime: result.executionTime || 0,
        resultCount: result.rowCount || 0,
        error: result.error,
        isFavorite: false,
        executionCount: 0,
        lastExecutedAt: new Date().toISOString()
      }
      
      // 添加到查询历史
      currentQuery.value = tempQuery
      queryHistory.value = [tempQuery, ...queryHistory.value].slice(0, 100)
      
      // 处理数据格式，确保在前端一致展示
      const processedResult = processQueryResult(result)
      
      messageService.success('查询执行成功')
      return processedResult
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error('执行查询失败:', errorMessage)
      messageService.error('执行查询失败: ' + errorMessage)
      throw error
    } finally {
      isExecuting.value = false
      loading.hide()
    }
  }
  
  // 处理查询结果数据
  const processQueryResult = (result: QueryResult): QueryResult => {
    // 复制结果对象，避免修改原始对象
    const processedResult: QueryResult = { ...result };
    
    // 确保rows是标准格式的数组数据
    if (processedResult.rows && Array.isArray(processedResult.rows)) {
      // 确保每一行都是对象类型
      processedResult.rows = processedResult.rows.map((row: any) => {
        // 如果行已经是对象，直接返回
        if (row && typeof row === 'object' && !Array.isArray(row)) {
          return row;
        }
        
        // 如果行是数组，转换为对象
        if (Array.isArray(row)) {
          const rowObj: Record<string, any> = {};
          processedResult.columns.forEach((col, index) => {
            if (index < row.length) {
              rowObj[col] = row[index];
            }
          });
          return rowObj;
        }
        
        // 其他情况返回空对象
        return {};
      });
    }
    
    // 如果存在fields字段但没有columns字段，从fields提取columns
    if (!processedResult.columns && processedResult.fields) {
      processedResult.columns = processedResult.fields.map((field: any) => {
        if (typeof field === 'string') {
          return field;
        } else if (field && typeof field === 'object' && field.name) {
          return field.name;
        }
        return '';
      }).filter(Boolean);
    }
    
    return processedResult;
  };
  
  // 执行自然语言查询
  const executeNaturalLanguageQuery = async (params: NaturalLanguageQueryParams): Promise<{
    query: Query;
    result: QueryResult;
  }> => {
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
      const tempQuery: Query = {
        id: response.query.id || '',
        name: 'Natural Language Query at ' + new Date().toLocaleString(),
        description: '',
        folderId: '',
        dataSourceId: params.dataSourceId,
        queryType: 'NATURAL_LANGUAGE',
        queryText: params.question,
        status: 'COMPLETED',
        serviceStatus: 'ACTIVE',
        createdAt: response.query.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        executionTime: response.result.executionTime || 0,
        resultCount: response.result.rowCount || 0,
        isFavorite: false,
        executionCount: 0,
        lastExecutedAt: new Date().toISOString()
      }
      
      currentQuery.value = tempQuery
      
      messageService.success(`查询成功，返回 ${response.result.rowCount} 条记录${response.result.executionTime ? `，执行时间 ${response.result.executionTime}ms` : ''}`)
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
      
      messageService.error(`查询失败: ${error.value.message}`)
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
      
      messageService.success('查询已取消')
      return true
    } catch (err) {
      console.error('取消查询错误:', err)
      error.value = err instanceof Error ? err : new Error(String(err))
      messageService.error('取消查询失败')
      
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
  
  // 获取查询历史
  const fetchQueryHistory = async (params: QueryHistoryParams = { page: 1, size: 10 }) => {
    try {
      isLoadingHistory.value = true
      error.value = null
      console.log('=====================================================')
      console.log('开始获取查询历史，参数:', params)
      
      // 确保params中至少有page和size参数
      const safeParams: QueryHistoryParams = {
        page: params.page || 1,
        size: params.size || 10,
        ...params
      }
      
      console.log('处理后的参数:', safeParams)
      
      // 调用API获取查询历史
      const result = await queryService.getQueryHistory(safeParams)
      console.log('获取到查询历史返回值:', result.items ? `包含${result.items.length}条记录` : '无记录')
      
      // 检查服务返回的数据结构
      if (!result.items || !Array.isArray(result.items)) {
        console.warn('查询历史API返回了空的或非数组的items:', result)
        
        // 尝试查看原始响应格式，帮助调试
        if (result) {
          console.log('响应格式详情:', 
            Object.keys(result).join(','), 
            'items类型:', result.items ? typeof result.items : '无items字段'
          )
        }
      }
      
      // 将查询历史数据存储到store
      queryHistory.value = result.items || []
      console.log('查询历史存储成功，记录数:', queryHistory.value.length)
      
      // 更新分页信息
      pagination.value = {
        page: result.page || 1,
        size: result.size || 10,
        total: result.total || 0,
        totalPages: result.totalPages || Math.ceil((result.total || 0) / (result.size || 10)),
        hasMore: (result.page || 1) < (result.totalPages || 1)
      }
      
      console.log('分页信息更新:', pagination.value)
      console.log('=====================================================')
      
      return result
    } catch (err) {
      console.error('获取查询历史失败:', err)
      console.log('=====================================================')
      
      // 使用工具函数获取错误消息
      let errorMessage = ''
      if (err instanceof Error) {
        errorMessage = err.message
      } else if (typeof err === 'string') {
        errorMessage = err
      } else {
        errorMessage = '未知错误'
      }
      
      // 将错误消息创建为Error对象存储
      error.value = new Error(errorMessage)
      
      // 返回空结果
      return {
        items: [],
        page: 1,
        size: 10,
        total: 0,
        totalPages: 0
      }
    } finally {
      isLoadingHistory.value = false
    }
  }
  
  // 获取查询详情
  const getQuery = async (id: string) => {
    if (!id) {
      error.value = new Error('查询ID不能为空')
      return null
    }
    
    try {
      loading.show('加载查询信息...')
      currentQuery.value = await queryService.getQuery(id)
      
      if (!currentQuery.value) {
        error.value = new Error(`未找到ID为 ${id} 的查询，该查询可能已被删除或不存在`)
        return null
      }
      
      return currentQuery.value
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      messageService.error(error.value.message)
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
      
      messageService.success('查询保存成功')
      
      // 检查查询历史中是否存在该ID
      const existsInHistory = queryHistory.value.some(q => q.id === savedQuery.id)
      if (!existsInHistory) {
        console.log('保存的查询ID不在历史记录中，重新加载查询历史')
        await fetchQueryHistory()
      }
      
      // 同时更新保存的查询列表(queries)
      const existsInQueries = queries.value.some(q => q.id === savedQuery.id)
      if (!existsInQueries) {
        // 如果是新查询，添加到查询列表的开头
        queries.value = [savedQuery, ...queries.value]
      } else {
        // 如果是更新查询，替换已有的
        queries.value = queries.value.map(q => 
          q.id === savedQuery.id ? savedQuery : q
        )
      }
      
      return savedQuery
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      messageService.error('保存查询失败')
      throw error.value
    } finally {
      loading.hide()
    }
  }
  
  // 删除查询
  const deleteQuery = async (id: string): Promise<boolean> => {
    try {
      // 开始加载
      isExecuting.value = true;
      
      // 调用接口删除
      await queryService.deleteQuery(id);
      
      // 从数据中移除
      queries.value = queries.value.filter(query => query.id !== id);
      
      // 显示成功消息
      messageService.success('查询已成功删除');
      
      return true;
    } catch (error) {
      console.error('删除查询失败:', error);
      const errorMessage = getErrorMessage(error);
      messageService.error(`删除查询失败: ${errorMessage}`);
      return false;
    } finally {
      isExecuting.value = false;
    }
  }
  
  // 删除查询历史
  const deleteQueryHistory = async (historyId: string) => {
    try {
      loading.show('删除查询历史中...')
      
      await queryService.deleteQueryHistory(historyId)
      
      // 从历史中移除
      queryHistory.value = queryHistory.value.filter(q => q.id !== historyId)
      
      messageService.success('查询历史已删除')
      return true
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      messageService.error('删除查询历史失败')
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
      
      messageService.success('已添加到收藏夹')
      getFavorites()
      return true
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      messageService.error('收藏查询失败')
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
      
      messageService.success('已从收藏夹中移除')
      return true
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      messageService.error('取消收藏失败')
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
      
      messageService.success('显示配置已保存')
      return result
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      messageService.error('保存显示配置失败')
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
      console.log(`开始获取查询执行计划，查询ID: ${queryId}`)
      
      // 调用查询服务获取执行计划
      const plan = await queryService.getQueryExecutionPlan(queryId)
      
      if (plan) {
        console.log('成功获取查询执行计划:', plan)
        executionPlan.value = plan
      } else {
        console.log('查询执行计划暂不可用')
      }
      
      return plan
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      console.error('获取查询执行计划错误:', err)
      
      // 不显示错误通知，因为这是后台功能，不应该影响用户体验
      // messageService.error('获取查询执行计划失败')
      
      throw new Error(`获取查询执行计划失败: ${errorMsg}`)
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
      
      // 使用自定义实现，如果API不支持
      const url = `${getApiBaseUrl()}/api/queries/${queryId}/export?format=${format}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`导出失败: ${response.statusText}`);
      }
      
      // 处理响应，下载文件
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `query-${queryId}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
      
      messageService.success(`查询结果已导出为 ${format.toUpperCase()} 格式`)
      return true
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      messageService.error(`导出为 ${format.toUpperCase()} 格式失败`)
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
  const getQueryExecutionHistory = async (queryId: string) => {
    if (!queryId) return []
    
    isLoadingHistory.value = true
    error.value = null
    
    try {
      console.log(`获取查询${queryId}的执行历史`)
      
      // 调用查询服务获取执行历史，而不是直接调用API
      const history = await queryService.getQueryExecutionHistory(queryId)
      
      console.log(`获取到${history.length}条执行历史记录`)
      executionHistory.value = history || []
      return history
    } catch (err) {
      console.error('获取执行历史失败:', err)
      error.value = err instanceof Error ? err : new Error(String(err))
      executionHistory.value = []
      return []
    } finally {
      isLoadingHistory.value = false
    }
  }
  
  // 手动设置当前查询文本
  const setCurrentQueryText = (queryText: string) => {
    if (currentQuery.value) {
      currentQuery.value.queryText = queryText
    }
  }
  
  // 获取查询列表
  const fetchQueries = async (params?: QueryParams): Promise<Query[]> => {
    try {
      loading.show('加载查询列表...')
      
      const queryParams = {
        queryType: params?.queryType,
        status: params?.status,
        serviceStatus: params?.serviceStatus,
        searchTerm: params?.search,
        sortBy: params?.sortBy,
        sortDir: params?.sortDir,
        includeDrafts: params?.includeDrafts,
        page: params?.page ?? 1,
        size: params?.size ?? 10
      }
      
      const response = await queryService.getQueries(queryParams)
      console.log('查询列表获取结果:', response);
      
      // 检查响应格式
      if (!response) {
        console.error('fetchQueries: API返回空响应');
        queries.value = [];
        pagination.value = {
          page: 1,
          pageSize: 10,
          total: 0,
          totalPages: 0,
          hasMore: false
        };
        return [];
      }
      
      // 确保response.items存在
      const items = response.items || [];
      queries.value = items;
      
      // 更新分页信息
      if (response.pagination) {
        pagination.value = {
          page: response.pagination.page,
          pageSize: response.pagination.pageSize,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages,
          hasMore: response.pagination.hasMore
        };
      } else {
        // 如果响应中没有分页信息，使用默认值
        pagination.value = {
          page: queryParams.page,
          pageSize: queryParams.size,
          total: items.length,
          totalPages: Math.ceil(items.length / queryParams.size),
          hasMore: queryParams.page * queryParams.size < items.length
        };
      }
      
      console.log(`查询列表更新: ${items.length}条数据, 总计${pagination.value.total}条`);
      return items;
    } catch (error) {
      console.error('加载查询列表失败:', error)
      messageService.error('加载查询列表失败: ' + (error instanceof Error ? error.message : String(error)))
      queries.value = []
      return []
    } finally {
      loading.hide()
    }
  }
  
  // 更新查询状态
  const updateQueryStatus = async (id: string, serviceStatus: QueryServiceStatus) => {
    try {
      loading.show(`正在${serviceStatus === 'ENABLED' ? '启用' : '禁用'}查询...`)
      
      // 从当前数据中获取查询详情
      const query = queries.value.find(q => q.id === id)
      if (!query) {
        throw new Error('找不到要更新的查询')
      }
      
      // 映射服务状态到查询状态
      const status: QueryStatus = serviceStatus === 'ENABLED' ? 'PUBLISHED' : 'DEPRECATED';
      
      console.log('更新查询状态，当前查询数据:', query);
      console.log('将设置新状态:', { status, serviceStatus });
      
      // 调用 saveQuery 接口更新状态
      const updatedQuery = await queryService.saveQuery({
        id,
        name: query.name,
        description: query.description,
        dataSourceId: query.dataSourceId || '',
        sql: query.queryText || '',
        status: status,
        serviceStatus: serviceStatus // 明确设置服务状态
      })
      
      console.log('查询状态更新成功，返回数据:', updatedQuery);
      
      // 更新本地状态
      if (updatedQuery) {
        // 更新查询列表中的状态
        const index = queries.value.findIndex(q => q.id === id)
        if (index !== -1) {
          queries.value[index] = {
            ...queries.value[index],
            status: status,
            serviceStatus: serviceStatus
          }
        }
        
        // 如果当前查询是被更新的查询，也更新当前查询
        if (currentQuery.value && currentQuery.value.id === id) {
          currentQuery.value.status = status
          currentQuery.value.serviceStatus = serviceStatus
        }
        
        messageService.success(`查询已${serviceStatus === 'ENABLED' ? '启用' : '禁用'}`)
      }
      
      return updatedQuery
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      messageService.error(`${serviceStatus === 'ENABLED' ? '启用' : '禁用'}查询失败: ${error.value.message}`)
      return null
    } finally {
      loading.hide()
    }
  }
  
  /**
   * 获取查询参数列表
   * @param queryId - 查询ID
   * @returns 查询参数列表
   */
  const getQueryParameters = async (queryId: string): Promise<any[]> => {
    try {
      return await queryService.getQueryParameters(queryId);
    } catch (error) {
      console.error('获取查询参数失败:', error);
      messageService.error(`获取查询参数失败: ${error instanceof Error ? error.message : String(error)}`);
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
    executionHistory,
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
    setCurrentQueryText,
    fetchQueries,
    deleteQueryHistory,
    updateQueryStatus,
    getQueryParameters
  }
})

export default useQueryStore