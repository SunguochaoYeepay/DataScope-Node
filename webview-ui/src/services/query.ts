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
  ChartConfig
} from '@/types/query'
import { mockQueryApi } from '@/mocks/query'

// 使用环境变量判断是否使用模拟API - 可导出用于测试
export const isUsingMockApi = () => {
  return import.meta.env.VITE_USE_MOCK_API === 'true'
}

// API 基础路径
export const getApiBaseUrl = () => {
  // 只返回基础URL，不包含API路径前缀
  return import.meta.env.VITE_API_BASE_URL || '';
}

export const getQueryPlansApiUrl = () => {
  return `${import.meta.env.VITE_API_BASE_URL || ''}/api/query-plans`;
}

// 查询服务
export const queryService = {
  // 执行SQL查询
  async executeQuery(params: ExecuteQueryParams): Promise<QueryResult> {
    if (isUsingMockApi()) {
      return mockQueryApi.executeQuery(params)
    }

    try {
      // 验证查询参数
      if (!params.dataSourceId) {
        throw new Error('执行查询失败: 缺少数据源ID')
      }
      
      if (!params.queryText || params.queryText.trim() === '') {
        throw new Error('执行查询失败: SQL语句不能为空')
      }
      
      // 验证SQL语法的基本完整性
      const trimmedSQL = params.queryText.trim();
      if (trimmedSQL === 'SELECT *' || trimmedSQL === 'SELECT * FROM') {
        throw new Error('执行查询失败: 不完整的SQL语句，请指定表名')
      }

      // 构建符合后端格式的请求体
      const requestBody = {
        dataSourceId: params.dataSourceId,
        sql: params.queryText, // 前端QueryText转为后端的sql
        limit: params.limit,
        offset: params.offset,
        params: params.parameters // 后端API使用params而不是parameters
      }

      console.log('执行查询请求:', requestBody);

      const response = await fetch(`${getApiBaseUrl()}/api/queries/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
      
      // 处理非200响应
      if (!response.ok) {
        let errorMessage = `执行查询失败: ${response.statusText}`;
        
        try {
          // 尝试从响应体中获取更详细的错误信息
          const errorData = await response.json();
          if (errorData) {
            if (errorData.error && typeof errorData.error === 'object') {
              // 后端API文档中的错误格式
              errorMessage = `执行查询失败: ${errorData.error.message || errorData.error.error}`;
              if (errorData.error.details && errorData.error.details.length > 0) {
                errorMessage += ` (${errorData.error.details.map((d: any) => d.message).join(', ')})`;
              }
            } else if (errorData.message) {
              errorMessage = `执行查询失败: ${errorData.message}`;
            } else if (errorData.error && typeof errorData.error === 'string') {
              errorMessage = `执行查询失败: ${errorData.error}`;
            }
          }
        } catch (e) {
          // 如果无法解析JSON，使用默认错误消息
          console.error('无法解析错误响应:', e);
        }
        
        throw new Error(errorMessage);
      }
      
      // 处理响应数据 - 注意后端返回的格式可能是 { success: true, data: {...} }
      const responseData = await response.json()
      console.log('查询结果原始数据:', responseData)
      
      // 根据后端API响应格式进行处理
      let result: any;
      
      if (responseData.success && responseData.data) {
        // 后端API文档中的标准成功响应
        if (responseData.data.columns && responseData.data.rows) {
          result = responseData.data;
        } else if (responseData.data.history && Array.isArray(responseData.data.history) && responseData.data.history.length > 0) {
          // 查询历史API的响应格式
          const latestHistory = responseData.data.history[0];
          result = {
            id: latestHistory.id,
            columns: latestHistory.columns || [],
            columnTypes: latestHistory.columnTypes || [],
            rows: latestHistory.rows || [],
            rowCount: latestHistory.rowCount || 0,
            executionTime: latestHistory.duration || 0,
            hasMore: false,
            status: 'COMPLETED',
            createdAt: latestHistory.createdAt
          };
        } else {
          // 其他响应格式
          result = responseData.data;
        }
      } else {
        // 直接返回结果的情况
        result = responseData;
      }
      
      console.log('处理后的结果数据:', result);
      
      // 确保返回结果符合前端QueryResult类型
      return {
        id: result.metadata?.queryId || result.id || Math.random().toString(36).substring(2, 15),
        columns: Array.isArray(result.columns) 
          ? result.columns.map((col: any) => typeof col === 'string' ? col : col.name)
          : result.columns || [],
        columnTypes: Array.isArray(result.columns) && typeof result.columns[0] !== 'string'
          ? result.columns.map((col: any) => col.type)
          : result.columnTypes || [],
        rows: result.rows || [],
        rowCount: result.metadata?.rowCount || result.rowCount || result.rows?.length || 0,
        executionTime: result.metadata?.executionTime || result.executionTime || 0,
        hasMore: !!result.metadata?.totalRows && result.metadata.totalRows > (result.rowCount || result.rows?.length || 0),
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
    if (isUsingMockApi()) {
      return mockQueryApi.executeNaturalLanguageQuery(params)
    }

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/queries/natural-language`, {
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
    if (isUsingMockApi()) {
      return mockQueryApi.cancelQuery(id)
    }

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/queries/${id}/cancel`, {
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
    if (isUsingMockApi()) {
      return mockQueryApi.getQueryStatus(id)
    }

    try {
      const response = await fetch(`${getApiBaseUrl()}/${id}/status`)
      
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
    if (isUsingMockApi()) {
      return mockQueryApi.getQueryHistory(params)
    }

    try {
      const { page = 1, size = 10, dataSourceId, queryType, startDate, endDate, searchTerm, status } = params
      
      // 构建查询参数
      const queryParams = new URLSearchParams()
      queryParams.append('page', page.toString())
      queryParams.append('size', size.toString())
      
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
      
      if (status) {
        queryParams.append('status', status)
      }
      
      console.log('Query history request params:', Object.fromEntries(queryParams.entries()));

      // 使用相对路径请求API - 修复URL路径重复问题
      const apiUrl = `${getApiBaseUrl()}/api/queries/history?${queryParams.toString()}`
      console.log('Query history API URL:', apiUrl)
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API response not OK:', response.status, errorText)
        throw new Error(`Failed to fetch query history: ${response.status} ${response.statusText}`)
      }

      const responseData = await response.json()
      console.log('Query history raw response:', responseData)
      
      // 如果API返回错误状态
      if (responseData && responseData.success === false) {
        console.error('API returned failure:', responseData.message || 'Unknown error')
        throw new Error(responseData.message || 'API returned failure status')
      }
      
      // 提取并规范化数据部分 - 处理所有可能的响应格式
      const responseBody = responseData.success === true ? responseData.data : responseData
      
      // 提取历史记录数组 - 适应多种可能的字段名
      let historyItems = []
      if (responseBody && typeof responseBody === 'object') {
        if (Array.isArray(responseBody)) {
          // 直接返回数组的情况
          historyItems = responseBody
        } else if (Array.isArray(responseBody.history)) {
          // {history: [...]} 格式
          historyItems = responseBody.history
        } else if (Array.isArray(responseBody.items)) {
          // {items: [...]} 格式
          historyItems = responseBody.items
        } else if (responseBody.data && Array.isArray(responseBody.data)) {
          // {data: [...]} 格式
          historyItems = responseBody.data
        }
      }
      
      console.log(`Got ${historyItems.length} history items`)
      
      // 提取分页信息
      let totalItems = historyItems.length
      let totalPages = 1
      let currentPage = Number(page)
      let pageSize = Number(size)
      
      // 从响应中尝试提取分页信息
      if (responseBody && typeof responseBody === 'object') {
        // 尝试获取total
        if (responseBody.total !== undefined) {
          totalItems = Number(responseBody.total)
        } else if (responseBody.pagination && responseBody.pagination.total !== undefined) {
          totalItems = Number(responseBody.pagination.total)
        }
        
        // 尝试获取totalPages
        if (responseBody.totalPages !== undefined) {
          totalPages = Number(responseBody.totalPages)
        } else if (responseBody.pagination && responseBody.pagination.totalPages !== undefined) {
          totalPages = Number(responseBody.pagination.totalPages)
        } else {
          // 如果没有提供totalPages，则根据total和size计算
          totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
        }
        
        // 尝试获取当前页码
        if (responseBody.page !== undefined) {
          currentPage = Number(responseBody.page)
        } else if (responseBody.pagination && responseBody.pagination.page !== undefined) {
          currentPage = Number(responseBody.pagination.page)
        }
        
        // 尝试获取页大小
        if (responseBody.size !== undefined) {
          pageSize = Number(responseBody.size) 
        } else if (responseBody.pagination && responseBody.pagination.size !== undefined) {
          pageSize = Number(responseBody.pagination.size)
        }
      }
      
      console.log('Pagination info:', { currentPage, pageSize, totalItems, totalPages })
      
      // 将原始数据映射为前端所需的Query对象格式
      const mappedItems = historyItems.map((item: any) => {
        // 确保每个字段都有合理的默认值
        const query: Query = {
          id: item.id || `query-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: item.name || `查询 ${item.id ? item.id.substring(0, 8) : '未命名'}`,
          dataSourceId: item.dataSourceId || '',
          queryType: (item.queryType as QueryType) || 'SQL',
          queryText: item.sqlContent || item.sql || item.queryText || '',
          status: (item.status as QueryStatus) || 'COMPLETED',
          createdAt: item.startTime || item.createdAt || new Date().toISOString(),
          updatedAt: item.endTime || item.updatedAt || new Date().toISOString(),
          executionTime: item.duration || item.executionTime,
          resultCount: item.rowCount || item.resultCount || 0,
          error: item.errorMessage || item.error,
          isFavorite: item.isFavorite || false
        }
        return query
      })
      
      // 返回标准化的分页响应对象
      return {
        items: mappedItems,
        page: currentPage,
        size: pageSize,
        total: totalItems,
        totalPages: totalPages
      }
    } catch (error) {
      console.error('Error in getQueryHistory:', error)
      // 重新抛出错误，让调用者处理
      throw error
    }
  },
  
  // 获取单个查询信息
  async getQuery(id: string): Promise<Query | null> {
    if (isUsingMockApi()) {
      return mockQueryApi.getQuery(id)
    }

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/queries/${id}`, {
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
    if (isUsingMockApi()) {
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
      const url = params.id ? `${getApiBaseUrl()}/api/queries/${params.id}` : `${getApiBaseUrl()}/api/queries`

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
    if (isUsingMockApi()) {
      return mockQueryApi.deleteQuery(id)
    }

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/queries/${id}`, {
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
    if (isUsingMockApi()) {
      return mockQueryApi.favoriteQuery(queryId)
    }

    try {
      // 使用正确的API路径和请求头
      const response = await fetch(`${getApiBaseUrl()}/api/queries/${queryId}/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`收藏查询失败: ${response.statusText}`)
      }

      const responseData = await response.json()
      // 处理不同的响应格式
      const result = responseData.success && responseData.data ? responseData.data : responseData

      // 适配响应结果为QueryFavorite格式
      return {
        id: result.id || `fav-${queryId}`,
        queryId: result.queryId || queryId,
        name: result.name || `收藏的查询 ${queryId.substring(0, 8)}`,
        description: result.description || '',
        createdAt: result.createdAt || new Date().toISOString(),
        updatedAt: result.updatedAt || new Date().toISOString()
      }
    } catch (error) {
      console.error('收藏查询失败:', error)
      throw error
    }
  },
  
  // 取消收藏查询
  async unfavoriteQuery(queryId: string): Promise<boolean> {
    if (isUsingMockApi()) {
      return mockQueryApi.unfavoriteQuery(queryId)
    }

    try {
      // 使用正确的API路径和请求头
      const response = await fetch(`${getApiBaseUrl()}/api/queries/${queryId}/favorite`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`取消收藏查询失败: ${response.statusText}`)
      }

      // 处理响应，有些API返回204 No Content
      if (response.status === 204) {
        return true
      }

      // 如果有响应体，则解析它
      const responseData = await response.json().catch(() => ({ success: true }))
      return responseData.success !== false
    } catch (error) {
      console.error('取消收藏查询失败:', error)
      throw error
    }
  },
  
  // 获取收藏的查询列表
  async getFavorites(): Promise<QueryFavorite[]> {
    if (isUsingMockApi()) {
      return mockQueryApi.getFavorites()
    }

    try {
      // 使用标准API路径获取收藏列表
      const response = await fetch(`${getApiBaseUrl()}/api/queries/favorites`, {
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
    if (isUsingMockApi()) {
      return mockQueryApi.saveDisplayConfig(queryId, config)
    }

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/queries/${queryId}/display-config`, {
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
    if (isUsingMockApi()) {
      return mockQueryApi.getDisplayConfig(queryId)
    }

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/queries/${queryId}/display-config`)
      
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
    if (isUsingMockApi()) {
      return mockQueryApi.getQueryExecutionPlan(queryId)
    }

    try {
      // 使用正确的API路径获取查询执行计划
      const response = await fetch(`${getApiBaseUrl()}/api/queries/${queryId}/execution-plan`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      })
      
      if (!response.ok) {
        // 如果返回404，尝试获取查询计划
        if (response.status === 404) {
          // 尝试使用plans路径获取
          return this.getQueryPlanById(queryId);
        }
        throw new Error(`获取查询执行计划失败: ${response.statusText}`)
      }
      
      // 解析响应数据
      const responseData = await response.json()
      const result = responseData.data || responseData // 兼容不同的响应格式
      
      // 确保返回的数据结构符合QueryExecutionPlan
      const plan: QueryExecutionPlan = {
        id: result.id || `plan-${queryId}`,
        queryId: result.queryId || queryId,
        planDetails: result.planDetails || {
          steps: [],
          totalCost: 0,
          estimatedRows: 0
        },
        estimatedCost: result.estimatedCost,
        estimatedRows: result.estimatedRows,
        createdAt: result.createdAt || new Date().toISOString()
      }
      
      return plan
    } catch (error) {
      console.error(`获取查询执行计划错误:`, error)
      throw error
    }
  },
  
  // 根据计划ID获取查询计划
  async getQueryPlanById(planId: string): Promise<QueryExecutionPlan> {
    if (isUsingMockApi()) {
      return mockQueryApi.getQueryExecutionPlan(planId)
    }

    try {
      // 使用查询计划API地址
      const response = await fetch(`${getQueryPlansApiUrl()}/${planId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`获取查询计划失败: ${response.statusText}`)
      }
      
      // 处理响应数据
      const responseData = await response.json()
      const result = responseData.data || responseData // 兼容不同的响应格式
      
      return {
        id: result.id || `plan-${planId}`,
        queryId: result.queryId || planId,
        planDetails: result.planDetails || {
          steps: [],
          totalCost: 0,
          estimatedRows: 0
        },
        estimatedCost: result.estimatedCost,
        estimatedRows: result.estimatedRows,
        createdAt: result.createdAt || new Date().toISOString()
      }
    } catch (error) {
      console.error(`获取查询计划错误:`, error)
      throw error
    }
  },
  
  // 获取查询优化建议
  async getQuerySuggestions(queryId: string): Promise<QuerySuggestion[]> {
    if (isUsingMockApi()) {
      return mockQueryApi.getQuerySuggestions(queryId)
    }

    try {
      // 使用正确的API路径获取查询优化建议
      const response = await fetch(`${getApiBaseUrl()}/api/queries/plans/${queryId}/tips`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      })
      
      // 如果没有优化建议，返回空数组而不是错误
      if (response.status === 404) {
        return [];
      }
      
      if (!response.ok) {
        throw new Error(`获取查询优化建议失败: ${response.statusText}`)
      }
      
      // 解析响应数据
      const responseData = await response.json()
      const result = responseData.data || responseData
      
      // 确保结果是数组
      if (!Array.isArray(result)) {
        if (result && typeof result === 'object') {
          // 如果结果是单个对象，将其包装为数组
          return [formatSuggestion(result, queryId)];
        }
        return [];
      }
      
      // 映射为标准格式
      return result.map(item => formatSuggestion(item, queryId));
    } catch (error) {
      console.error('获取查询优化建议失败:', error)
      // 返回空数组而不是抛出错误，避免中断用户体验
      return []
    }
  },
  
  // 获取查询可视化
  async getQueryVisualization(queryId: string): Promise<QueryVisualization | null> {
    if (isUsingMockApi()) {
      return mockQueryApi.getQueryVisualization(queryId)
    }

    try {
      // 使用正确的API路径获取查询可视化数据
      const response = await fetch(`${getApiBaseUrl()}/api/queries/${queryId}/visualization`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      })
      
      if (response.status === 404) {
        return null // 没有找到可视化配置
      }
      
      if (!response.ok) {
        throw new Error(`获取查询可视化失败: ${response.statusText}`)
      }
      
      // 解析响应数据
      const responseData = await response.json()
      const result = responseData.data || responseData
      
      // 确保返回数据符合QueryVisualization格式
      return {
        id: result.id || `visual-${queryId}`,
        queryId: result.queryId || queryId,
        nodes: result.nodes || [],
        displayType: result.displayType || 'TABLE',
        chartType: result.chartType,
        title: result.title,
        description: result.description,
        config: result.config || {},
        createdAt: result.createdAt || new Date().toISOString()
      }
    } catch (error) {
      // 如果是404错误，我们返回null而不是抛出错误
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      console.error(`获取查询可视化失败: ${queryId}`, error)
      throw error
    }
  },
  
  // 保存查询可视化
  async saveQueryVisualization(queryId: string, config: ChartConfig): Promise<QueryVisualization> {
    if (isUsingMockApi()) {
      return mockQueryApi.saveQueryVisualization(queryId, config)
    }

    try {
      // 使用正确的API路径和请求头保存查询可视化
      const response = await fetch(`${getApiBaseUrl()}/api/queries/${queryId}/visualization`, {
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

  // 获取查询计划历史列表
  async getQueryPlans(params: { page?: number; size?: number; queryId?: string } = {}): Promise<PageResponse<QueryExecutionPlan>> {
    if (isUsingMockApi()) {
      // 如果mockQueryApi中有此方法则调用，否则返回空结果
      return { items: [], total: 0, page: 0, size: 10, totalPages: 0 };
    }

    try {
      // 构建查询参数
      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', params.page.toString());
      if (params.size !== undefined) queryParams.append('size', params.size.toString());
      if (params.queryId) queryParams.append('queryId', params.queryId);

      // 使用查询计划API地址
      const response = await fetch(`${getQueryPlansApiUrl()}?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`获取查询计划历史失败: ${response.statusText}`);
      }

      // 解析响应数据
      const responseJson = await response.json();
      console.log('查询计划历史API响应:', responseJson);

      if (!responseJson.success) {
        throw new Error(responseJson.message || '获取查询计划历史失败: API返回失败状态');
      }

      // 使用统一的数据结构格式
      const data = responseJson.data;
      const items = data.items || []; // 现在使用统一的items字段
      
      // 处理分页信息
      const pagination = data.pagination || {};
      const total = pagination.total || 0;
      const currentPage = pagination.page !== undefined ? pagination.page : (params.page || 0);
      const pageSize = pagination.size !== undefined ? pagination.size : (params.size || 10);
      const totalPages = pagination.totalPages || data.totalPages || Math.ceil(total / pageSize);

      // 转换为标准的QueryExecutionPlan对象数组
      return {
        items: items.map((item: any) => ({
          id: item.id || `plan-${Math.random().toString(36).substring(2, 9)}`,
          queryId: item.queryId,
          planDetails: item.planDetails || {
            steps: [],
            totalCost: 0,
            estimatedRows: 0
          },
          estimatedCost: item.estimatedCost,
          estimatedRows: item.estimatedRows,
          createdAt: item.createdAt || new Date().toISOString()
        })),
        total,
        page: currentPage,
        size: pageSize,
        totalPages
      };
    } catch (error) {
      console.error('获取查询计划历史失败:', error);
      throw error;
    }
  },
}

// 格式化查询优化建议函数
function formatSuggestion(data: any, queryId: string): QuerySuggestion {
  return {
    id: data.id || `suggestion-${Math.random().toString(36).substring(2, 9)}`,
    queryId: data.queryId || queryId,
    type: data.type || 'OPTIMIZATION',
    title: data.title || '优化建议',
    description: data.description || data.message || '提高查询性能的建议',
    suggestedQuery: data.suggestedQuery || data.query || '',
    impact: data.impact || 'MEDIUM',
    createdAt: data.createdAt || new Date().toISOString()
  };
}

export default queryService