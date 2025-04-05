import axios from 'axios'
import { mockQueries } from '../plugins/mockData'
import type { 
  Query, 
  QueryParameter,
  QueryResult, 
  QueryDisplayConfig, 
  ChartConfig,
  QueryExecutionPlan,
  QueryVisualization,
  QueryServiceStatus,
  QueryFavorite,
  PageResponse
} from '@/types/query'
import type { ExecutionHistory } from '@/types/executionHistory'
import { http } from '@/utils/http'
import type { PaginationInfo } from '@/types/common'

// 自定义类型定义
export interface QueryExecutionResult {
  columns: Array<{
    field: string;
    label: string;
    type: string;
  }>;
  rows: any[];
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
  };
}

/**
 * 获取API基础URL
 * 用于确保所有请求都使用相同的基础URL
 * 在Mock模式下会返回空字符串，以确保使用相对路径
 */
export function getApiBaseUrl(): string {
  // 检查是否启用mock模式
  const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
  console.log('Mock 模式:', USE_MOCK ? '已启用' : '已禁用', 'API基础URL:', USE_MOCK ? '' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'));
  
  // 在Mock模式下始终返回空字符串，确保请求使用相对路径
  if (USE_MOCK) {
    return '';
  }
  
  // 开发环境下使用正确的端口
  if (import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL) {
    return 'http://localhost:5000';
  }
  
  return import.meta.env.VITE_API_BASE_URL || '';
}

// 查询参数类型
export interface QueryParams {
  queryType?: string;
  status?: string;
  serviceStatus?: string;
  dataSourceId?: string;
  search?: string;
  searchTerm?: string;
  sortBy?: string;
  sortDir?: string;
  includeDrafts?: boolean;
  page?: number;
  size?: number;
}

// 查询服务实现
const queryService = {
  /**
   * 获取查询列表
   * @param params 查询参数
   * @returns 查询列表和分页信息
   */
  async getQueries(params: any = {}): Promise<{ items: Query[]; pagination: PaginationInfo }> {
    try {
      const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
      console.log('获取查询列表, 使用Mock:', USE_MOCK, '参数:', params);
      
      // 标准化请求参数
      const queryParams = {
        page: params.page || 1,
        size: params.size || 10,
        // 支持两种参数名称: search 和 searchTerm
        searchTerm: params.searchTerm || params.search || undefined,
        serviceStatus: params.serviceStatus,
        queryType: params.queryType,
        sortBy: params.sortBy,
        sortDir: params.sortDir,
        includeDrafts: params.includeDrafts
      };
      
      const response = await http.get<any>(`${getApiBaseUrl()}/api/queries`, { params: queryParams });
      console.log('查询列表API响应:', response);
      
      // 检查响应结构
      if (!response) {
        console.error('API返回空响应');
        return { items: [], pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0, hasMore: false } };
      }
      
      // 适配不同的返回格式
      let items: Query[] = [];
      let pagination: PaginationInfo = {
        page: queryParams.page,
        pageSize: queryParams.size,
        total: 0,
        totalPages: 0,
        hasMore: false
      };
      
      // 处理标准响应格式
      if (response.data && response.data.items) {
        items = response.data.items;
        pagination = {
          page: response.data.page || queryParams.page,
          pageSize: response.data.size || queryParams.size,
          total: response.data.total || items.length,
          totalPages: response.data.totalPages || Math.ceil((response.data.total || items.length) / (response.data.size || queryParams.size)),
          hasMore: response.data.hasMore !== undefined ? response.data.hasMore : (response.data.page || 1) < (response.data.totalPages || 1)
        };
      } 
      // 处理items直接在response中的情况
      else if (response.items) {
        items = response.items;
        pagination = {
          page: response.page || queryParams.page,
          pageSize: response.size || queryParams.size,
          total: response.total || items.length,
          totalPages: response.totalPages || Math.ceil((response.total || items.length) / (response.size || queryParams.size)),
          hasMore: response.hasMore !== undefined ? response.hasMore : (response.page || 1) < (response.totalPages || 1)
        };
      }
      // 处理旧格式返回 (records而不是items)
      else if (response.data && response.data.records) {
        items = response.data.records;
        pagination = {
          page: response.data.page || queryParams.page,
          pageSize: response.data.pageSize || queryParams.size,
          total: response.data.total || items.length,
          totalPages: response.data.totalPages || Math.ceil((response.data.total || items.length) / (response.data.pageSize || queryParams.size)),
          hasMore: (response.data.page || 1) < (response.data.totalPages || 1)
        };
      }
      // 处理response直接是数组的情况
      else if (Array.isArray(response)) {
        items = response;
        pagination = {
          page: queryParams.page,
          pageSize: queryParams.size,
          total: response.length,
          totalPages: Math.ceil(response.length / queryParams.size),
          hasMore: queryParams.page * queryParams.size < response.length
        };
      }
      // 处理response.data直接是数组的情况
      else if (response.data && Array.isArray(response.data)) {
        items = response.data;
        pagination = {
          page: queryParams.page,
          pageSize: queryParams.size,
          total: response.data.length,
          totalPages: Math.ceil(response.data.length / queryParams.size),
          hasMore: queryParams.page * queryParams.size < response.data.length
        };
      }
      // 处理异常情况
      else {
        console.warn('未识别的API响应格式，返回空数据', response);
      }
      
      // 确保items有值
      if (!items) {
        items = [];
      }
      
      console.log(`查询列表获取成功: ${items.length}条数据, 总计${pagination.total}条`);
      
      return { items, pagination };
    } catch (error) {
      console.error('获取查询列表失败:', error);
      throw error;
    }
  },

  /**
   * 获取查询详情
   * @param id 查询ID
   * @returns 查询详情
   */
  async getQueryById(id: string): Promise<Query> {
    try {
      const response = await http.get<any>(`${getApiBaseUrl()}/api/queries/${id}`);
      return response.data;
    } catch (error) {
      console.error(`获取查询失败 [${id}]:`, error);
      throw error;
    }
  },

  /**
   * 执行查询
   * @param id 查询ID
   * @param params 执行参数
   * @returns 查询执行结果
   */
  async executeQuery(id: string, params: any = {}): Promise<QueryExecutionResult> {
    try {
      console.log(`执行查询 [${id}]，参数:`, params);
      
      // 打印完整API URL
      const apiUrl = `${getApiBaseUrl()}/api/queries/${id}/execute`;
      console.log('执行查询URL:', apiUrl);
      
      const response = await http.post<any>(apiUrl, params);
      
      console.log('查询执行结果:', response);
      
      if (!response.success) {
        throw new Error(response.message || '查询执行失败');
      }
      
      return response.data;
    } catch (error) {
      console.error(`查询执行失败 [${id}]:`, error);
      throw error;
    }
  },

  /**
   * 执行自然语言查询
   */
  async executeNaturalLanguageQuery(params: any): Promise<QueryResult> {
    const url = `${getApiBaseUrl()}/api/queries/nlq/execute`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    
    if (!response.ok) {
      throw new Error(`执行自然语言查询失败: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  },
  
  /**
   * 取消查询执行
   */
  async cancelQuery(queryId: string): Promise<void> {
    const url = `${getApiBaseUrl()}/api/queries/${queryId}/cancel`;
    const response = await fetch(url, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error(`取消查询失败: ${response.statusText}`);
    }
    
    return;
  },
  
  /**
   * 获取查询状态
   */
  async getQueryStatus(queryId: string): Promise<any> {
    const url = `${getApiBaseUrl()}/api/queries/${queryId}/status?_t=${Date.now()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`获取查询状态失败: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  },
  
  /**
   * 获取查询历史
   */
  async getQueryHistory(params: any = {}): Promise<{ items: ExecutionHistory[], total: number, page: number, size: number, totalPages: number}> {
    const { page = 1, size = 20, queryId, startDate, endDate, status, sort } = params;
    
    // 检查是否使用模拟数据
    const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
    
    // 在Mock模式下返回模拟数据
    if (USE_MOCK) {
      console.log('使用模拟数据返回查询历史');
      
      // 这里应该创建模拟的执行历史数据
      const mockHistory: any[] = Array.from({ length: 5 }, (_, i) => ({
        id: `history-${i+1}`,
        queryId: queryId || `query-${i+1}`,
        executedAt: new Date(Date.now() - i * 3600000).toISOString(),
        status: i % 3 === 0 ? 'SUCCESS' : (i % 3 === 1 ? 'ERROR' : 'CANCELLED'),
        executionTime: Math.floor(Math.random() * 1000) + 50,
        resultRowCount: i % 3 === 0 ? Math.floor(Math.random() * 100) + 1 : 0,
        error: i % 3 === 1 ? '查询执行出错' : null
      }));
      
      return {
        items: mockHistory,
        total: mockHistory.length,
        page,
        size,
        totalPages: 1
      };
    }
    
    let url = `${getApiBaseUrl()}/api/queries/history?page=${page}&size=${size}`;
    
    if (queryId) {
      url += `&queryId=${queryId}`;
    }
    
    if (startDate) {
      url += `&startDate=${startDate}`;
    }
    
    if (endDate) {
      url += `&endDate=${endDate}`;
    }
    
    if (status) {
      url += `&status=${status}`;
    }
    
    if (sort) {
      url += `&sort=${sort}`;
    }
    
    // 添加时间戳防止缓存
    url += `&_t=${Date.now()}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`获取查询历史失败: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  },
  
  /**
   * 获取单个查询详情
   */
  async getQuery(id: string): Promise<Query> {
    try {
      console.log(`获取查询详情, ID: ${id}`);
      
      // 检查是否使用模拟数据
      const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
      
      // 在Mock模式下，直接返回模拟数据
      if (USE_MOCK) {
        console.log('使用模拟数据返回查询详情');
        
        // 从模拟数据中查找匹配的查询
        const mockQuery = mockQueries.find(q => q.id === id);
        
        if (!mockQuery) {
          console.warn(`未找到ID为${id}的模拟查询数据，返回第一条模拟数据`);
          // 如果没找到匹配的查询，返回第一条模拟数据并修改ID
          return {
            ...mockQueries[0],
            id: id
          };
        }
        
        return mockQuery;
      }
      
      // 以下是原有的真实API请求逻辑
      const url = `${getApiBaseUrl()}/api/queries/${id}?_t=${Date.now()}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`获取查询详情失败: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(`获取查询详情失败, ID: ${id}`, error);
      throw error;
    }
  },
  
  /**
   * 保存查询
   */
  async saveQuery(query: Partial<Query>): Promise<Query> {
    try {
      console.log('保存查询:', query);
      
      // 检查是否使用模拟数据
      const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
      
      // 在Mock模式下模拟保存查询
      if (USE_MOCK) {
        console.log('使用模拟数据保存查询');
        
        // 模拟延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 创建或更新查询
        let savedQuery: Query;
        
        if (query.id) {
          // 更新现有查询
          console.log(`更新现有查询，ID: ${query.id}`);
          const existingIndex = mockQueries.findIndex(q => q.id === query.id);
          
          if (existingIndex !== -1) {
            // 更新现有查询
            savedQuery = {
              ...mockQueries[existingIndex],
              ...query,
              updatedAt: new Date().toISOString()
            };
            mockQueries[existingIndex] = savedQuery;
          } else {
            console.warn(`未找到要更新的查询，ID: ${query.id}，将创建新查询`);
            savedQuery = {
              id: query.id,
              name: query.name || '未命名查询',
              description: query.description || '',
              folderId: query.folderId || '',
              dataSourceId: query.dataSourceId || '',
              queryType: query.queryType || 'SQL',
              queryText: query.queryText || '',
              status: query.status || 'DRAFT',
              serviceStatus: query.serviceStatus || 'ACTIVE',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              executionTime: 0,
              resultCount: 0,
              isFavorite: false,
              executionCount: 0,
              lastExecutedAt: new Date().toISOString()
            };
            mockQueries.push(savedQuery);
          }
        } else {
          // 创建新查询
          console.log('创建新查询');
          savedQuery = {
            id: `query-${Date.now()}`,
            name: query.name || '未命名查询',
            description: query.description || '',
            folderId: query.folderId || '',
            dataSourceId: query.dataSourceId || '',
            queryType: query.queryType || 'SQL',
            queryText: query.queryText || '',
            status: query.status || 'DRAFT',
            serviceStatus: query.serviceStatus || 'ACTIVE',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            executionTime: 0,
            resultCount: 0,
            isFavorite: false,
            executionCount: 0,
            lastExecutedAt: new Date().toISOString()
          };
          mockQueries.push(savedQuery);
        }
        
        console.log('查询保存成功:', savedQuery);
        return savedQuery;
      }
      
      // 真实API请求
      const url = `${getApiBaseUrl()}/api/queries${query.id ? `/${query.id}` : ''}`;
      const method = query.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('保存查询失败:', response.status, errorText);
        throw new Error(`保存查询失败: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('保存查询失败:', error);
      throw error;
    }
  },
  
  /**
   * 删除查询
   */
  async deleteQuery(id: string): Promise<void> {
    try {
      console.log(`删除查询, ID: ${id}`);
      
      // 检查是否使用模拟数据
      const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
      
      // 在Mock模式下模拟删除查询
      if (USE_MOCK) {
        console.log(`使用模拟数据删除查询，ID: ${id}`);
        
        // 查找要删除的查询在模拟数据中的索引
        const index = mockQueries.findIndex(q => q.id === id);
        
        // 如果找到了，从模拟数据数组中删除
        if (index !== -1) {
          mockQueries.splice(index, 1);
          console.log(`已从模拟数据中删除查询，ID: ${id}`);
        } else {
          console.warn(`在模拟数据中未找到要删除的查询，ID: ${id}`);
        }
        
        // 模拟延迟
        await new Promise(resolve => setTimeout(resolve, 300));
        
        return;
      }
      
      const url = `${getApiBaseUrl()}/api/queries/${id}`;
      const response = await fetch(url, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`删除查询失败: ${response.statusText}`);
      }
      
      return;
    } catch (error) {
      console.error(`删除查询失败, ID: ${id}`, error);
      throw error;
    }
  },
  
  /**
   * 获取查询参数
   */
  async getQueryParameters(id: string): Promise<QueryParameter[]> {
    try {
      console.log(`获取查询参数, 查询ID: ${id}`);
      
      // 检查是否使用模拟数据
      const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
      
      // 在Mock模式下，直接返回模拟数据
      if (USE_MOCK) {
        console.log(`使用模拟数据返回查询参数, 查询ID: ${id}`);
        
        // 模拟延迟
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 为查询生成模拟参数
        const mockParameters = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => {
          // 可能的参数类型
          const paramTypes = ['string', 'number', 'boolean', 'date'];
          const type = paramTypes[Math.floor(Math.random() * paramTypes.length)];
          
          // 生成参数对象
          const param: QueryParameter = {
            id: `param-${id}-${i+1}`,
            name: `param${i + 1}`,
            label: `参数 ${i + 1}`,
            type,
            required: Math.random() > 0.5,
            defaultValue: null,
            options: type === 'string' ? Array.from({ length: 3 }, (_, j) => ({ label: `选项${j+1}`, value: `value${j+1}` })) : undefined
          };
          
          // 根据类型生成默认值
          if (Math.random() > 0.3) {
            switch (type) {
              case 'string':
                param.defaultValue = `默认值${i + 1}`;
                break;
              case 'number':
                param.defaultValue = Math.floor(Math.random() * 100);
                break;
              case 'boolean':
                param.defaultValue = Math.random() > 0.5;
                break;
              case 'date':
                param.defaultValue = new Date().toISOString().split('T')[0];
                break;
            }
          }
          
          return param;
        });
        
        console.log(`返回${mockParameters.length}个模拟参数`);
        return mockParameters;
      }
      
      const url = `${getApiBaseUrl()}/api/queries/${id}/parameters`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`获取查询参数失败: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(`获取查询参数失败, 查询ID: ${id}`, error);
      throw error;
    }
  },
  
  /**
   * 保存查询参数
   */
  async saveQueryParameters(queryId: string, parameters: QueryParameter[]): Promise<QueryParameter[]> {
    try {
      console.log(`保存查询参数, 查询ID: ${queryId}`, parameters);
      
      const url = `${getApiBaseUrl()}/api/queries/${queryId}/parameters`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parameters)
      });
      
      if (!response.ok) {
        throw new Error(`保存查询参数失败: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(`保存查询参数失败, 查询ID: ${queryId}`, error);
      throw error;
    }
  },
  
  /**
   * 获取收藏的查询列表
   * 为了保持与store中方法名称一致，提供getFavorites作为getFavoriteQueries的别名
   */
  async getFavorites(params: QueryParams = {}): Promise<PageResponse<Query>> {
    return this.getFavoriteQueries(params);
  },
  
  /**
   * 获取收藏的查询
   */
  async getFavoriteQueries(params: QueryParams = {}): Promise<PageResponse<Query>> {
    try {
      console.log('获取收藏的查询, 参数:', params);
      
      // 检查是否使用模拟数据
      const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
      
      // 构建查询参数
      const queryParams = new URLSearchParams();
      
      // 分页参数
      queryParams.append('page', String(params.page || 1));
      queryParams.append('size', String(params.size || 10));
      
      // 过滤条件
      if (params.dataSourceId) {
        queryParams.append('dataSourceId', params.dataSourceId);
      }
      
      if (params.status) {
        queryParams.append('status', params.status);
      }
      
      if (params.search || params.searchTerm) {
        queryParams.append('search', params.search || params.searchTerm || '');
      }
      
      // 添加时间戳防止缓存
      queryParams.append('_t', String(Date.now()));
      
      // 构建URL
      const url = `${getApiBaseUrl()}/api/queries/favorites?${queryParams.toString()}`;
      console.log(`获取收藏的查询，URL: ${url}，模拟模式: ${USE_MOCK ? '是' : '否'}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`获取收藏的查询失败: ${response.statusText}`);
      }
      
      // 先检查响应文本，防止JSON解析错误
      const responseText = await response.text();
      
      if (!responseText || responseText.trim() === '') {
        console.error('获取收藏的查询返回了空响应');
        throw new Error('获取收藏的查询返回了空响应');
      }
      
      // 尝试解析JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('解析收藏查询响应JSON失败:', parseError);
        console.error('响应内容:', responseText.substring(0, 200) + '...');
        throw new Error(`解析收藏查询响应JSON失败: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
      }
      
      // 检查返回数据格式
      if (!result) {
        console.error('解析后的结果为空');
        throw new Error('解析后的结果为空');
      }
      
      // 确保返回的数据格式正确
      if (!result.data && !result.items) {
        console.error('获取收藏的查询返回的数据格式不正确:', result);
        throw new Error('获取收藏的查询返回的数据格式不正确');
      }
      
      // 数据可能在result.data或直接在result中
      const data = result.data || result;
      
      // 在有items字段时直接返回，否则构造分页响应
      if (data.items && Array.isArray(data.items)) {
        console.log(`获取收藏的查询成功，返回${data.items.length}条记录`);
        return data;
      } else if (Array.isArray(data)) {
        console.log(`获取收藏的查询成功，返回${data.length}条记录，转换为分页格式`);
        return {
          items: data,
          total: data.length,
          page: parseInt(String(params.page || 1), 10),
          size: data.length,
          totalPages: 1
        };
      } else {
        console.error('获取收藏的查询返回的数据结构无法解析:', data);
        throw new Error('获取收藏的查询返回的数据结构无法解析');
      }
    } catch (error) {
      console.error('获取收藏的查询失败:', error);
      // 如果是Mock模式，在发生错误时返回空数据而不是抛出异常
      if (import.meta.env.VITE_USE_MOCK_API === 'true') {
        console.log('模拟模式下返回空收藏列表');
        return {
          items: [],
          total: 0,
          page: parseInt(String(params.page || 1), 10),
          size: parseInt(String(params.size || 10), 10),
          totalPages: 0
        };
      }
      throw error;
    }
  },
  
  /**
   * 添加或移除收藏
   */
  async toggleFavorite(queryId: string): Promise<QueryFavorite> {
    try {
      console.log(`切换收藏状态, 查询ID: ${queryId}`);
      
      const url = `${getApiBaseUrl()}/api/queries/${queryId}/favorite`;
      const response = await fetch(url, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`切换收藏状态失败: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(`切换收藏状态失败, 查询ID: ${queryId}`, error);
      throw error;
    }
  },
  
  /**
   * 获取查询计划（执行计划）
   */
  async getQueryPlan(query: string, dataSourceId: string): Promise<QueryExecutionPlan> {
    try {
      console.log('获取查询计划:', { query, dataSourceId });
      
      // 检查是否使用模拟数据
      const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
      
      // 在Mock模式下，直接返回模拟数据
      if (USE_MOCK) {
        console.log('使用模拟数据返回查询计划');
        
        // 创建模拟查询计划数据
        const mockPlanSteps = [
          {
            id: '1',
            type: 'SCAN',
            name: '表扫描',
            relation: query.includes('FROM') ? query.split('FROM')[1].trim().split(' ')[0] : 'example_table',
            cost: 10.5,
            rows: 1000,
            width: 200,
            details: '扫描表的所有记录'
          },
          {
            id: '2',
            type: 'FILTER',
            name: '过滤',
            condition: query.includes('WHERE') ? query.split('WHERE')[1].split('ORDER')[0].trim() : 'id > 100',
            cost: 15.2,
            rows: 500,
            width: 200,
            details: '根据条件过滤记录'
          },
          {
            id: '3',
            type: 'SORT',
            name: '排序',
            sortKey: query.includes('ORDER BY') ? query.split('ORDER BY')[1].trim() : 'id ASC',
            cost: 20.8,
            rows: 500,
            width: 200,
            details: '对结果集进行排序'
          }
        ];
        
        const mockQueryPlan: QueryExecutionPlan = {
          id: `plan-${Date.now()}`,
          queryId: 'temp-query',
          plan: mockPlanSteps,
          estimatedCost: 46.5,
          estimatedRows: 500,
          planningTime: 0.15,
          executionTime: 0.35,
          createdAt: new Date().toISOString()
        };
        
        return mockQueryPlan;
      }
      
      // 以下是原有的真实API请求逻辑
      const url = `${getApiBaseUrl()}/api/queries/plan`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          dataSourceId
        })
      });
      
      if (!response.ok) {
        throw new Error(`获取查询计划失败: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('获取查询计划失败:', error);
      throw error;
    }
  },
  
  /**
   * 获取查询执行计划
   * 通过查询ID或结果ID获取已执行查询的执行计划
   * @param queryId 查询ID或结果ID(result-xxx格式)
   */
  async getQueryExecutionPlan(queryId: string): Promise<QueryExecutionPlan | null> {
    try {
      console.log('获取查询执行计划:', queryId);
      
      // 检查是否使用模拟数据
      const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
      
      // 在Mock模式下，直接返回模拟数据
      if (USE_MOCK) {
        console.log('使用模拟数据返回查询执行计划');
        
        // 创建模拟执行计划数据
        const mockSteps = [
          {
            id: "1",
            type: "Scan",
            tableName: "users",
            cost: 10.5,
            rows: 1000,
            description: "Sequential scan on users table"
          },
          {
            id: "2",
            type: "Filter",
            condition: "id > 0",
            cost: 15.2,
            rows: 950,
            description: "Filter rows based on condition"
          },
          {
            id: "3",
            type: "Sort",
            columns: ["id"],
            cost: 25.7,
            rows: 950,
            description: "Sort result by id"
          }
        ];
        
        const mockPlan: QueryExecutionPlan = {
          id: `plan-${Date.now()}`,
          queryId: queryId,
          createdAt: new Date().toISOString(),
          plan: mockSteps,
          estimatedCost: 51.4,
          estimatedRows: 950,
          planningTime: 0.12,
          executionTime: 0.35
        };
        
        return mockPlan;
      }
      
      // 真实API调用
      const url = `${getApiBaseUrl()}/api/queries/${queryId}/execution-plan`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log(`查询 ${queryId} 的执行计划不存在`);
          return null;
        }
        throw new Error(`获取查询执行计划失败: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('获取查询执行计划失败:', error);
      throw error;
    }
  },
  
  /**
   * 保存查询展示配置
   */
  async saveQueryDisplayConfig(queryId: string, config: QueryDisplayConfig): Promise<QueryDisplayConfig> {
    try {
      console.log(`保存查询展示配置, 查询ID: ${queryId}`, config);
      
      const url = `${getApiBaseUrl()}/api/queries/${queryId}/display-config`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });
      
      if (!response.ok) {
        throw new Error(`保存查询展示配置失败: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(`保存查询展示配置失败, 查询ID: ${queryId}`, error);
      throw error;
    }
  },
  
  /**
   * 获取查询展示配置
   */
  async getQueryDisplayConfig(queryId: string): Promise<QueryDisplayConfig> {
    try {
      console.log(`获取查询展示配置, 查询ID: ${queryId}`);
      
      const url = `${getApiBaseUrl()}/api/queries/${queryId}/display-config`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`获取查询展示配置失败: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(`获取查询展示配置失败, 查询ID: ${queryId}`, error);
      throw error;
    }
  },
  
  /**
   * 切换查询服务状态（启用/禁用）
   */
  async toggleQueryServiceStatus(queryId: string): Promise<QueryServiceStatus> {
    try {
      console.log(`切换查询服务状态, 查询ID: ${queryId}`);
      
      const url = `${getApiBaseUrl()}/api/queries/${queryId}/toggle-status`;
      const response = await fetch(url, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`切换查询服务状态失败: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(`切换查询服务状态失败, 查询ID: ${queryId}`, error);
      throw error;
    }
  },
  
  /**
   * 获取查询可视化配置
   */
  async getQueryVisualization(queryId: string): Promise<QueryVisualization[]> {
    try {
      console.log(`获取查询可视化配置, 查询ID: ${queryId}`);
      
      // 检查是否使用模拟数据
      const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
      
      // 在Mock模式下，直接返回模拟数据
      if (USE_MOCK) {
        console.log('使用模拟数据返回查询可视化配置');
        
        // 创建模拟查询可视化配置
        const mockVisualizations: QueryVisualization[] = [
          {
            id: `vis-${queryId}-1`,
            queryId: queryId,
            name: '条形图',
            type: 'bar',
            config: {
              type: 'bar',
              title: '按类别统计数量',
              xAxis: 'category',
              yAxis: 'count',
              series: [
                {
                  name: '数量',
                  dataKey: 'count',
                  color: '#4CAF50'
                }
              ]
            },
            createdAt: new Date().toISOString()
          },
          {
            id: `vis-${queryId}-2`,
            queryId: queryId,
            name: '折线图',
            type: 'line',
            config: {
              type: 'line',
              title: '趋势分析',
              xAxis: 'date',
              yAxis: 'value',
              series: [
                {
                  name: '值',
                  dataKey: 'value',
                  color: '#2196F3'
                }
              ]
            },
            createdAt: new Date().toISOString()
          }
        ];
        
        return mockVisualizations;
      }
      
      // 真实API请求
      const url = `${getApiBaseUrl()}/api/queries/${queryId}/visualization`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`获取查询可视化配置失败: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(`获取查询可视化配置失败, 查询ID: ${queryId}`, error);
      throw error;
    }
  },
  
  /**
   * 保存查询可视化配置
   */
  async saveQueryVisualization(queryId: string, visualizations: QueryVisualization[]): Promise<QueryVisualization[]> {
    try {
      console.log(`保存查询可视化配置, 查询ID: ${queryId}`, visualizations);
      
      // 检查是否使用模拟数据
      const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
      
      // 在Mock模式下，直接返回传入的可视化配置作为模拟成功响应
      if (USE_MOCK) {
        console.log('使用模拟数据保存查询可视化配置');
        
        // 添加服务器通常会提供的字段
        const mockVisualizations = visualizations.map((viz, index) => ({
          ...viz,
          id: viz.id || `viz-${Date.now()}-${index}`, // 如果没有ID，生成一个
          createdAt: viz.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
        
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 300));
        
        console.log('模拟保存成功，返回可视化配置:', mockVisualizations);
        return mockVisualizations;
      }
      
      // 真实API请求
      const url = `${getApiBaseUrl()}/api/queries/${queryId}/visualization`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(visualizations)
      });
      
      if (!response.ok) {
        throw new Error(`保存查询可视化配置失败: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(`保存查询可视化配置失败, 查询ID: ${queryId}`, error);
      throw error;
    }
  },
  
  /**
   * 获取单个查询的执行历史
   */
  async getQueryExecutionHistory(queryId: string): Promise<ExecutionHistory[]> {
    try {
      console.log(`获取查询执行历史, 查询ID: ${queryId}`);
      
      // 检查是否使用模拟数据
      const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
      
      // 在Mock模式下，直接返回模拟数据
      if (USE_MOCK) {
        console.log('使用模拟数据返回查询执行历史');
        
        // 创建模拟执行历史数据
        const mockExecutionHistory: ExecutionHistory[] = Array.from({ length: 5 }, (_, i) => ({
          id: `exec-${queryId}-${i+1}`,
          queryId: queryId,
          versionId: `ver-${queryId}-1`,
          executedAt: new Date(Date.now() - i * 3600000).toISOString(),
          status: i % 3 === 0 ? 'SUCCESS' : (i % 3 === 1 ? 'ERROR' : 'CANCELLED'),
          executionTime: Math.floor(Math.random() * 1000) + 50,
          resultRowCount: i % 3 === 0 ? Math.floor(Math.random() * 100) + 1 : 0,
          userId: 'user-1',
          error: i % 3 === 1 ? '查询执行出错：语法错误或超时' : null
        }));
        
        return mockExecutionHistory;
      }
      
      // 真实API请求
      const url = `${getApiBaseUrl()}/api/queries/${queryId}/executions?_t=${Date.now()}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`获取查询执行历史失败: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(`获取查询执行历史失败, 查询ID: ${queryId}`, error);
      throw error;
    }
  },
  
  /**
   * 获取查询建议
   */
  async getQuerySuggestions(queryId: string): Promise<any[]> {
    try {
      console.log(`获取查询建议, 查询ID: ${queryId}`);
      
      // 检查是否使用模拟数据
      const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
      
      // 在Mock模式下，直接返回模拟数据
      if (USE_MOCK) {
        console.log('使用模拟数据返回查询建议');
        
        // 创建模拟查询建议数据
        const mockQuerySuggestions = [
          {
            id: 'suggestion-1',
            queryId: queryId,
            type: 'OPTIMIZATION',
            title: '添加索引',
            description: '为查询中频繁使用的列添加索引，可以提高查询性能',
            suggestion: '为表 example_table 的 id 列添加索引',
            impact: 'high'
          },
          {
            id: 'suggestion-2',
            queryId: queryId,
            type: 'OPTIMIZATION',
            title: '优化JOIN条件',
            description: '确保JOIN条件使用了合适的列类型和索引',
            suggestion: '检查JOIN条件中的列类型是否匹配',
            impact: 'medium'
          },
          {
            id: 'suggestion-3',
            queryId: queryId,
            type: 'READABILITY',
            title: '改进SQL格式',
            description: '使用更清晰的SQL格式可以提高代码可读性',
            suggestion: '使用一致的大小写和缩进格式',
            impact: 'low'
          }
        ];
        
        return mockQuerySuggestions;
      }
      
      // 真实API请求
      const url = `${getApiBaseUrl()}/api/queries/${queryId}/suggestions`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`获取查询建议失败: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(`获取查询建议失败, 查询ID: ${queryId}`, error);
      throw error;
    }
  }
};

export { queryService };