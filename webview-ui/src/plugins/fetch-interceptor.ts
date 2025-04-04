/**
 * 全局fetch拦截器
 * 在Mock模式下拦截所有API请求，返回模拟数据
 */

import { mockDataSources, mockMetadata, mockQueries, mockIntegrations } from './mockData';
import type { QueryStatus, QueryServiceStatus, QueryType } from '@/types/query';

// 模拟表数据
const mockTableData = {
  users: Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    username: `user${i + 1}`,
    email: `user${i + 1}@example.com`,
    created_at: new Date(Date.now() - i * 86400000).toISOString()
  })),
  orders: Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    user_id: Math.floor(Math.random() * 20) + 1,
    amount: (Math.random() * 1000).toFixed(2),
    created_at: new Date(Date.now() - i * 86400000).toISOString()
  })),
  products: Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: (Math.random() * 100).toFixed(2),
    stock: Math.floor(Math.random() * 100)
  }))
};

// 检查是否启用mock模式 - 统一环境变量名称
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
console.log('[Mock] Fetch拦截器 - Mock模式:', USE_MOCK ? '已启用' : '已禁用');

/**
 * 在开发模式下启用fetch请求拦截器
 * 注意：此函数只能拦截通过window.fetch进行的请求，不能拦截直接通过curl或其他外部工具发送的请求
 * 要拦截外部请求，需要在服务端添加拦截器/中间件
 */
export function setupFetchInterceptor() {
  console.log('[Mock] 配置Fetch拦截器, 当前启用状态:', USE_MOCK);
  
  // 如果启用了Mock模式，拦截fetch请求
  if (USE_MOCK) {
    // 保存原始fetch函数
    const originalFetch = window.fetch;
  
    // 重写fetch函数
    window.fetch = function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
      // 转换input为string
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      
      // 提取请求路径，确保相对路径正确解析
      let path = url;
      try {
        // 确保相对路径被正确解析
        if (url.startsWith('/')) {
          // 对于相对路径，直接使用
          path = url;
        } else if (url.match(/^https?:\/\//)) {
          // 对于完整URL，提取path部分
          const urlObj = new URL(url);
          path = urlObj.pathname + urlObj.search;
        }
      } catch (e) {
        console.error('[Mock] URL解析错误:', e);
      }
      
      // 如果不是API请求，使用原始fetch
      if (!path.includes('/api/')) {
        return originalFetch(input, init);
      }

      // 对API请求添加时间戳以防止缓存
      let finalPath = path;
      if (path.includes('/api/')) {
        const separator = path.includes('?') ? '&' : '?';
        finalPath = `${path}${separator}_t=${Date.now()}`;
        console.log('[Mock] 添加时间戳防止缓存:', finalPath);
      }

      // 创建新的init对象，添加禁用缓存的头信息
      const newInit: RequestInit = { ...init };
      newInit.headers = new Headers(newInit.headers || {});
      newInit.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      newInit.headers.set('Pragma', 'no-cache');
      newInit.headers.set('Expires', '0');
      newInit.headers.set('If-Modified-Since', '0');
      
      console.log('[Mock] 拦截fetch请求:', finalPath);
      
      // 延迟模拟网络请求
      return new Promise(async (resolve) => {
        // 随机延迟200-600ms
        const delay = Math.random() * 400 + 200;
        setTimeout(async () => {
          try {
            const mockResponse = await handleMockRequest(finalPath, newInit);
            resolve(new Response(JSON.stringify(mockResponse), {
              status: 200,
              headers: new Headers({
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
              })
            }));
          } catch (error) {
            console.error('[Mock] 处理请求失败:', error);
            resolve(new Response(JSON.stringify({
              success: false,
              message: error instanceof Error ? error.message : String(error)
            }), {
              status: 500,
              headers: new Headers({
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
              })
            }));
          }
        }, delay);
      });
    };
    
    console.log('[Mock] Fetch拦截器已启用');
    
    // 注意: 这个前端拦截器只能处理通过window.fetch进行的请求
    // 外部工具如curl直接发送的请求不会经过这个拦截器
    // 需要在服务端（如Vite开发服务器）添加服务器中间件处理这些请求
    console.warn('[Mock] 警告: 外部工具发送的API请求（如curl）不会被前端拦截器处理');
    console.warn('[Mock] 建议: 添加Vite服务器中间件处理这些请求');
  }
}

/**
 * 处理模拟请求并返回模拟数据
 * 导出此函数以便在Vite服务器中间件中使用
 */
export async function handleMockRequest(url: string, init?: RequestInit): Promise<any> {
  // 提取HTTP方法，默认为GET
  const method = init?.method || 'GET';
  
  // 查询相关API
  if (url.includes('/api/queries')) {
    console.log('[Mock] 拦截查询API请求:', url, '方法:', method);
    
    // 处理收藏的查询列表 - 放在前面处理，避免和通用查询列表冲突
    if (url.match(/\/api\/queries\/favorites(\?.*)?$/) && method === 'GET') {
      console.log('[Mock] 处理收藏的查询列表请求:', url);
      
      try {
        // 解析查询参数
        const searchParams = new URL('http://localhost' + url, 'http://localhost').searchParams;
        const page = parseInt(searchParams.get('page') || '1', 10);
        const size = parseInt(searchParams.get('size') || '10', 10);
        const status = searchParams.get('status');
        const dataSourceId = searchParams.get('dataSourceId');
        const searchTerm = searchParams.get('search');
        
        console.log('[Mock] 收藏查询参数:', { page, size, status, dataSourceId, searchTerm });
        
        // 过滤出收藏的查询
        let favoriteQueries = mockQueries.filter(q => q.isFavorite === true);
        
        // 应用其他过滤条件
        if (status) {
          favoriteQueries = favoriteQueries.filter(q => q.status === status);
        }
        
        if (dataSourceId) {
          favoriteQueries = favoriteQueries.filter(q => q.dataSourceId === dataSourceId);
        }
        
        if (searchTerm) {
          const keyword = searchTerm.toLowerCase();
          favoriteQueries = favoriteQueries.filter(q => 
            (q.name && q.name.toLowerCase().includes(keyword)) || 
            (q.description && q.description.toLowerCase().includes(keyword))
          );
        }
        
        // 应用分页
        const start = (page - 1) * size;
        const end = start + size;
        const paginatedQueries = favoriteQueries.slice(start, Math.min(end, favoriteQueries.length));
        
        const totalCount = favoriteQueries.length;
        const totalPages = Math.max(1, Math.ceil(totalCount / size));
        
        console.log(`[Mock] 返回${paginatedQueries.length}个收藏的查询，总数：${totalCount}，总页数：${totalPages}`);
        
        // 确保返回的是正确格式的JSON
        const response = { 
          success: true, 
          data: {
            items: paginatedQueries,
            total: totalCount,
            page: page,
            size: size,
            totalPages: totalPages
          }
        };
        
        return response;
      } catch (error) {
        console.error('[Mock] 处理收藏查询列表请求时出错:', error);
        
        // 返回空列表，避免前端报错
        return {
          success: true,
          data: {
            items: [],
            total: 0,
            page: 1,
            size: 10,
            totalPages: 0
          }
        };
      }
    }
    
    // 处理查询历史
    if (url.match(/\/api\/queries\/history(\?.*)?$/) && method === 'GET') {
      console.log('[Mock] 处理查询历史请求');
      
      // 解析分页参数
      const searchParams = new URL('http://localhost' + url, 'http://localhost').searchParams;
      const page = parseInt(searchParams.get('page') || '1', 10);
      const size = parseInt(searchParams.get('size') || '20', 10);
      
      // 生成模拟查询历史数据
      const historyItems = Array.from({ length: size }, (_, i) => {
        const itemIndex = (page - 1) * size + i;
        const query = mockQueries[itemIndex % mockQueries.length];
        const timestamp = new Date(Date.now() - itemIndex * 3600000);
        
        return {
          id: `history-${itemIndex}`,
          queryId: query.id,
          queryName: query.name,
          dataSourceId: query.dataSourceId,
          dataSourceName: query.dataSourceName,
          executionTime: Math.floor(Math.random() * 500) + 50,
          rowCount: Math.floor(Math.random() * 1000),
          status: itemIndex % 10 === 0 ? 'FAILED' : 'COMPLETED',
          error: itemIndex % 10 === 0 ? '模拟执行错误' : null,
          createdAt: timestamp.toISOString(),
          executedBy: 'current-user'
        };
      });
      
      return { 
        success: true, 
        data: {
          items: historyItems,
          total: 100, // 假设总共有100条历史记录
          page: page,
          size: size,
          totalPages: Math.ceil(100 / size)
        }
      };
    }
    
    // 获取查询执行计划: /api/queries/{id}/execution-plan
    const executionPlanMatch = url.match(/\/api\/queries\/([^\/\?]+)\/execution-plan/);
    if (executionPlanMatch && method === 'GET') {
      const queryId = executionPlanMatch[1];
      console.log('[Mock] 处理查询执行计划请求:', queryId);
      
      try {
        // 识别查询结果ID (result-123456)
        const isResultId = queryId.startsWith('result-');
        console.log('[Mock] 查询ID类型:', isResultId ? '查询结果ID' : '常规查询ID');
        
        // 查找查询 - 对于查询结果ID直接使用
        const query = isResultId ? null : mockQueries.find(q => q.id === queryId);
        if (!query && !isResultId) {
          console.warn(`[Mock] 未找到查询 ${queryId}，返回模拟执行计划`);
        }
        
        // 返回模拟的执行计划数据
        const mockPlan = {
          id: `plan-${Date.now()}`,
          queryId: queryId,
          createdAt: new Date().toISOString(),
          plan: [
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
          estimatedCost: 51.4,
          estimatedRows: 950,
          planningTime: 0.12,
          executionTime: 0.35,
          queryText: query?.queryText || (isResultId ? "SELECT * FROM users WHERE id > 0 ORDER BY id" : "未知查询"),
          dataSourceId: query?.dataSourceId || "ds-1"
        };
        
        console.log('[Mock] 返回模拟执行计划');
        return { success: true, data: mockPlan };
      } catch (error) {
        console.error('[Mock] 生成执行计划时出错:', error);
        return { 
          success: false, 
          message: `获取执行计划失败: ${error instanceof Error ? error.message : String(error)}`,
          error: {
            code: 'INTERNAL_ERROR',
            message: '获取执行计划时发生内部错误'
          }
        };
      }
    }
    
    // 获取查询参数: /api/queries/{id}/parameters
    const queryParametersMatch = url.match(/\/api\/queries\/([^\/\?]+)\/parameters/);
    if (queryParametersMatch && method === 'GET') {
      const queryId = queryParametersMatch[1];
      console.log('[Mock] 处理查询参数请求:', queryId);
      
      // 查找查询
      const query = mockQueries.find(q => q.id === queryId);
      if (!query) {
        console.warn(`[Mock] 未找到查询 ${queryId}，返回空参数列表`);
      }
      
      // 生成模拟参数
      const mockParameters = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => {
        // 可能的参数类型
        const paramTypes = ['string', 'number', 'boolean', 'date'];
        const type = paramTypes[Math.floor(Math.random() * paramTypes.length)];
        
        // 生成参数对象
        const param = {
          id: `param-${queryId}-${i+1}`,
          name: `param${i + 1}`,
          label: `参数 ${i + 1}`,
          type,
          required: Math.random() > 0.5,
          options: type === 'string' ? Array.from({ length: 3 }, (_, j) => ({ label: `选项${j+1}`, value: `value${j+1}` })) : undefined
        } as any; // 使用类型断言避免类型错误
        
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
      
      console.log(`[Mock] 返回${mockParameters.length}个模拟参数`);
      return { success: true, data: mockParameters };
    }
    
    // 获取查询列表: /api/queries
    if (url.match(/\/api\/queries(\?.*)?$/) && method === 'GET' && !url.includes('/favorites') && !url.includes('/history')) {
      console.log('[Mock] 处理查询列表请求:', url);
      
      try {
        // 解析查询参数
        const searchParams = new URL('http://localhost' + url, 'http://localhost').searchParams;
        const page = parseInt(searchParams.get('page') || '1', 10);
        const size = parseInt(searchParams.get('pageSize') || '10', 10);
        const status = searchParams.get('status');
        const dataSourceId = searchParams.get('dataSourceId');
        const searchTerm = searchParams.get('search') || searchParams.get('searchText');
        const queryType = searchParams.get('queryType');
        const serviceStatus = searchParams.get('serviceStatus');
        
        console.log('[Mock] 查询列表参数:', { page, size, status, dataSourceId, searchTerm, queryType, serviceStatus });
        
        // 应用过滤条件
        let filteredQueries = [...mockQueries];
        
        if (status) {
          filteredQueries = filteredQueries.filter(q => q.status === status);
        }
        
        if (dataSourceId) {
          filteredQueries = filteredQueries.filter(q => q.dataSourceId === dataSourceId);
        }
        
        if (searchTerm) {
          const keyword = searchTerm.toLowerCase();
          filteredQueries = filteredQueries.filter(q => 
            (q.name && q.name.toLowerCase().includes(keyword)) || 
            (q.description && q.description.toLowerCase().includes(keyword))
          );
        }
        
        if (queryType) {
          filteredQueries = filteredQueries.filter(q => q.queryType === queryType);
        }
        
        if (serviceStatus) {
          filteredQueries = filteredQueries.filter(q => q.serviceStatus === serviceStatus);
        }
        
        // 应用分页
        const start = (page - 1) * size;
        const end = start + size;
        const paginatedQueries = filteredQueries.slice(start, Math.min(end, filteredQueries.length));
        
        const totalCount = filteredQueries.length;
        const totalPages = Math.max(1, Math.ceil(totalCount / size));
        
        console.log(`[Mock] 返回${paginatedQueries.length}个查询，总数：${totalCount}，总页数：${totalPages}`);
        
        // 确保返回的是正确格式的JSON
        const response = { 
          success: true, 
          data: {
            items: paginatedQueries,
            total: totalCount,
            page: page,
            pageSize: size,
            totalPages: totalPages
          }
        };
        
        return response;
      } catch (error) {
        console.error('[Mock] 处理查询列表请求时出错:', error);
        
        // 返回空列表，避免前端报错
        return {
          success: true,
          data: {
            items: [],
            total: 0,
            page: 1,
            pageSize: 10,
            totalPages: 0
          }
        };
      }
    }
    
    // 执行查询: /api/queries/{id}/execute
    const executeQueryMatch = url.match(/\/api\/queries\/([^\/\?]+)\/execute/);
    if (executeQueryMatch && method === 'POST') {
      const queryId = executeQueryMatch[1];
      console.log('[Mock] 执行查询:', queryId, '请求方法:', method);
      
      const query = mockQueries.find(q => q.id === queryId);
      if (!query) {
        console.error(`[Mock] 未找到查询 ${queryId}，返回模拟查询结果`);
      }
      
      try {
        const requestBody = init?.body ? JSON.parse(init.body as string) : {};
        console.log('[Mock] 执行查询请求体:', JSON.stringify(requestBody, null, 2));
        
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
        
        // 生成结果对象
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
        
        console.log(`[Mock] 返回查询结果，包含${mockResult.columns.length}列和${mockResult.rows.length}行数据`);
        return { success: true, data: mockResult };
      } catch (error) {
        console.error('[Mock] 执行查询解析请求体失败:', error);
        return { 
          success: false, 
          message: `执行查询失败: ${error instanceof Error ? error.message : String(error)}` 
        };
      }
    }
    
    // 执行即席查询: /api/queries/execute（无queryId的情况）
    if (url.endsWith('/api/queries/execute') && method === 'POST') {
      console.log('[Mock] 执行即席查询，请求方法:', method);
      
      try {
        const requestBody = init?.body ? JSON.parse(init.body as string) : {};
        console.log('[Mock] 执行即席查询请求体:', JSON.stringify(requestBody, null, 2));
        
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
        
        // 生成结果对象
        const mockResult = {
          id: `result-${Date.now()}`,
          queryId: 'ad-hoc-query',
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
        
        console.log(`[Mock] 返回即席查询结果，包含${mockResult.columns.length}列和${mockResult.rows.length}行数据`);
        return { success: true, data: mockResult };
      } catch (error) {
        console.error('[Mock] 执行即席查询解析请求体失败:', error);
        return { 
          success: false, 
          message: `执行查询失败: ${error instanceof Error ? error.message : String(error)}` 
        };
      }
    }
    
    // 获取单个查询 - 需要放在通用查询处理之前
    const singleQueryMatch = url.match(/\/api\/queries\/([^\/\?]+)$/);
    if (singleQueryMatch && method === 'GET') {
      const queryId = singleQueryMatch[1];
      console.log('[Mock] 获取单个查询:', queryId);
      
      try {
        // 查找查询
        const query = mockQueries.find(q => q.id === queryId);
        
        if (!query) {
          console.warn(`[Mock] 未找到ID为${queryId}的查询，返回错误响应`);
          // 返回错误响应而不是抛出异常
          return { 
            success: false, 
            message: `未找到ID为${queryId}的查询`,
            error: {
              code: 'NOT_FOUND',
              message: `未找到ID为${queryId}的查询`
            }
          };
        }
        
        console.log('[Mock] 返回查询详情:', query.id, query.name);
        return { success: true, data: query };
      } catch (error) {
        // 捕获其他可能的错误
        console.error('[Mock] 获取查询详情时出错:', error);
        return { 
          success: false, 
          message: `获取查询详情失败: ${error instanceof Error ? error.message : String(error)}`,
          error: {
            code: 'INTERNAL_ERROR',
            message: '获取查询详情时发生内部错误'
          }
        };
      }
    }
    
    // 处理查询版本列表: GET /api/queries/{id}/versions
    const getVersionsMatch = url.match(/\/api\/queries\/([^\/\?]+)\/versions(\?.*)?$/);
    if (getVersionsMatch && method === 'GET') {
      const queryId = getVersionsMatch[1];
      console.log('[Mock] 处理查询版本列表请求，查询ID:', queryId);
      
      // 查找查询
      const query = mockQueries.find(q => q.id === queryId);
      if (!query) {
        console.warn(`[Mock] 未找到ID为${queryId}的查询，返回空版本列表`);
        return { success: true, data: [] };
      }
      
      // 解析查询参数
      const searchParams = new URL('http://localhost' + url, 'http://localhost').searchParams;
      const status = searchParams.get('status');
      
      // 生成3个模拟版本记录
      let versions = Array.from({ length: 3 }, (_, i) => {
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
      
      // 应用状态筛选
      if (status) {
        versions = versions.filter(v => v.status === status);
      }
      
      console.log(`[Mock] 返回${versions.length}个版本`);
      return { success: true, data: versions };
    }
    
    // 创建查询版本: POST /api/queries/{id}/versions
    const createVersionMatch = url.match(/\/api\/queries\/([^\/\?]+)\/versions$/);
    if (createVersionMatch && method === 'POST') {
      const queryId = createVersionMatch[1];
      console.log('[Mock] 处理创建查询版本请求，查询ID:', queryId);
      
      try {
        // 查找查询
        const query = mockQueries.find(q => q.id === queryId);
        if (!query) {
          console.warn(`[Mock] 未找到ID为${queryId}的查询`);
          return { 
            success: false, 
            message: `未找到ID为${queryId}的查询` 
          };
        }
        
        // 解析请求体
        const requestBody = init?.body ? JSON.parse(init.body as string) : {};
        console.log('[Mock] 创建版本请求体:', JSON.stringify(requestBody, null, 2));
        
        // 确定新版本号
        const versionNumber = Math.floor(Math.random() * 100) + 1;
        
        // 创建新版本
        const newVersion = {
          id: `ver-${queryId}-${versionNumber}`,
          queryId: queryId,
          versionNumber: versionNumber,
          queryText: requestBody.sqlContent || query.queryText,
          status: 'DRAFT',
          isActive: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          dataSourceId: requestBody.dataSourceId || query.dataSourceId,
          description: requestBody.description || ''
        };
        
        console.log('[Mock] 返回新创建的查询版本:', newVersion);
        return { success: true, data: newVersion };
      } catch (error) {
        console.error('[Mock] 创建查询版本失败:', error);
        return { 
          success: false, 
          message: `创建查询版本失败: ${error instanceof Error ? error.message : String(error)}` 
        };
      }
    }
    
    // 激活查询版本: POST /api/queries/{id}/versions/{versionId}/activate
    const activateVersionMatch = url.match(/\/api\/queries\/([^\/\?]+)\/versions\/([^\/\?]+)\/activate$/);
    if (activateVersionMatch && method === 'POST') {
      const queryId = activateVersionMatch[1];
      const versionId = activateVersionMatch[2];
      console.log('[Mock] 处理激活查询版本请求，查询ID:', queryId, '版本ID:', versionId);
      
      try {
        // 查找查询
        const query = mockQueries.find(q => q.id === queryId);
        if (!query) {
          console.warn(`[Mock] 未找到ID为${queryId}的查询`);
          return { 
            success: false, 
            message: `未找到ID为${queryId}的查询` 
          };
        }
        
        // 模拟激活版本
        const activatedVersion = {
          id: versionId,
          queryId: queryId,
          versionNumber: parseInt(versionId.split('-').pop() || '1'),
          queryText: query.queryText,
          status: 'PUBLISHED',
          isActive: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
          publishedAt: new Date().toISOString(),
          dataSourceId: query.dataSourceId
        };
        
        console.log('[Mock] 返回已激活的查询版本:', activatedVersion);
        return { success: true, data: activatedVersion };
      } catch (error) {
        console.error('[Mock] 激活查询版本失败:', error);
        return { 
          success: false, 
          message: `激活查询版本失败: ${error instanceof Error ? error.message : String(error)}` 
        };
      }
    }
    
    // 废弃查询版本: POST /api/queries/versions/management/{queryId}/deprecate/{versionId}
    const deprecateVersionMatch = url.match(/\/api\/queries\/versions\/management\/([^\/\?]+)\/deprecate\/([^\/\?]+)$/);
    if (deprecateVersionMatch && method === 'POST') {
      const queryId = deprecateVersionMatch[1];
      const versionId = deprecateVersionMatch[2];
      console.log('[Mock] 处理废弃查询版本请求，URL:', url);
      console.log('[Mock] 处理废弃查询版本请求，查询ID:', queryId, '版本ID:', versionId);
      
      try {
        // 查找查询，如果不存在则创建一个模拟查询
        let query = mockQueries.find(q => q.id === queryId);
        
        if (!query) {
          console.warn(`[Mock] 未找到ID为${queryId}的查询，创建虚拟查询对象`);
          
          // 创建一个虚拟查询对象用于响应
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
        
        console.log('[Mock] 返回已废弃的查询版本:', deprecatedVersion);
        return { success: true, data: deprecatedVersion };
      } catch (error) {
        console.error('[Mock] 废弃查询版本失败:', error);
        return { 
          success: false, 
          message: `废弃查询版本失败: ${error instanceof Error ? error.message : String(error)}` 
        };
      }
    }
    
    // 创建新查询: POST /api/queries
    if (url === '/api/queries' && method === 'POST') {
      try {
        console.log('[Mock] 处理创建查询请求');
        
        // 解析请求体
        const requestBody = init?.body ? JSON.parse(init.body as string) : {};
        console.log('[Mock] 创建查询请求体:', JSON.stringify(requestBody, null, 2));
        
        // 创建新查询
        const newQuery = {
          id: `query-${Date.now()}`,
          name: requestBody.name || '未命名查询',
          description: requestBody.description || '',
          folderId: requestBody.folderId || '',
          dataSourceId: requestBody.dataSourceId || '',
          queryType: requestBody.queryType || 'SQL',
          queryText: requestBody.queryText || '',
          status: requestBody.status || 'DRAFT',
          serviceStatus: requestBody.serviceStatus || 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          executionTime: 0,
          resultCount: 0,
          isFavorite: false,
          executionCount: 0,
          lastExecutedAt: new Date().toISOString()
        };
        
        // 添加到模拟数据中
        mockQueries.push(newQuery);
        
        console.log('[Mock] 成功创建查询:', newQuery);
        return { success: true, data: newQuery };
      } catch (error) {
        console.error('[Mock] 创建查询失败:', error);
        return {
          success: false,
          message: `创建查询失败: ${error instanceof Error ? error.message : String(error)}`
        };
      }
    }
    
    // 更新现有查询: PUT /api/queries/{id}
    const updateQueryMatch = url.match(/\/api\/queries\/([^\/\?]+)$/);
    if (updateQueryMatch && method === 'PUT') {
      try {
        const queryId = updateQueryMatch[1];
        console.log(`[Mock] 处理更新查询请求, ID: ${queryId}`);
        
        // 解析请求体
        const requestBody = init?.body ? JSON.parse(init.body as string) : {};
        console.log('[Mock] 更新查询请求体:', JSON.stringify(requestBody, null, 2));
        
        // 查找要更新的查询
        const existingIndex = mockQueries.findIndex(q => q.id === queryId);
        
        if (existingIndex === -1) {
          throw new Error(`未找到ID为${queryId}的查询`);
        }
        
        // 更新查询
        const updatedQuery = {
          ...mockQueries[existingIndex],
          ...requestBody,
          id: queryId, // 确保ID不变
          updatedAt: new Date().toISOString() // 更新时间戳
        };
        
        // 替换原来的查询
        mockQueries[existingIndex] = updatedQuery;
        
        console.log('[Mock] 成功更新查询:', updatedQuery);
        return { success: true, data: updatedQuery };
      } catch (error) {
        console.error('[Mock] 更新查询失败:', error);
        return {
          success: false,
          message: `更新查询失败: ${error instanceof Error ? error.message : String(error)}`
        };
      }
    }
  }
  
  // 数据源管理API
  if (url.includes('/api/datasources')) {
    // 测试数据源连接: /api/datasources/test
    if (url.includes('/api/datasources/test') && method === 'POST') {
      console.log('[Mock] 处理数据源测试连接请求');
      
      try {
        // 解析请求体
        const requestBody = init?.body ? JSON.parse(init.body as string) : {};
        console.log('[Mock] 测试连接请求体:', JSON.stringify(requestBody, null, 2));
        
        // 这里我们可以根据请求体中的数据源类型返回不同的测试结果
        // 目前简单返回成功
        return { 
          success: true, 
          data: {
            success: true,
            message: '连接测试成功',
            details: {
              status: 'SUCCESS',
              connectionTime: 120,
              databaseVersion: requestBody.type === 'mysql' ? '8.0.26' : 
                              requestBody.type === 'postgresql' ? '14.2' : 
                              requestBody.type === 'oracle' ? '19c' : 
                              requestBody.type === 'sqlserver' ? '2019' : '未知版本'
            }
          }
        };
      } catch (error) {
        console.error('[Mock] 测试连接处理错误:', error);
        return { 
          success: false, 
          message: error instanceof Error ? error.message : '测试连接处理失败',
          details: { status: 'ERROR' }
        };
      }
    }
    
    // 单个数据源详情: /api/datasources/{id}
    const idMatch = url.match(/\/api\/datasources\/([^\/\?]+)$/);
    if (idMatch && method === 'GET') {
      const id = idMatch[1];
      const dataSource = mockDataSources.find(ds => ds.id === id);
      
      if (!dataSource) {
        throw new Error(`未找到ID为${id}的数据源`);
      }
      
      return { success: true, data: dataSource };
    }
    
    // 处理可视化保存请求: POST /api/queries/{id}/visualization
    const saveVisualizationMatch = url.match(/\/api\/queries\/([^\/\?]+)\/visualization$/);
    if (saveVisualizationMatch && method === 'POST') {
      try {
        const queryId = saveVisualizationMatch[1];
        console.log(`[Mock] 处理保存查询可视化配置请求, 查询ID: ${queryId}`);
        
        // 解析请求体
        const requestBody = init?.body ? JSON.parse(init.body as string) : [];
        console.log('[Mock] 保存可视化配置请求体:', JSON.stringify(requestBody, null, 2));
        
        // 检查查询是否存在
        const query = mockQueries.find(q => q.id === queryId);
        if (!query) {
          console.warn(`[Mock] 未找到ID为${queryId}的查询，但仍将保存可视化配置`);
        }
        
        // 处理可视化配置数据
        const visualizations = Array.isArray(requestBody) ? requestBody : [requestBody];
        
        // 添加ID和时间戳等信息
        const processedVisualizations = visualizations.map((viz, index) => ({
          ...viz,
          id: viz.id || `viz-${Date.now()}-${index}`,
          queryId: queryId,
          createdAt: viz.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
        
        console.log('[Mock] 成功保存查询可视化配置:', processedVisualizations);
        return { success: true, data: processedVisualizations };
      } catch (error) {
        console.error('[Mock] 保存查询可视化配置失败:', error);
        return {
          success: false,
          message: `保存查询可视化配置失败: ${error instanceof Error ? error.message : String(error)}`
        };
      }
    }
    
    // 数据源列表: /api/datasources
    if (url.match(/\/api\/datasources(\?.*)?$/) && method === 'GET') {
      // 解析查询参数
      const searchParams = new URL('http://localhost' + url, 'http://localhost').searchParams;
      const page = parseInt(searchParams.get('page') || '1', 10);
      const size = parseInt(searchParams.get('size') || '10', 10);
      const nameFilter = searchParams.get('name');
      const typeFilter = searchParams.get('type');
      const statusFilter = searchParams.get('status');
      
      // 应用过滤
      let filteredSources = [...mockDataSources];
      
      if (nameFilter) {
        const keyword = nameFilter.toLowerCase();
        filteredSources = filteredSources.filter(ds => 
          ds.name.toLowerCase().includes(keyword) || 
          ds.description.toLowerCase().includes(keyword)
        );
      }
      
      if (typeFilter) {
        filteredSources = filteredSources.filter(ds => 
          ds.type.toLowerCase() === typeFilter.toLowerCase()
        );
      }
      
      if (statusFilter) {
        filteredSources = filteredSources.filter(ds => 
          ds.status === statusFilter
        );
      }
      
      // 应用分页
      const start = (page - 1) * size;
      const end = Math.min(start + size, filteredSources.length);
      const paginatedSources = filteredSources.slice(start, end);
      
      return { 
        success: true, 
        data: {
          items: paginatedSources,
          pagination: {
            total: filteredSources.length,
            totalPages: Math.ceil(filteredSources.length / size),
            page,
            size
          }
        }
      };
    }
  }
  
  // 元数据API
  if (url.includes('/api/metadata')) {
    // 获取表列表: /api/metadata/{id}/tables
    const tablesMatch = url.match(/\/api\/metadata\/([^\/\?]+)\/tables$/);
    if (tablesMatch && method === 'GET') {
      const id = tablesMatch[1];
      console.log('[Mock] 处理元数据表列表请求，数据源ID:', id);
      
      const dataSource = mockDataSources.find(ds => ds.id === id);
      if (!dataSource) {
        throw new Error(`未找到ID为${id}的数据源`);
      }
      
      // 返回标准化响应格式
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
    
    // 获取表数据预览: /api/metadata/{id}/tables/{tableName}/preview
    const previewMatch = url.match(/\/api\/metadata\/([^\/\?]+)\/tables\/([^\/\?]+)\/preview/);
    if (previewMatch && method === 'GET') {
      const id = previewMatch[1];
      const tableName = previewMatch[2];
      
      const dataSource = mockDataSources.find(ds => ds.id === id);
      if (!dataSource) {
        throw new Error(`未找到ID为${id}的数据源`);
      }
      
      // 获取表数据
      const tableData = mockTableData[tableName as keyof typeof mockTableData];
      if (!tableData) {
        throw new Error(`未找到表${tableName}的数据`);
      }
      
      // 解析查询参数
      const searchParams = new URL('http://localhost' + url, 'http://localhost').searchParams;
      const page = parseInt(searchParams.get('page') || '1', 10);
      const size = parseInt(searchParams.get('size') || '10', 10);
      
      // 应用分页
      const total = tableData.length;
      const start = (page - 1) * size;
      const end = Math.min(start + size, total);
      const paginatedData = tableData.slice(start, end);
      
      // 获取列名
      const columns = Object.keys(tableData[0] || {});
      
      return { 
        success: true, 
        data: {
          rows: paginatedData,
          columns,
          total,
          page,
          size,
          totalPages: Math.ceil(total / size)
        }
      };
    }
  }
  
  // 集成API
  if (url.includes('/api/low-code/apis')) {
    console.log('[Mock] 拦截集成API请求:', url, '方法:', method);
    
    // 获取集成列表
    if ((url === '/api/low-code/apis' || url.match(/\/api\/low-code\/apis(\?.*)?$/)) && method === 'GET') {
      console.log('[Mock] 处理集成列表请求:', url);
      console.log('[Mock] 返回', mockIntegrations.length, '个模拟集成');
      return { 
        success: true, 
        data: mockIntegrations 
      };
    }
    
    // 获取单个集成
    const singleIntegrationMatch = url.match(/\/api\/low-code\/apis\/([^\/]+)$/);
    if (singleIntegrationMatch && method === 'GET') {
      const integrationId = singleIntegrationMatch[1];
      console.log('[Mock] 获取单个集成:', integrationId);
      const integration = mockIntegrations.find(i => i.id === integrationId);
      
      if (!integration) {
        console.warn(`[Mock] 未找到ID为${integrationId}的集成，返回新生成的集成`);
        // 如果未找到集成，生成一个新的
        const newIntegration = {
          id: integrationId,
          name: `模拟集成 ${integrationId}`,
          description: `这是一个自动生成的模拟集成 ${integrationId}`,
          type: 'REST',
          baseUrl: 'https://api.example.com/v1',
          authType: 'BEARER',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          endpoints: [
            {
              id: `endpoint-${integrationId}-1`,
              name: '获取数据',
              method: 'GET',
              path: '/data',
              description: '获取数据接口'
            }
          ]
        };
        return { success: true, data: newIntegration };
      }
      
      return { success: true, data: integration };
    }
  }
  
  // 默认返回空数据
  return { success: true, data: [] };
}