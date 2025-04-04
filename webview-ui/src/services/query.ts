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

/**
 * 获取API基础URL
 * 用于确保所有请求都使用相同的基础URL
 * 在Mock模式下会返回空字符串，以确保使用相对路径
 */
export function getApiBaseUrl(): string {
  // 检查是否启用mock模式
  const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
  console.log('Mock 模式:', USE_MOCK ? '已启用' : '已禁用', 'API基础URL:', USE_MOCK ? '' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3100'));
  
  // 在Mock模式下始终返回空字符串，确保请求使用相对路径
  if (USE_MOCK) {
    return '';
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
   * 执行查询
   * @param params 查询参数
   */
  async executeQuery(params: any): Promise<QueryResult> {
    try {
      console.log('执行查询:', params);
      
      // 构建URL
      const url = `${getApiBaseUrl()}/api/queries/${params.queryId || 'execute'}/execute`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('查询执行失败:', response.status, errorText);
        throw new Error(`查询执行失败: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('执行查询失败:', error);
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
   * 获取查询列表
   */
  async getQueries(params: QueryParams = {}): Promise<PageResponse<Query>> {
    try {
      console.log('获取查询列表, 参数:', params);
      
      // 检查是否使用模拟数据
      const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
      
      // 在Mock模式下，直接返回模拟数据
      if (USE_MOCK) {
        console.log('使用模拟数据返回查询列表');
        
        // 使用已导入的模拟数据
        let filteredQueries = [...mockQueries];
        
        // 应用过滤条件
        if (params.dataSourceId) {
          filteredQueries = filteredQueries.filter(q => q.dataSourceId === params.dataSourceId);
        }
        
        if (params.queryType) {
          filteredQueries = filteredQueries.filter(q => q.queryType === params.queryType);
        }
        
        if (params.status) {
          filteredQueries = filteredQueries.filter(q => q.status === params.status);
        }
        
        if (params.serviceStatus) {
          filteredQueries = filteredQueries.filter(q => q.serviceStatus === params.serviceStatus);
        }
        
        if (params.search || params.searchTerm) {
          const searchTerm = (params.search || params.searchTerm || '').toLowerCase();
          filteredQueries = filteredQueries.filter(
            q => q.name.toLowerCase().includes(searchTerm) || 
                 (q.description && q.description.toLowerCase().includes(searchTerm))
          );
        }
        
        // 计算分页
        const page = params.page || 1;
        const size = params.size || 10;
        const total = filteredQueries.length;
        const totalPages = Math.ceil(total / size);
        
        // 提取当前页的数据
        const startIndex = (page - 1) * size;
        const endIndex = Math.min(startIndex + size, total);
        const items = filteredQueries.slice(startIndex, endIndex);
        
        // 返回分页结果
        return {
          items,
          total,
          page,
          size,
          totalPages
        };
      }
      
      // 以下是原有的真实API请求逻辑
      // 构建查询参数
      const queryParams = new URLSearchParams();
      
      // 分页参数
      queryParams.append('page', String(params.page || 1));
      queryParams.append('size', String(params.size || 10));
      
      // 过滤条件
      if (params.dataSourceId) {
        queryParams.append('dataSourceId', params.dataSourceId);
      }
      
      if (params.queryType) {
        queryParams.append('queryType', params.queryType);
      }
      
      if (params.status) {
        queryParams.append('status', params.status);
      }
      
      if (params.serviceStatus) {
        queryParams.append('serviceStatus', params.serviceStatus);
      }
      
      if (params.search || params.searchTerm) {
        queryParams.append('search', params.search || params.searchTerm || '');
      }
      
      // 排序
      if (params.sortBy) {
        queryParams.append('sortBy', params.sortBy);
        if (params.sortDir) {
          queryParams.append('sortDir', params.sortDir);
        }
      }
      
      // 是否包含草稿
      if (params.includeDrafts !== undefined) {
        queryParams.append('includeDrafts', String(params.includeDrafts));
      }
      
      // 构建URL
      const url = `${getApiBaseUrl()}/api/queries?${queryParams.toString()}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`获取查询列表失败: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('获取查询列表失败:', error);
      throw error;
    }
  },
  
  /**
   * 获取收藏的查询
   */
  async getFavoriteQueries(params: QueryParams = {}): Promise<PageResponse<Query>> {
    try {
      console.log('获取收藏的查询, 参数:', params);
      
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
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`获取收藏的查询失败: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('获取收藏的查询失败:', error);
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