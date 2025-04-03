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
  QueryExecution
} from '@/types/query'
import axios from 'axios'

// API 基础路径
export const getApiBaseUrl = () => {
  // 始终使用环境变量中配置的API基础URL，不使用任何代理
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  // 确保URL正确格式化（无斜杠结尾）
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}

export const getQueryPlansApiUrl = () => {
  return `${import.meta.env.VITE_API_BASE_URL || ''}/api/query-plans`;
}

/**
 * 格式化执行计划
 * @param data 原始执行计划数据
 * @param queryId 查询ID
 * @returns 格式化后的执行计划
 */
function formatExecutionPlan(data: any, queryId: string): QueryExecutionPlan {
  return {
    id: data.id || `plan-${queryId}`,
    queryId,
    plan: data.plan || data,
    estimatedCost: data.estimatedCost || 0,
    estimatedRows: data.estimatedRows || 0,
    planningTime: data.planningTime,
    executionTime: data.executionTime,
    createdAt: data.createdAt || new Date().toISOString()
  };
}

/**
 * 格式化查询建议
 * @param data 原始建议数据
 * @param queryId 查询ID
 * @returns 格式化后的查询建议
 */
function formatSuggestion(data: any, queryId: string): QuerySuggestion {
  return {
    id: data.id || `suggestion-${queryId}-${Date.now()}`,
    queryId,
    type: data.type || 'OPTIMIZATION',
    title: data.title || '查询优化建议',
    description: data.description || '',
    suggestion: data.suggestion || '',
    impact: data.impact || 'medium',
    createdAt: data.createdAt || new Date().toISOString()
  };
}

// 查询服务
export const queryService = {
  // 执行SQL查询
  async executeQuery(params: ExecuteQueryParams): Promise<QueryResult> {
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
        maxRows: params.maxRows,
        timeout: params.timeout,
        params: params.parameters // 后端API使用params而不是parameters
      }

      console.log('执行查询请求:', requestBody);
      console.log('数据源ID:', params.dataSourceId);
      console.log('SQL查询:', params.queryText);

      // 进行额外验证，确保dataSourceId非空且有效
      if (!requestBody.dataSourceId || requestBody.dataSourceId === 'undefined' || requestBody.dataSourceId === 'null') {
        throw new Error('执行查询失败: 数据源ID无效或为空');
      }

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
        result = responseData.data;
        
        // 如果data中包含fields字段，使用它作为columns
        if (result.fields && Array.isArray(result.fields)) {
          result.columns = result.fields;
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
          : (Array.isArray(result.fields) 
             ? result.fields.map((field: any) => typeof field === 'string' ? field : field.name)
             : result.columns || []),
        columnTypes: Array.isArray(result.columns) && typeof result.columns[0] !== 'string'
          ? result.columns.map((col: any) => col.type)
          : (Array.isArray(result.fields) && typeof result.fields[0] !== 'string'
             ? result.fields.map((field: any) => field.type)
             : result.columnTypes || []),
        rows: result.rows || [],
        rowCount: result.metadata?.rowCount || result.rowCount || result.totalCount || result.rows?.length || 0,
        executionTime: result.metadata?.executionTime || result.executionTime || 0,
        hasMore: !!result.metadata?.totalRows && result.metadata.totalRows > (result.rowCount || result.rows?.length || 0),
        status: result.status || 'COMPLETED',
        error: result.error,
        createdAt: result.createdAt || new Date().toISOString(),
        data: {
          fields: result.fields,
          rows: result.rows,
          rowCount: result.rowCount,
          page: result.page,
          pageSize: result.pageSize,
          totalCount: result.totalCount,
          totalPages: result.totalPages
        }
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
      
      console.log('查询历史请求参数对象:', Object.fromEntries(queryParams.entries()));

      // 使用标准API URL - 改回使用5000端口
      const apiUrl = `${getApiBaseUrl()}/api/queries/history?${queryParams.toString()}`
      console.log('查询历史API URL:', apiUrl)
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API响应错误:', response.status, errorText)
        throw new Error(`获取查询历史失败: ${response.status} ${response.statusText}`)
      }

      const responseData = await response.json()
      console.log('查询历史原始响应:', JSON.stringify(responseData).substring(0, 500) + '...')
      
      // 如果API返回错误状态
      if (responseData && responseData.success === false) {
        console.error('API返回失败状态:', responseData.message || '未知错误')
        throw new Error(responseData.message || 'API返回失败状态')
      }
      
      // 提取并规范化数据部分 - 处理所有可能的响应格式
      const responseBody = responseData.success === true ? responseData.data : responseData
      console.log('提取的响应主体:', JSON.stringify(responseBody).substring(0, 500) + '...')
      
      // 提取历史记录数组 - 适应多种可能的字段名
      let historyItems = []
      if (responseBody && typeof responseBody === 'object') {
        if (Array.isArray(responseBody)) {
          // 直接返回数组的情况
          historyItems = responseBody
          console.log('响应是数组格式')
        } else if (Array.isArray(responseBody.history)) {
          // {history: [...]} 格式
          historyItems = responseBody.history
          console.log('响应使用history字段')
        } else if (Array.isArray(responseBody.items)) {
          // {items: [...]} 格式
          historyItems = responseBody.items
          console.log('响应使用items字段')
        } else if (responseBody.data && Array.isArray(responseBody.data)) {
          // {data: [...]} 格式
          historyItems = responseBody.data
          console.log('响应使用data字段')
        }
      }
      
      console.log(`获取到 ${historyItems.length} 条历史记录`)
      if (historyItems.length > 0) {
        console.log('第一条记录示例:', JSON.stringify(historyItems[0]).substring(0, 300) + '...')
      }
      
      // 提取分页信息
      let totalItems = historyItems.length
      let totalPages = 1
      let currentPage = Number(page)
      let pageSize = Number(size)
      
      // 从响应中尝试提取分页信息
      if (responseBody && typeof responseBody === 'object') {
        // 记录所有可能包含分页信息的字段
        console.log('可能的分页信息字段:',
          responseBody.total !== undefined ? 'total' : '',
          responseBody.totalPages !== undefined ? 'totalPages' : '',
          responseBody.pagination !== undefined ? 'pagination' : ''
        )
        
        // 尝试获取total
        if (responseBody.total !== undefined) {
          totalItems = Number(responseBody.total)
          console.log('从total字段获取总数:', totalItems)
        } else if (responseBody.pagination && responseBody.pagination.total !== undefined) {
          totalItems = Number(responseBody.pagination.total)
          console.log('从pagination.total字段获取总数:', totalItems)
        }
        
        // 尝试获取totalPages
        if (responseBody.totalPages !== undefined) {
          totalPages = Number(responseBody.totalPages)
          console.log('从totalPages字段获取总页数:', totalPages)
        } else if (responseBody.pagination && responseBody.pagination.totalPages !== undefined) {
          totalPages = Number(responseBody.pagination.totalPages)
          console.log('从pagination.totalPages字段获取总页数:', totalPages)
        } else {
          // 如果没有提供totalPages，则根据total和size计算
          totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
          console.log('计算得到的总页数:', totalPages)
        }
        
        // 尝试获取当前页码
        if (responseBody.page !== undefined) {
          currentPage = Number(responseBody.page)
          console.log('从page字段获取当前页:', currentPage)
        } else if (responseBody.pagination && responseBody.pagination.page !== undefined) {
          currentPage = Number(responseBody.pagination.page)
          console.log('从pagination.page字段获取当前页:', currentPage)
        }
        
        // 尝试获取页大小
        if (responseBody.size !== undefined) {
          pageSize = Number(responseBody.size) 
          console.log('从size字段获取页大小:', pageSize)
        } else if (responseBody.pagination && responseBody.pagination.size !== undefined) {
          pageSize = Number(responseBody.pagination.size)
          console.log('从pagination.size字段获取页大小:', pageSize)
        } else if (responseBody.pagination && responseBody.pagination.pageSize !== undefined) {
          pageSize = Number(responseBody.pagination.pageSize)
          console.log('从pagination.pageSize字段获取页大小:', pageSize)
        }
      }
      
      console.log('最终分页信息:', { currentPage, pageSize, totalItems, totalPages })
      
      // 将原始数据转换为前端Query对象
      const queries: Query[] = historyItems.map((item: any): Query => ({
        id: item.id,
        name: item.name || '未命名查询',
        description: item.description || '',
        folderId: item.folderId,
        status: (item.status as QueryStatus) || 'COMPLETED',
        serviceStatus: item.serviceStatus || 'ENABLED',
        dataSourceId: item.dataSourceId || null,
        dataSourceName: item.dataSourceName || null,
        queryType: (item.queryType as QueryType) || 'SQL',
        queryText: item.sqlContent || item.sql || item.queryText || '',
        resultCount: item.resultCount || item.rowCount || 0,
        executionTime: item.duration || item.executionTime || 0,
        error: item.error || item.errorMessage,
        versionStatus: item.versionStatus || 'DRAFT',
        isActive: item.serviceStatus === 'ENABLED',
        currentVersion: item.versionNumber ? {
          id: item.currentVersionId || '',
          queryId: item.id,
          versionNumber: item.versionNumber,
          sql: item.sqlContent || item.sql || item.queryText || '',
          dataSourceId: item.dataSourceId || '',
          status: item.status || 'DRAFT',
          isLatest: true,
          createdAt: item.createdAt || new Date().toISOString()
        } : undefined,
        isFavorite: item.isFavorite || false,
        createdAt: item.startTime || item.createdAt || new Date().toISOString(),
        updatedAt: item.endTime || item.updatedAt || item.createdAt || new Date().toISOString(),
        executionCount: item.executionCount || 0,
        lastExecutedAt: item.lastExecutedAt,
        tags: item.tags || []
      }));
      
      console.log(`映射后得到 ${queries.length} 条记录`)
      if (queries.length > 0) {
        console.log('第一条映射后记录示例:', JSON.stringify(queries[0]).substring(0, 300) + '...')
      }
      
      // 返回标准化的分页响应对象
      return {
        items: queries,
        page: currentPage,
        size: pageSize,
        total: totalItems,
        totalPages: totalPages
      }
    } catch (error) {
      console.error('获取查询历史错误:', error)
      // 重新抛出错误，让调用者处理
      throw error
    }
  },
  
  // 获取单个查询信息
  async getQuery(id: string): Promise<Query | null> {
    try {
      console.log(`开始获取查询信息，ID: ${id}`)
      const response = await fetch(`${getApiBaseUrl()}/api/queries/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        console.log(`获取查询失败，状态码: ${response.status}`)
        if (response.status === 404) {
          return null
        }
        throw new Error(`获取查询失败: ${response.statusText}`)
      }

      const responseData = await response.json()
      console.log('后端返回的原始查询数据:', JSON.stringify(responseData).substring(0, 500))
      
      // 适配后端响应格式
      const result = responseData.data || responseData
      
      // 提取SQL内容，优先从sqlContent获取
      const sqlContent = result.sqlContent || result.sql || result.queryText || ''
      console.log(`从响应中提取的SQL内容: ${sqlContent}`)
      
      // 确保返回格式符合前端需要的Query类型
      return {
        id: result.id,
        name: result.name || `查询 ${result.id.substring(0, 8)}`,
        description: result.description || '',
        dataSourceId: result.dataSourceId,
        queryType: result.queryType || 'SQL',
        queryText: sqlContent,
        status: result.status || 'COMPLETED',
        createdAt: result.createdAt || new Date().toISOString(),
        updatedAt: result.updatedAt || new Date().toISOString(),
        executionTime: result.executionTime || 0,
        resultCount: result.resultCount || 0,
        error: result.error,
        isFavorite: result.isFavorite || false,
        executionCount: result.executionCount || 0,
        tags: result.tags || []
      }
    } catch (error) {
      console.error('获取查询错误:', error)
      throw error
    }
  },
  
  // 保存查询
  async saveQuery(params: SaveQueryParams): Promise<Query> {
    try {
      // 构建请求体，适配后端API格式
      const requestBody = {
        name: params.name || `未命名查询 ${new Date().toLocaleString('zh-CN')}`,
        sql: params.sql,
        description: params.description || '',
        dataSourceId: params.dataSourceId
      }

      console.log('保存查询，请求数据:', requestBody);

      // 根据是否有id判断是更新还是新增
      const isUpdate = params.id && params.id.trim() !== '';
      const method = isUpdate ? 'PUT' : 'POST';
      const url = isUpdate ? `${getApiBaseUrl()}/api/queries/${params.id}` : `${getApiBaseUrl()}/api/queries`;

      console.log(`保存查询，使用 ${method} 方法:`, url);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorText = await response.text();
        console.error('保存查询响应错误:', response.status, errorText);
        
        // 尝试解析错误响应
        try {
          const errorResponse = JSON.parse(errorText);
          if (errorResponse.error && errorResponse.error.code === 10006) {
            throw new Error('查询不存在，可能已被删除');
          }
        } catch (e) {
          // JSON解析失败，使用原始错误消息
          console.warn('无法解析错误响应:', e);
        }
        
        throw new Error(`保存查询失败: ${response.statusText}`);
      }

      const responseData = await response.json()
      console.log('保存查询响应数据:', responseData);
      
      const result = responseData.data || responseData

      // 验证返回的ID是否有效
      if (!result.id || typeof result.id !== 'string' || result.id.trim() === '') {
        console.error('保存查询响应中没有有效的ID:', result);
        throw new Error('服务器返回的查询ID无效')
      }

      // 转换返回结果为前端所需的Query对象
      const savedQuery: Query = {
        id: result.id,
        name: result.name || requestBody.name,
        dataSourceId: result.dataSourceId,
        queryType: result.queryType || params.queryType || 'SQL',
        queryText: result.sql || result.queryText || params.sql,
        status: 'COMPLETED', // 新保存的查询默认为已完成状态
        createdAt: result.createdAt || new Date().toISOString(),
        updatedAt: result.updatedAt || new Date().toISOString(),
        description: result.description || params.description,
        isFavorite: result.isFavorite || false,
        executionCount: result.executionCount || 0
      }
      
      console.log('转换后的查询对象:', savedQuery);
      
      // 保存到本地存储以便于恢复
      try {
        window.localStorage.setItem('last_saved_query_id', savedQuery.id);
        window.localStorage.setItem('last_saved_query', JSON.stringify({
          id: savedQuery.id,
          name: savedQuery.name,
          timestamp: new Date().toISOString()
        }));
      } catch (storageError) {
        console.warn('无法保存查询到本地存储:', storageError);
      }
      
      return savedQuery;
    } catch (error) {
      console.error('保存查询错误:', error)
      throw error
    }
  },
  
  // 删除查询
  async deleteQuery(id: string): Promise<boolean> {
    try {
      // 确保使用正确的API路径格式
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
        userId: result.userId || 'current-user', // 使用当前用户ID
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
      let result;
      
      // 处理标准响应格式: {success: true, data: {items: []}}
      if (responseData.success === true && responseData.data) {
        if (responseData.data.items && Array.isArray(responseData.data.items)) {
          result = responseData.data.items;
        } else if (Array.isArray(responseData.data)) {
          // 兼容旧格式: {success: true, data: []}
          result = responseData.data;
        } else {
          // 兼容旧格式: {success: true, data: {...}}
          result = [responseData.data];
        }
      } else if (Array.isArray(responseData)) {
        // 兼容极简格式: 直接返回数组
        result = responseData;
      } else {
        // 未知格式，尝试提取，默认为空数组
        result = responseData.items || responseData.list || responseData.favorites || [];
      }

      // 转换结果为前端所需的QueryFavorite数组
      return Array.isArray(result) ? result.map((item: any) => ({
        id: item.id,
        queryId: item.queryId,
        userId: item.userId || 'current-user', // 使用当前用户ID
        name: item.name || `收藏的查询 ${item.queryId.substring(0, 8)}`,
        description: item.description || '',
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
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/queries/${queryId}/display-config`)
      
      if (!response.ok) {
        if (response.status === 404) {
          // 无配置是正常的情况，返回null而不是抛出错误
          return null
        }
        throw new Error(`获取展示配置失败: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('获取展示配置错误:', error)
      throw error
    }
  },
  
  /**
   * 获取查询执行计划
   * @param queryId 查询ID
   * @returns 查询执行计划
   */
  async getQueryExecutionPlan(queryId: string): Promise<QueryExecutionPlan | null> {
    try {
      console.log(`开始获取查询执行计划，queryId: ${queryId}`);
      const url = `${getApiBaseUrl()}/api/queries/${queryId}/execution-plan`;
      console.log('执行计划API URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      // 输出响应状态用于调试
      console.log('执行计划API响应状态:', response.status, response.statusText);
      
      // 如果没有执行计划或请求无效，返回null而不是错误
      if (response.status === 404 || response.status === 400) {
        console.log('未找到执行计划或请求无效，返回null');
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`获取查询执行计划失败: ${response.statusText}`);
      }
      
      // 解析响应数据
      const responseText = await response.text();
      console.log('执行计划API原始响应:', responseText.substring(0, 200));
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error('解析执行计划响应JSON失败:', e);
        return null; // 返回null而不是抛出错误
      }
      
      const result = responseData.data || responseData;
      
      // 确保结果是对象
      if (typeof result !== 'object' || result === null) {
        console.log('执行计划响应不是对象，返回null');
        return null;
      }
      
      // 映射为标准格式
      const executionPlan = formatExecutionPlan(result, queryId);
      console.log('成功获取执行计划:', executionPlan);
      return executionPlan;
    } catch (error) {
      console.error('获取查询执行计划失败:', error);
      // 返回null而不是抛出错误
      return null;
    }
  },
  
  /**
   * 获取查询建议
   * @param queryId 查询ID
   * @returns 查询建议列表
   */
  async getQuerySuggestions(queryId: string): Promise<QuerySuggestion[]> {
    try {
      // 使用正确的API路径获取查询优化建议
      console.log('获取查询优化建议，queryId:', queryId);
      const url = `${getApiBaseUrl()}/api/queries/${queryId}/suggestions`;
      console.log('优化建议API URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      // 输出响应状态用于调试
      console.log('优化建议API响应状态:', response.status, response.statusText);
      
      // 如果没有优化建议或请求无效，返回空数组而不是错误
      if (response.status === 404 || response.status === 400) {
        console.log('未找到优化建议或请求无效，返回空数组');
        return [];
      }
      
      if (!response.ok) {
        throw new Error(`获取查询优化建议失败: ${response.statusText}`);
      }
      
      // 解析响应数据
      const responseText = await response.text();
      console.log('优化建议API原始响应:', responseText.substring(0, 200));
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error('解析优化建议响应JSON失败:', e);
        return []; // 返回空数组而不是抛出错误
      }
      
      const result = responseData.data || responseData;
      
      // 确保结果是数组
      if (!Array.isArray(result)) {
        if (result && typeof result === 'object') {
          // 如果结果是单个对象，将其包装为数组
          console.log('优化建议响应是单个对象，包装为数组');
          return [formatSuggestion(result, queryId)];
        }
        console.log('优化建议响应不是数组也不是对象，返回空数组');
        return [];
      }
      
      // 映射为标准格式
      const suggestions = result.map(item => formatSuggestion(item, queryId));
      console.log('成功获取优化建议数量:', suggestions.length);
      return suggestions;
    } catch (error) {
      console.error('获取查询优化建议失败:', error);
      // 返回空数组而不是抛出错误
      return [];
    }
  },
  
  /**
   * 获取查询列表
   * @param params 查询参数
   * @returns 分页查询结果
   */
  async getQueries(params: QueryHistoryParams = { page: 1, size: 10 }): Promise<PageResponse<Query>> {
    try {
      // 构建查询参数
      const queryParams = new URLSearchParams();
      queryParams.append('page', params.page.toString());
      queryParams.append('size', params.size.toString());

      if (params.queryType) {
        queryParams.append('queryType', params.queryType);
      }
      if (params.status) {
        queryParams.append('status', params.status);
      }
      if (params.dataSourceId) {
        queryParams.append('dataSourceId', params.dataSourceId);
      }
      if (params.search) {
        queryParams.append('search', params.search);
      }
      if (params.sortBy) {
        queryParams.append('sortBy', params.sortBy);
      }
      if (params.sortDir) {
        queryParams.append('sortDir', params.sortDir);
      }

      console.log('获取查询列表，参数:', Object.fromEntries(queryParams.entries()));
      const url = `${getApiBaseUrl()}/api/queries?${queryParams.toString()}`;
      console.log('查询列表API URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('获取查询列表失败:', response.status, errorText);
        throw new Error(`获取查询列表失败: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('查询列表原始响应:', responseData);

      // 处理响应数据
      const result = responseData.data || responseData;
      const items = Array.isArray(result.items) ? result.items : (Array.isArray(result) ? result : []);

      // 转换为Query对象
      const queries = items.map((item: any): Query => ({
        id: item.id,
        name: item.name || '未命名查询',
        description: item.description || '',
        folderId: item.folderId,
        status: (item.status as QueryStatus) || 'COMPLETED',
        serviceStatus: item.serviceStatus || 'ENABLED',
        dataSourceId: item.dataSourceId || null,
        dataSourceName: item.dataSourceName || null,
        queryType: (item.queryType as QueryType) || 'SQL',
        queryText: item.sqlContent || item.sql || item.queryText || '',
        resultCount: item.resultCount || item.rowCount || 0,
        executionTime: item.duration || item.executionTime || 0,
        error: item.error || item.errorMessage,
        versionStatus: item.versionStatus || 'DRAFT',
        isActive: item.serviceStatus === 'ENABLED',
        currentVersion: item.versionNumber ? {
          id: item.currentVersionId || '',
          queryId: item.id,
          versionNumber: item.versionNumber,
          sql: item.sqlContent || item.sql || item.queryText || '',
          dataSourceId: item.dataSourceId || '',
          status: item.status || 'DRAFT',
          isLatest: true,
          createdAt: item.createdAt || new Date().toISOString()
        } : undefined,
        isFavorite: item.isFavorite || false,
        createdAt: item.startTime || item.createdAt || new Date().toISOString(),
        updatedAt: item.endTime || item.updatedAt || item.createdAt || new Date().toISOString(),
        executionCount: item.executionCount || 0,
        lastExecutedAt: item.lastExecutedAt,
        tags: item.tags || []
      }));

      // 返回标准分页响应
      return {
        items: queries,
        total: result.total || result.totalCount || items.length,
        page: result.page || result.currentPage || params.page,
        size: result.size || result.pageSize || params.size,
        totalPages: result.totalPages || Math.ceil((result.total || items.length) / params.size)
      };
    } catch (error) {
      console.error('获取查询列表错误:', error);
      throw error;
    }
  },
  
  /**
   * 获取查询执行历史
   * @param queryId 查询ID
   * @returns 查询执行历史列表
   */
  async getQueryExecutionHistory(queryId: string): Promise<QueryExecution[]> {
    try {
      if (!queryId) {
        console.error('获取查询执行历史失败: 查询ID为空');
        return [];
      }
      
      console.log('获取查询执行历史，queryId:', queryId);
      const url = `${getApiBaseUrl()}/api/queries/${queryId}/execution-history`;
      console.log('执行历史API URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      // 输出响应状态用于调试
      console.log('执行历史API响应状态:', response.status, response.statusText);
      
      // 如果没有执行历史或请求无效，返回空数组而不是错误
      if (response.status === 404 || response.status === 400) {
        console.log('未找到执行历史或请求无效，返回空数组');
        return [];
      }
      
      if (!response.ok) {
        throw new Error(`获取查询执行历史失败: ${response.statusText}`);
      }
      
      // 解析响应数据
      const responseText = await response.text();
      console.log('执行历史API原始响应:', responseText.substring(0, 200));
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error('解析执行历史响应JSON失败:', e);
        return []; // 返回空数组而不是抛出错误
      }
      
      const result = responseData.data || responseData;
      
      // 确保结果是数组
      if (!Array.isArray(result)) {
        if (result && typeof result === 'object') {
          // 如果结果是单个对象，将其包装为数组
          console.log('执行历史响应是单个对象，包装为数组');
          return [result];
        }
        console.log('执行历史响应不是数组也不是对象，返回空数组');
        return [];
      }
      
      // 确保每个历史记录都有必要的字段
      const history = result.map(item => ({
        id: item.id,
        queryId: item.queryId || queryId,
        executedAt: item.executedAt || item.startTime || new Date().toISOString(),
        executionTime: item.executionTime || item.duration || 0,
        status: item.status || 'COMPLETED',
        rowCount: item.rowCount || 0,
        errorMessage: item.errorMessage || item.error
      }));
      
      console.log('成功获取执行历史数量:', history.length);
      return history;
    } catch (error) {
      console.error('获取查询执行历史失败:', error);
      // 返回空数组而不是抛出错误
      return [];
    }
  },
  
  /**
   * 获取版本执行结果
   * @param queryId 查询ID
   * @param versionId 版本ID
   * @returns 查询结果
   */
  async getVersionExecutionResult(queryId: string, versionId: string): Promise<QueryResult | null> {
    try {
      if (!queryId || !versionId) {
        console.error('获取版本执行结果失败: 查询ID或版本ID为空');
        return null;
      }
      
      console.log('获取版本执行结果，queryId:', queryId, 'versionId:', versionId);
      const url = `${getApiBaseUrl()}/api/queries/${queryId}/versions/${versionId}/results`;
      console.log('版本执行结果API URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      // 输出响应状态用于调试
      console.log('版本执行结果API响应状态:', response.status, response.statusText);
      
      // 如果没有执行结果或请求无效，返回null而不是错误
      if (response.status === 404 || response.status === 400) {
        console.log('未找到版本执行结果或请求无效，返回null');
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`获取版本执行结果失败: ${response.statusText}`);
      }
      
      // 解析响应数据
      const responseData = await response.json();
      console.log('版本执行结果API响应:', responseData);
      
      // 处理响应数据
      const result = responseData.data || responseData;
      
      // 转换为标准格式
      const queryResult: QueryResult = {
        id: result.id || `result-${queryId}-${versionId}`,
        queryId: queryId,
        status: result.status || 'COMPLETED',
        createdAt: result.createdAt || new Date().toISOString(),
        executionTime: result.executionTime || result.duration || 0,
        rowCount: result.rowCount || (result.rows ? result.rows.length : 0),
        rows: result.rows || [],
        columns: result.columns || [],
        columnTypes: result.columnTypes || [],
        fields: result.fields || [],
        error: result.error || result.errorMessage
      };
      
      return queryResult;
    } catch (error) {
      console.error('获取版本执行结果失败:', error);
      return null;
    }
  },
  
  /**
   * 获取查询结果
   * @param queryId 查询ID
   * @returns 查询结果
   */
  async getQueryResult(queryId: string): Promise<QueryResult | null> {
    try {
      if (!queryId) {
        console.error('获取查询结果失败: 查询ID为空');
        return null;
      }
      
      console.log('获取查询结果，queryId:', queryId);
      const url = `${getApiBaseUrl()}/api/queries/${queryId}/results`;
      console.log('查询结果API URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      // 输出响应状态用于调试
      console.log('查询结果API响应状态:', response.status, response.statusText);
      
      // 如果没有执行结果或请求无效，返回null而不是错误
      if (response.status === 404 || response.status === 400) {
        console.log('未找到查询结果或请求无效，返回null');
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`获取查询结果失败: ${response.statusText}`);
      }
      
      // 解析响应数据
      const responseData = await response.json();
      console.log('查询结果API响应:', responseData);
      
      // 处理响应数据
      const result = responseData.data || responseData;
      
      // 转换为标准格式
      const queryResult: QueryResult = {
        id: result.id || `result-${queryId}`,
        queryId: queryId,
        status: result.status || 'COMPLETED',
        createdAt: result.createdAt || new Date().toISOString(),
        executionTime: result.executionTime || result.duration || 0,
        rowCount: result.rowCount || (result.rows ? result.rows.length : 0),
        rows: result.rows || [],
        columns: result.columns || [],
        columnTypes: result.columnTypes || [],
        fields: result.fields || [],
        error: result.error || result.errorMessage
      };
      
      return queryResult;
    } catch (error) {
      console.error('获取查询结果失败:', error);
      return null;
    }
  }
}
