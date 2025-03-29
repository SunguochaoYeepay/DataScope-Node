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
const USE_MOCK_API = true

// API 基础路径
const API_BASE_URL = '/api/queries'

// 查询服务
export const queryService = {
  // 执行SQL查询
  async executeQuery(params: ExecuteQueryParams): Promise<QueryResult> {
    if (USE_MOCK_API) {
      return mockQueryApi.executeQuery(params)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to execute query: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error executing query:', error)
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
  
  // 获取查询历史
  async getQueryHistory(params: QueryHistoryParams): Promise<PageResponse<Query>> {
    if (USE_MOCK_API) {
      return mockQueryApi.getQueryHistory(params)
    }

    try {
      // 构建查询参数
      const queryParams = new URLSearchParams()
      if (params.dataSourceId) queryParams.append('dataSourceId', params.dataSourceId)
      if (params.queryType) queryParams.append('queryType', params.queryType)
      if (params.startDate) queryParams.append('startDate', params.startDate)
      if (params.endDate) queryParams.append('endDate', params.endDate)
      if (params.status) queryParams.append('status', params.status)
      if (params.page !== undefined) queryParams.append('page', params.page.toString())
      if (params.size) queryParams.append('size', params.size.toString())
      
      // 发送请求
      const response = await fetch(`${API_BASE_URL}/history?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch query history: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching query history:', error)
      throw error
    }
  },
  
  // 获取单个查询详情
  async getQuery(id: string): Promise<Query> {
    if (USE_MOCK_API) {
      const result = await mockQueryApi.getQuery(id)
      if (!result) {
        throw new Error(`Query with ID ${id} not found`)
      }
      return result
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch query: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Error fetching query ${id}:`, error)
      throw error
    }
  },
  
  // 保存查询
  async saveQuery(params: SaveQueryParams): Promise<Query> {
    if (USE_MOCK_API) {
      return mockQueryApi.saveQuery(params)
    }

    try {
      const method = params.id ? 'PUT' : 'POST'
      const url = params.id ? `${API_BASE_URL}/${params.id}` : API_BASE_URL
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to save query: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error saving query:', error)
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
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error(`Failed to delete query: ${response.statusText}`)
      }
      
      return true
    } catch (error) {
      console.error(`Error deleting query ${id}:`, error)
      throw error
    }
  },
  
  // 收藏查询
  async favoriteQuery(id: string): Promise<QueryFavorite> {
    if (USE_MOCK_API) {
      return mockQueryApi.favoriteQuery(id)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${id}/favorite`, {
        method: 'POST'
      })
      
      if (!response.ok) {
        throw new Error(`Failed to favorite query: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Error favoriting query ${id}:`, error)
      throw error
    }
  },
  
  // 取消收藏查询
  async unfavoriteQuery(id: string): Promise<boolean> {
    if (USE_MOCK_API) {
      return mockQueryApi.unfavoriteQuery(id)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${id}/favorite`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error(`Failed to unfavorite query: ${response.statusText}`)
      }
      
      return true
    } catch (error) {
      console.error(`Error unfavoriting query ${id}:`, error)
      throw error
    }
  },
  
  // 获取查询收藏列表
  async getFavorites(): Promise<QueryFavorite[]> {
    if (USE_MOCK_API) {
      return mockQueryApi.getFavorites()
    }

    try {
      const response = await fetch(`${API_BASE_URL}/favorites`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch query favorites: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching query favorites:', error)
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
      const response = await fetch(`${API_BASE_URL}/${queryId}/execution-plan`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch execution plan: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Error fetching execution plan for ${queryId}:`, error)
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
  }
}

export default queryService