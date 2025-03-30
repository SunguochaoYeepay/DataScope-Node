import type {
  Query,
  QueryResult,
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
  ChartConfig
} from '@/types/query'
import { mockQueryApi } from '@/mocks/query'

// 使用环境变量判断是否使用模拟API
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'

// API 基础路径
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/queries`
const QUERY_PLANS_API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/query-plans`

// 查询服务
export const queryService = {
  // 执行SQL查询
  async executeQuery(params: ExecuteQueryParams): Promise<QueryResult> {
    if (USE_MOCK_API) {
      return mockQueryApi.executeQuery(params)
    }

    try {
      // 构建符合后端格式的请求体
      const requestBody = {
        dataSourceId: params.dataSourceId,
        sql: params.queryText, // 前端QueryText转为后端的sql
        limit: params.limit,
        offset: params.offset,
        parameters: params.parameters
      }

      const response = await fetch(`${API_BASE_URL}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
      
      if (!response.ok) {
        throw new Error(`执行查询失败: ${response.statusText}`)
      }
      
      // 处理响应数据 - 注意后端返回的格式可能是 { success: true, data: {...} }
      const responseData = await response.json()
      const result = responseData.data || responseData  // 兼容不同的响应格式
      
      // 确保返回结果符合前端QueryResult类型
      return {
        id: result.id || Math.random().toString(36).substring(2, 15),
        columns: result.columns || [],
        columnTypes: result.columnTypes,
        rows: result.rows || [],
        rowCount: result.rowCount || result.rows?.length || 0,
        executionTime: result.executionTime || 0,
        hasMore: result.hasMore || false,
        status: result.status || 'COMPLETED',
        error: result.error,
        createdAt: result.createdAt || new Date().toISOString()
      }
    } catch (error) {
      console.error('执行查询出错:', error)
      throw error
    }
  },
  
  // 执行自然语言查询
  async executeNaturalLanguageQuery(params: NaturalLanguageQueryParams): Promise<{
    query: Query;
    result: QueryResult;
  }> {
    if (USE_MOCK_API) {
      return mockQueryApi.executeNaturalLanguageQuery(params)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/natural-language`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to execute natural language query: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error executing natural language query:', error)
      throw error
    }
  },
  
  // 取消查询
  async cancelQuery(id: string): Promise<boolean> {
    if (USE_MOCK_API) {
      return mockQueryApi.cancelQuery(id)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${id}/cancel`, {
        method: 'POST'
      })
      
      if (!response.ok) {
        throw new Error(`Failed to cancel query: ${response.statusText}`)
      }
      
      return true
    } catch (error) {
      console.error(`Error canceling query ${id}:`, error)
      throw error
    }
  },
  
  // 获取查询状态
  async getQueryStatus(id: string): Promise<{
    status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    result?: QueryResult;
  }> {
    if (USE_MOCK_API) {
      return mockQueryApi.getQueryStatus(id)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${id}/status`)
      
      if (!response.ok) {
        throw new Error(`Failed to get query status: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Error getting query status ${id}:`, error)
      throw error
    }
  },
  
  // 获取查询历史记录
  async getQueryHistory(params: QueryHistoryParams): Promise<PageResponse<Query>> {
    if (USE_MOCK_API) {
      return mockQueryApi.getQueryHistory(params)
    }

    try {
      const { page = 1, size = 10, dataSourceId, queryType, startDate, endDate, searchTerm } = params
      
      // 构建查询参数
      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString()
      })
      
      if (dataSourceId) {
        queryParams.append('dataSourceId', dataSourceId)
      }
      
      if (queryType) {
        queryParams.append('queryType', queryType)
      }
      
      if (startDate) {
        queryParams.append('startDate', startDate)
      }
      
      if (endDate) {
        queryParams.append('endDate', endDate)
      }
      
      if (searchTerm) {
        queryParams.append('searchTerm', searchTerm)
      }

      const response = await fetch(`${API_BASE_URL}/history?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`获取查询历史失败: ${response.statusText}`)
      }

      const responseData = await response.json()
      const result = responseData.data || responseData
      
      // 确保返回格式符合前端PageResponse<Query>类型
      const items = (result.items || []).map((item: any) => ({
        id: item.id,
        name: item.name || `查询 ${item.id.substring(0, 8)}`,
        dataSourceId: item.dataSourceId,
        queryType: item.queryType || 'SQL',
        queryText: item.sql || item.queryText, // 适配后端可能使用sql字段
        status: item.status || 'COMPLETED',
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString(),
        executionTime: item.executionTime,
        resultCount: item.resultCount || 0,
        error: item.error,
        isFavorite: item.isFavorite || false
      }))
      
      return {
        items,
        page: result.page || page,
        size: result.size || size,
        total: result.total || items.length,
        hasMore: result.hasMore || false
      }
    } catch (error) {
      console.error('获取查询历史错误:', error)
      throw error
    }
  },
  
  // 获取单个查询信息
  async getQuery(id: string): Promise<Query | null> {
    if (USE_MOCK_API) {
      return mockQueryApi.getQuery(id)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error(`获取查询失败: ${response.statusText}`)
      }

      const responseData = await response.json()
      // 适配后端响应格式
      const result = responseData.data || responseData
      
      // 确保返回格式符合前端需要的Query类型
      return {
        id: result.id,
        name: result.name || `查询 ${result.id.substring(0, 8)}`,
        dataSourceId: result.dataSourceId,
        queryType: result.queryType || 'SQL',
        queryText: result.sql || result.queryText, // 适配后端可能使用sql字段而非queryText
        status: result.status || 'COMPLETED',
        createdAt: result.createdAt || new Date().toISOString(),
        updatedAt: result.updatedAt || new Date().toISOString(),
        executionTime: result.executionTime,
        resultCount: result.resultCount || 0,
        error: result.error,
        isFavorite: result.isFavorite || false
      }
    } catch (error) {
      console.error('获取查询错误:', error)
      throw error
    }
  },
  
  // 保存查询
  async saveQuery(params: SaveQueryParams): Promise<Query> {
    if (USE_MOCK_API) {
      return mockQueryApi.saveQuery(params)
    }

    try {
      // 构建请求体，适配后端API格式
      const requestBody = {
        id: params.id,
        name: params.name,
        dataSourceId: params.dataSourceId,
        queryType: params.queryType,
        sql: params.queryText,  // 后端可能使用sql字段而非queryText
        description: params.description,
        tags: params.tags
      }

      const method = params.id ? 'PUT' : 'POST'
      const url = params.id ? `${API_BASE_URL}/${params.id}` : API_BASE_URL

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error(`保存查询失败: ${response.statusText}`)
      }

      const responseData = await response.json()
      const result = responseData.data || responseData

      // 转换返回结果为前端所需的Query对象
      return {
        id: result.id,
        name: result.name,
        dataSourceId: result.dataSourceId,
        queryType: result.queryType || params.queryType,
        queryText: result.sql || result.queryText || params.queryText,
        status: 'COMPLETED', // 新保存的查询默认为已完成状态
        createdAt: result.createdAt || new Date().toISOString(),
        updatedAt: result.updatedAt || new Date().toISOString(),
        description: result.description,
        tags: result.tags,
        isFavorite: result.isFavorite || false
      }
    } catch (error) {
      console.error('保存查询错误:', error)
      throw error
    }
  },
  
  // 删除查询
  async deleteQuery(id: string): Promise<boolean> {
    if (USE_MOCK_API) {
      return mockQueryApi.deleteQuery(id)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`删除查询失败: ${response.statusText}`)
      }

      return true
    } catch (error) {
      console.error('删除查询错误:', error)
      throw error
    }
  },
  
  // 收藏查询
  async favoriteQuery(queryId: string): Promise<QueryFavorite> {
    if (USE_MOCK_API) {
      return mockQueryApi.favoriteQuery(queryId)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${queryId}/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`收藏查询失败: ${response.statusText}`)
      }

      const responseData = await response.json()
      const result = responseData.data || responseData

      return {
        id: result.id,
        queryId: result.queryId || queryId,
        name: result.name || `收藏的查询 ${queryId.substring(0, 8)}`,
        description: result.description,
        createdAt: result.createdAt || new Date().toISOString(),
        updatedAt: result.updatedAt || new Date().toISOString()
      }
    } catch (error) {
      console.error('收藏查询错误:', error)
      throw error
    }
  },
  
  // 取消收藏查询
  async unfavoriteQuery(queryId: string): Promise<boolean> {
    if (USE_MOCK_API) {
      return mockQueryApi.unfavoriteQuery(queryId)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${queryId}/favorite`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`取消收藏查询失败: ${response.statusText}`)
      }

      return true
    } catch (error) {
      console.error('取消收藏查询错误:', error)
      throw error
    }
  },
  
  // 获取收藏的查询列表
  async getFavorites(): Promise<QueryFavorite[]> {
    if (USE_MOCK_API) {
      return mockQueryApi.getFavorites()
    }

    try {
      const response = await fetch(`${API_BASE_URL}/favorites`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`获取收藏查询列表失败: ${response.statusText}`)
      }

      const responseData = await response.json()
      const result = responseData.data || responseData

      // 转换结果为前端所需的QueryFavorite数组
      return Array.isArray(result) ? result.map((item: any) => ({
        id: item.id,
        queryId: item.queryId,
        name: item.name || `收藏的查询 ${item.queryId.substring(0, 8)}`,
        description: item.description,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString()
      })) : []
    } catch (error) {
      console.error('获取收藏查询列表错误:', error)
      throw error
    }
  },
  
  // 保存展示配置
  async saveDisplayConfig(queryId: string, config: Partial<QueryDisplayConfig>): Promise<QueryDisplayConfig> {
    if (USE_MOCK_API) {
      return mockQueryApi.saveDisplayConfig(queryId, config)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${queryId}/display-config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to save display config: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error saving display config:', error)
      throw error
    }
  },
  
  // 获取展示配置
  async getDisplayConfig(queryId: string): Promise<QueryDisplayConfig | null> {
    if (USE_MOCK_API) {
      return mockQueryApi.getDisplayConfig(queryId)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${queryId}/display-config`)
      
      if (response.status === 404) {
        return null
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch display config: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Error fetching display config for query ${queryId}:`, error)
      throw error
    }
  },
  
  // 获取查询执行计划
  async getQueryExecutionPlan(queryId: string): Promise<QueryExecutionPlan> {
    if (USE_MOCK_API) {
      return mockQueryApi.getQueryExecutionPlan(queryId)
    }

    try {
      // 使用查询计划API地址
      const response = await fetch(`${QUERY_PLANS_API_URL}/${queryId}`)
      
      if (!response.ok) {
        throw new Error(`获取查询执行计划失败: ${response.statusText}`)
      }
      
      // 处理响应数据
      const responseData = await response.json()
      const result = responseData.data || responseData // 兼容不同的响应格式
      
      return result
    } catch (error) {
      console.error(`获取查询执行计划错误:`, error)
      throw error
    }
  },
  
  // 获取查询优化建议
  async getQuerySuggestions(queryId: string): Promise<QuerySuggestion[]> {
    if (USE_MOCK_API) {
      return mockQueryApi.getQuerySuggestions(queryId)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${queryId}/suggestions`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch query suggestions: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Error fetching query suggestions for ${queryId}:`, error)
      throw error
    }
  },
  
  // 获取查询可视化
  async getQueryVisualization(queryId: string): Promise<QueryVisualization | null> {
    if (USE_MOCK_API) {
      return mockQueryApi.getQueryVisualization(queryId)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${queryId}/visualization`)
      
      if (response.status === 404) {
        return null // 没有找到可视化配置
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch query visualization: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Error fetching visualization for ${queryId}:`, error)
      throw error
    }
  },
  
  // 保存查询可视化
  async saveQueryVisualization(queryId: string, config: ChartConfig): Promise<QueryVisualization> {
    if (USE_MOCK_API) {
      return mockQueryApi.saveQueryVisualization(queryId, config)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${queryId}/visualization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to save query visualization: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error saving query visualization:', error)
      throw error
    }
  },
  
  // 导出查询结果
  async exportQueryResults(queryId: string, format: 'csv' | 'excel' | 'json'): Promise<void> {
    if (USE_MOCK_API) {
      return mockQueryApi.exportQueryResults(queryId, format)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${queryId}/export?format=${format}`)
      
      if (!response.ok) {
        throw new Error(`Failed to export query results: ${response.statusText}`)
      }
      
      // 处理文件下载
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `query-results-${queryId}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error(`Error exporting query results ${queryId}:`, error)
      throw error
    }
  },
  
  // 获取查询列表
  async getQueries(params?: { queryType?: string }): Promise<Query[]> {
    if (USE_MOCK_API) {
      return mockQueryApi.getQueries(params);
    }

    try {
      // 构建查询参数
      const queryParams = new URLSearchParams();
      if (params?.queryType) queryParams.append('queryType', params.queryType);
      
      // 发送请求
      const response = await fetch(`${API_BASE_URL}?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch queries: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching queries:', error);
      throw error;
    }
  },
  
  // 分析查询计划
  async analyzeQueryPlan(dataSourceId: string, queryText: string): Promise<any> {
    if (USE_MOCK_API) {
      // 判断是否需要添加此方法到mockQueryApi
      if (typeof mockQueryApi.analyzeQueryPlan === 'function') {
        return mockQueryApi.analyzeQueryPlan(dataSourceId, queryText)
      }
      return {
        plan: [],
        suggestions: []
      }
    }

    try {
      const requestBody = {
        dataSourceId,
        sql: queryText
      }

      // 使用查询计划分析API
      const response = await fetch(`${QUERY_PLANS_API_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
      
      if (!response.ok) {
        throw new Error(`分析查询计划失败: ${response.statusText}`)
      }
      
      // 处理响应数据
      const responseData = await response.json()
      const result = responseData.data || responseData // 兼容不同的响应格式
      
      return result
    } catch (error) {
      console.error('分析查询计划错误:', error)
      throw error
    }
  },
}

export default queryService