/**
 * 全局 axios 拦截器
 * 在Mock模式下拦截所有API请求，返回模拟数据
 */

import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { mockDataSources, mockMetadata, mockQueries, mockIntegrations } from './mockData';
import type { QueryStatus, QueryServiceStatus, QueryType } from '@/types/query';

// 扩展Axios配置类型，添加mockResponse属性
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    mockResponse?: boolean;
  }
}

// 检查是否启用mock模式 - 统一环境变量名称
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
console.log('[Mock] Axios拦截器 - Mock模式:', USE_MOCK ? '已启用' : '已禁用');

/**
 * 启用拦截器
 */
export function setupAxiosInterceptor() {
  if (!USE_MOCK) {
    console.log('[Mock] Axios拦截器未启用');
    return;
  }

  // 如果启用了Mock模式，设置axios拦截器
  // 创建全局模拟数据映射
  const mockDataHandlers: Record<string, Function> = {
    // 数据源相关API
    '/api/datasources': (method: string, data?: any) => {
      // GET请求返回数据源列表
      if (method === 'get') {
        console.log('[Mock Axios] 返回模拟数据源列表');
        return { success: true, data: mockDataSources };
      }
      
      // POST请求创建新数据源
      if (method === 'post') {
        // 创建新数据源但不修改原数组
        const newId = `ds-new-${Date.now()}`;
        const newDataSource = {
          id: newId,
          name: data?.name || `新数据源`,
          description: data?.description || '',
          type: data?.type || 'MYSQL',
          host: data?.host || 'localhost',
          port: data?.port || 3306,
          databaseName: data?.databaseName || `test_db`,
          database: data?.database || data?.databaseName || `test_db`,
          username: data?.username || 'user',
          status: 'ACTIVE',
          syncFrequency: data?.syncFrequency || 'MANUAL',
          lastSyncTime: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        return { success: true, data: newDataSource };
      }
      
      return { success: true, data: [] };
    },
    
    // 集成相关API
    '/api/low-code/apis': (method: string, data?: any) => {
      // GET请求返回集成列表
      if (method === 'get') {
        console.log('[Mock Axios] 返回模拟集成列表');
        console.log('[Mock Axios] 总共', mockIntegrations.length, '个集成');
        return { success: true, data: mockIntegrations };
      }
      
      // POST请求创建新集成
      if (method === 'post') {
        const newId = `integration-new-${Date.now()}`;
        const newIntegration = {
          id: newId,
          name: data?.name || `新集成`,
          description: data?.description || '',
          type: data?.type || 'REST',
          baseUrl: data?.baseUrl || 'https://api.example.com',
          authType: data?.authType || 'NONE',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          endpoints: data?.endpoints || []
        };
        
        console.log('[Mock Axios] 创建新集成:', newId);
        return { success: true, data: newIntegration };
      }
      
      return { success: true, data: mockIntegrations };
    },
    
    // 测试集成
    '/api/low-code/apis/.*/test': (method: string, data?: any) => {
      if (method === 'post') {
        return { 
          success: true, 
          data: {
            resultType: 'JSON',
            jsonResponse: {
              success: true,
              message: '测试成功',
              timestamp: new Date().toISOString(),
              requestDetails: data,
              responseData: Array.from({ length: 5 }, (_, i) => ({
                id: i + 1,
                name: `测试项目 ${i + 1}`,
                value: Math.round(Math.random() * 100)
              }))
            }
          }
        };
      }
      
      return { success: true, data: {} };
    },
    
    // 获取收藏查询列表
    '/api/queries/favorites': (method: string, data?: any) => {
      if (method === 'get') {
        console.log('[Mock Axios] 处理收藏查询列表请求');
        
        // 过滤出收藏的查询
        const favoriteQueries = mockQueries.filter(q => q.isFavorite);
        
        console.log(`[Mock Axios] 返回${favoriteQueries.length}个收藏查询`);
        return { 
          success: true, 
          data: {
            items: favoriteQueries,
            total: favoriteQueries.length,
            page: 1,
            size: favoriteQueries.length,
            totalPages: 1
          }
        };
      }
      
      return { success: false, message: '不支持的请求方法' };
    },
    
    // 查询版本相关API - 添加支持查询版本API的处理程序
    '/api/queries/.*/versions': (method: string, data?: any, url?: string) => {
      // 解析URL，获取查询ID
      const urlParts = url?.split('/') || [];
      const queryIdIndex = urlParts.findIndex(part => part === 'queries') + 1;
      const queryId = queryIdIndex > 0 && queryIdIndex < urlParts.length ? urlParts[queryIdIndex] : '';
      
      console.log('[Mock Axios] 处理查询版本API请求:', url, '方法:', method, '查询ID:', queryId);
      
      // 检查是否包含version ID（用于激活版本等操作）
      const hasVersionId = urlParts.length > queryIdIndex + 2 && urlParts[queryIdIndex + 2] !== '';
      const versionId = hasVersionId ? urlParts[queryIdIndex + 2] : '';
      
      // 检查是否是激活版本操作
      const isActivateOperation = hasVersionId && urlParts.includes('activate');
      
      // 处理版本激活请求
      if (isActivateOperation && method.toLowerCase() === 'post') {
        console.log('[Mock Axios] 处理激活查询版本请求，版本ID:', versionId);
        
        // 返回已激活的版本数据
        return {
          success: true,
          data: {
            id: versionId,
            queryId: queryId,
            versionNumber: parseInt(versionId.split('-').pop() || '1', 10),
            queryText: "SELECT * FROM example_table LIMIT 10",
            status: 'PUBLISHED',
            isActive: true,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
            dataSourceId: "ds-1"
          }
        };
      }
      
      // 处理获取版本列表请求
      if (method.toLowerCase() === 'get') {
        console.log('[Mock Axios] 处理获取查询版本列表请求');
        
        // 查找查询
        const query = mockQueries.find(q => q.id === queryId);
        if (!query) {
          console.warn(`[Mock Axios] 未找到ID为${queryId}的查询，返回空版本列表`);
          return { success: true, data: [] };
        }
        
        // 生成3个模拟版本记录
        const versions = Array.from({ length: 3 }, (_, i) => {
          const versionNumber = 3 - i; // 最新的版本在前面
          return {
            id: `ver-${queryId}-${versionNumber}`,
            queryId: queryId,
            versionNumber: versionNumber,
            queryText: query.queryText || `SELECT * FROM example_table WHERE id > ${i} LIMIT 10`,
            status: i === 0 ? 'PUBLISHED' : (i === 1 ? 'DRAFT' : 'DEPRECATED'),
            isActive: i === 0, // 第一个版本是活跃的
            createdAt: new Date(Date.now() - i * 86400000).toISOString(),
            updatedAt: new Date(Date.now() - i * 86400000).toISOString(),
            dataSourceId: query.dataSourceId
          };
        });
        
        console.log(`[Mock Axios] 返回${versions.length}个版本`);
        return { success: true, data: versions };
      }
      
      // 处理创建版本请求
      if (method.toLowerCase() === 'post') {
        console.log('[Mock Axios] 处理创建查询版本请求');
        
        try {
          // 解析请求数据
          const sqlContent = data?.sqlContent || '';
          const dataSourceId = data?.dataSourceId || '';
          const description = data?.description || '';
          
          console.log('[Mock Axios] 创建版本请求数据:', { sqlContent, dataSourceId, description });
          
          // 确定新版本号
          const versionNumber = Math.floor(Math.random() * 100) + 1;
          
          // 创建新版本
          const newVersion = {
            id: `ver-${queryId}-${versionNumber}`,
            queryId: queryId,
            versionNumber: versionNumber,
            queryText: sqlContent,
            status: 'DRAFT',
            isActive: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            dataSourceId: dataSourceId,
            description: description
          };
          
          console.log('[Mock Axios] 返回新创建的查询版本:', newVersion);
          return { success: true, data: newVersion };
        } catch (error) {
          console.error('[Mock Axios] 创建查询版本失败:', error);
          return { 
            success: false, 
            message: `创建查询版本失败: ${error instanceof Error ? error.message : String(error)}` 
          };
        }
      }
      
      return { success: false, message: '不支持的请求方法' };
    },
    
    // 版本发布和激活
    '/api/queries/versions/.*/publish': (method: string, data?: any, url?: string) => {
      // 解析URL，获取版本ID
      const urlParts = url?.split('/') || [];
      const versionIndex = urlParts.findIndex(part => part === 'versions') + 1;
      const versionId = versionIndex > 0 && versionIndex < urlParts.length ? urlParts[versionIndex] : '';
      
      console.log('[Mock Axios] 处理版本发布请求:', url, '方法:', method, '版本ID:', versionId);
      
      if (method.toLowerCase() === 'post') {
        try {
          // 返回已发布的版本数据
          const publishedVersion = {
            id: versionId,
            queryId: versionId.startsWith('ver-') ? versionId.split('-')[1] : 'query-1',
            versionNumber: parseInt(versionId.split('-').pop() || '1', 10),
            queryText: "SELECT * FROM example_table LIMIT 10",
            status: 'PUBLISHED',
            isActive: false,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
            dataSourceId: "ds-1"
          };
          
          console.log('[Mock Axios] 返回已发布的版本:', publishedVersion);
          return { success: true, data: publishedVersion };
        } catch (error) {
          console.error('[Mock Axios] 发布版本失败:', error);
          return { 
            success: false, 
            message: `发布版本失败: ${error instanceof Error ? error.message : String(error)}` 
          };
        }
      }
      
      return { success: false, message: '不支持的请求方法' };
    },
    
    // 获取查询执行计划
    '/api/queries/.*/execution-plan': (method: string, data?: any, url?: string) => {
      if (method === 'get') {
        // 解析查询ID
        const parts = url?.split('/') || [];
        const queryId = parts.length >= 4 ? parts[3] : '';
        console.log('[Mock Axios] 处理查询执行计划请求:', queryId);
        
        // 查找查询
        const query = mockQueries.find(q => q.id === queryId);
        if (!query) {
          console.warn(`[Mock Axios] 未找到查询 ${queryId}，返回空执行计划`);
        }
        
        // 返回模拟的执行计划数据
        const mockPlan = {
          id: `plan-${Date.now()}`,
          queryId: queryId,
          createdAt: new Date().toISOString(),
          planDetails: {
            steps: [
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
            ],
            totalCost: 51.4,
            estimatedRows: 950,
            estimatedExecutionTime: 120
          },
          queryText: query?.queryText || "SELECT * FROM users WHERE id > 0 ORDER BY id",
          dataSourceId: query?.dataSourceId || "ds-1"
        };
        
        console.log('[Mock Axios] 返回模拟执行计划');
        return { success: true, data: mockPlan };
      }
      
      return { success: false, message: '不支持的请求方法' };
    },
    
    // 废弃查询版本 - 处理 /api/queries/versions/management/{queryId}/deprecate/{versionId} 路径
    '/api/queries/versions/management/.*/deprecate/.*': (method: string, data?: any, url?: string) => {
      console.log('[Mock Axios] 尝试匹配废弃版本请求:', url, '方法:', method);
      
      // 从URL中提取查询ID和版本ID
      // URL格式: /api/queries/versions/management/{queryId}/deprecate/{versionId}
      const urlParts = url?.split('/') || [];
      
      console.log('[Mock Axios] URL分解部分:', urlParts);
      
      // 查找management和deprecate索引位置
      const managementIndex = urlParts.findIndex(part => part === 'management');
      const deprecateIndex = urlParts.findIndex(part => part === 'deprecate');
      
      console.log('[Mock Axios] Management索引:', managementIndex, 'Deprecate索引:', deprecateIndex);
      
      // 提取queryId和versionId
      const queryId = managementIndex >= 0 && managementIndex + 1 < urlParts.length ? urlParts[managementIndex + 1] : '';
      const versionId = deprecateIndex >= 0 && deprecateIndex + 1 < urlParts.length ? urlParts[deprecateIndex + 1] : '';
      
      console.log('[Mock Axios] 处理废弃版本请求:', url, '方法:', method);
      console.log('[Mock Axios] 解析后的查询ID:', queryId, '版本ID:', versionId);
      
      if (method.toLowerCase() === 'post') {
        try {
          // 创建一个虚拟查询，以防在mockQueries中找不到
          let query = mockQueries.find(q => q.id === queryId);
          
          if (!query) {
            console.warn(`[Mock Axios] 未找到ID为${queryId}的查询，创建虚拟查询对象`);
            query = {
              id: queryId,
              name: `查询 ${queryId}`,
              description: '虚拟创建的查询',
              queryText: "SELECT * FROM example_table LIMIT 10",
              dataSourceId: "ds-1",
              status: 'PUBLISHED' as QueryStatus,
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              updatedAt: new Date().toISOString(),
              isFavorite: false,
              executionCount: 0,
              executionTime: 0,
              resultCount: 0,
              isActive: true,
              serviceStatus: 'ENABLED' as QueryServiceStatus,
              queryType: 'SQL' as QueryType,
            };
          }
          
          // 模拟废弃版本
          const deprecatedVersion = {
            id: versionId,
            queryId: queryId,
            versionNumber: parseInt(versionId.split('-').pop() || '1'),
            queryText: query.queryText || "SELECT * FROM example_table LIMIT 10",
            status: 'DEPRECATED',
            isActive: false,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date().toISOString(),
            deprecatedAt: new Date().toISOString(),
            dataSourceId: query.dataSourceId || "ds-1"
          };
          
          console.log('[Mock Axios] 返回已废弃的版本:', deprecatedVersion);
          return { success: true, data: deprecatedVersion };
        } catch (error) {
          console.error('[Mock Axios] 废弃版本失败:', error);
          return { 
            success: false, 
            message: `废弃版本失败: ${error instanceof Error ? error.message : String(error)}` 
          };
        }
      }
      
      return { success: false, message: '不支持的请求方法' };
    },
    
    // 执行查询
    '/api/queries/.*/execute': (method: string, data?: any, url?: string) => {
      if (method === 'post' || method === 'get') {
        // 从URL中提取查询ID
        // 路径模式: /api/queries/{queryId}/execute
        const urlParts = url?.split('/') || [];
        const queryId = urlParts.length >= 4 ? urlParts[3] : '';
        
        console.log('[Mock Axios] 执行查询:', queryId, '完整URL:', url, '方法:', method);
        
        try {
          // 定义字段信息，供字段映射使用
          const fieldInfo = [
            { name: 'id', type: 'integer', displayName: 'ID' },
            { name: 'name', type: 'string', displayName: '名称' },
            { name: 'email', type: 'string', displayName: '邮箱' },
            { name: 'age', type: 'integer', displayName: '年龄' },
            { name: 'status', type: 'string', displayName: '状态' },
            { name: 'created_at', type: 'timestamp', displayName: '创建时间' }
          ];
          
          // 生成模拟查询结果数据
          const rowData = Array.from({ length: 20 }, (_, i) => ({
            id: i + 1,
            name: `测试用户 ${i + 1}`,
            email: `user${i + 1}@example.com`,
            age: Math.floor(Math.random() * 50) + 18,
            status: i % 3 === 0 ? 'active' : (i % 3 === 1 ? 'pending' : 'inactive'),
            created_at: new Date(Date.now() - i * 86400000).toISOString()
          }));
          
          // 生成结果对象，符合QueryResult接口
          const mockResult = {
            id: `result-${Date.now()}`,
            queryId: queryId,
            status: 'COMPLETED',
            executionTime: 253,
            createdAt: new Date().toISOString(),
            rowCount: rowData.length,
            columns: fieldInfo.map(field => field.name),
            fields: fieldInfo,
            rows: rowData,
            data: {
              fields: fieldInfo,
              rows: rowData,
              rowCount: rowData.length,
              page: 1,
              pageSize: 20,
              totalCount: rowData.length,
              totalPages: 1
            }
          };
          
          console.log(`[Mock Axios] 返回查询结果，包含${mockResult.columns.length}列和${mockResult.rows.length}行数据`);
          return { success: true, data: mockResult };
        } catch (error) {
          console.error('[Mock Axios] 生成查询结果失败:', error);
          return { 
            success: false, 
            message: `执行查询失败: ${error instanceof Error ? error.message : String(error)}` 
          };
        }
      }
      
      return { success: false, message: '不支持的请求方法' };
    },
    
    // 获取单个查询
    '/api/queries/.*': (method: string, data?: any, url?: string) => {
      const isSpecialEndpoint = url?.includes('/favorites') || 
                              url?.includes('/history') || 
                              url?.includes('/execute') || 
                              url?.includes('/execution-plan');
                              
      if (method === 'get' && !isSpecialEndpoint) {
        // 解析查询ID
        const parts = url?.split('/') || [];
        const queryId = parts.length >= 4 ? parts[3] : '';
        console.log('[Mock Axios] 获取单个查询，ID:', queryId);
        
        const query = mockQueries.find(q => q.id === queryId);
        if (!query) {
          return { success: false, message: `未找到ID为${queryId}的查询` };
        }
        
        return { success: true, data: query };
      }
      
      return { success: true, data: {} };
    },
    
    // 获取查询历史
    '/api/queries/history': (method: string, data?: any) => {
      if (method === 'get') {
        console.log('[Mock Axios] 处理查询历史请求');
        
        // 生成模拟查询历史数据
        const historyItems = Array.from({ length: 20 }, (_, i) => {
          const query = mockQueries[i % mockQueries.length];
          const timestamp = new Date(Date.now() - i * 3600000);
          
          return {
            id: `history-${i}`,
            queryId: query.id,
            queryName: query.name,
            dataSourceId: query.dataSourceId,
            dataSourceName: query.dataSourceName,
            executionTime: Math.floor(Math.random() * 500) + 50,
            rowCount: Math.floor(Math.random() * 1000),
            status: i % 10 === 0 ? 'FAILED' : 'COMPLETED',
            error: i % 10 === 0 ? '模拟执行错误' : null,
            createdAt: timestamp.toISOString(),
            executedBy: 'current-user'
          };
        });
        
        return { 
          success: true, 
          data: {
            items: historyItems,
            total: 100, // 假设总共有100条历史记录
            page: 1,
            size: 20,
            totalPages: 5
          }
        };
      }
      
      return { success: false, message: '不支持的请求方法' };
    },
    
    // 元数据API
    '/api/metadata/.*/tables': (method: string, data?: any, url?: string) => {
      if (method === 'get') {
        // 路径分析：/api/metadata/{dataSourceId}/tables
        const parts = url?.split('/') || [];
        const dataSourceId = parts.length >= 4 ? parts[3] : '';
        
        console.log('[Mock Axios] 处理元数据表列表请求，数据源ID:', dataSourceId);
        
        // 检查是否是获取单个表的请求
        if (parts.length >= 6) {
          const tableName = parts[5];
          console.log('[Mock Axios] 获取单表元数据:', tableName);
          
          // 查找表
          const table = mockMetadata.tables.find(t => t.name === tableName);
          if (!table) {
            return { success: false, message: `未找到表 ${tableName}` };
          }
          
          return {
            success: true,
            data: {
              ...table,
              dataSourceId
            }
          };
        }
        
        // 返回所有表列表 - 以items格式返回，符合前端预期
        return {
          success: true,
          data: {
            items: mockMetadata.tables,
            pagination: {
              total: mockMetadata.tables.length,
              page: 1,
              size: 100,
              totalPages: 1
            }
          }
        };
      }
      
      return { success: true, data: { items: [] } };
    },
    
    // 默认处理程序，返回空数据
    'default': () => {
      return { success: true, data: [] };
    }
  };
  
  /**
   * 生成模拟响应
   */
  const generateMockResponse = async (config: any) => {
    console.log('[Mock Axios] 生成模拟响应:', config.url, config.method);
    
    // 随机延迟200-600ms
    await new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 200));
    
    try {
      // 查找匹配的处理程序
      let handler = mockDataHandlers.default;
      let handlerKey = 'default';
      
      // 特殊处理集成列表请求
      if (config.url.includes('/api/low-code/apis') && !config.url.includes('/test')) {
        if (config.url === '/api/low-code/apis' || config.url.match(/^\/api\/low-code\/apis\/?(\?.*)?$/)) {
          // 集成列表请求
          console.log('[Mock Axios] 直接处理集成列表请求');
          if (config.method.toLowerCase() === 'get') {
            return {
              data: { success: true, data: mockIntegrations },
              status: 200,
              statusText: 'OK',
              headers: {},
              config
            };
          }
        }
      }
      
      // 尝试精确匹配
      if (mockDataHandlers[config.url]) {
        handler = mockDataHandlers[config.url];
        handlerKey = config.url;
      } else {
        // 尝试正则匹配
        for (const key of Object.keys(mockDataHandlers)) {
          if (key === 'default') continue;
          
          // 构建部分匹配正则，而不是严格的完全匹配
          // 将路径模式转换为部分匹配模式
          const pattern = key.replace(/\./g, '\\.');  // 转义点号
          const regex = new RegExp(pattern);
          
          if (regex.test(config.url)) {
            handler = mockDataHandlers[key];
            handlerKey = key;
            console.log(`[Mock Axios] 正则匹配成功: ${pattern} -> ${config.url}`);
            break;
          }
        }
      }
      
      console.log(`[Mock Axios] 使用处理程序: ${handlerKey}`);
      
      // 调用处理程序生成模拟数据
      const mockData = handler(
        config.method, 
        config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : undefined,
        config.url
      );
      
      return {
        data: mockData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      };
    } catch (mockError) {
      console.error('[Mock Axios] 生成模拟响应失败:', mockError);
      throw mockError;
    }
  };
  
  // 请求拦截器
  axios.interceptors.request.use(
    async function (config) {
      // 只处理API请求
      if (config.url?.includes('/api/')) {
        console.log('[Mock Axios] 拦截请求:', config.url, config.method);
        
        // 设置一个标记，表示这是一个被拦截的请求
        config.headers = config.headers || {};
        config.headers['X-Mocked-Request'] = 'true';
        
        // 添加禁用缓存的头信息
        config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        config.headers['Pragma'] = 'no-cache';
        config.headers['Expires'] = '0';
        config.headers['If-Modified-Since'] = '0';
        
        // 添加随机参数以确保URL唯一
        const separator = config.url.includes('?') ? '&' : '?';
        config.url = `${config.url}${separator}_t=${Date.now()}`;
        
        // 标记这个请求需要模拟响应
        config.mockResponse = true;
        
        // 确保URL是相对路径，移除域名和端口
        if (config.url.match(/^https?:\/\//)) {
          const urlObj = new URL(config.url);
          config.url = urlObj.pathname + urlObj.search;
          console.log('[Mock Axios] 规范化URL:', config.url);
        }
      }
      
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  
  // 响应拦截器
  axios.interceptors.response.use(
    async function (response) {
      // 检查是否是API请求
      if (
        response.config && 
        response.config.url?.includes('/api/')
      ) {
        console.log('[Mock Axios] 拦截成功的响应:', response.config.url);
        
        // 确保标记配置
        if (!response.config.mockResponse) {
          response.config.mockResponse = true;
          if (!response.config.headers) {
            response.config.headers = {} as any; // 使用类型断言避免类型错误
          }
          // 使用类型安全的方式设置请求头
          if (typeof response.config.headers === 'object') {
            response.config.headers['X-Mocked-Request'] = 'true';
          }
        }
        
        // 生成模拟响应
        return await generateMockResponse(response.config);
      }
      
      return response;
    },
    async function (error) {
      // 处理所有API请求的错误
      if (
        error.config && 
        error.config.url?.includes('/api/')
      ) {
        console.log('[Mock Axios] 处理失败的请求:', error.config.url);
        
        // 确保URL是相对路径，移除域名和端口
        if (error.config.url.match(/^https?:\/\//)) {
          const urlObj = new URL(error.config.url);
          error.config.url = urlObj.pathname + urlObj.search;
          console.log('[Mock Axios] 规范化URL:', error.config.url);
        }
        
        try {
          // 生成模拟响应
          return await generateMockResponse(error.config);
        } catch (mockError) {
          console.error('[Mock Axios] 生成模拟响应失败:', mockError);
        }
      }
      
      return Promise.reject(error);
    }
  );
  
  console.log('[Mock] Axios拦截器已启用');
}