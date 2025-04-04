/**
 * 全局fetch拦截器
 * 在Mock模式下拦截所有API请求，返回模拟数据
 */

import { mockDataSources, mockMetadata, mockQueries, mockIntegrations } from './mockData';

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
  }
}

/**
 * 处理模拟请求并返回模拟数据
 */
async function handleMockRequest(url: string, init?: RequestInit): Promise<any> {
  // 提取HTTP方法，默认为GET
  const method = init?.method || 'GET';
  
  // 查询相关API
  if (url.includes('/api/queries')) {
    console.log('[Mock] 拦截查询API请求:', url, '方法:', method);
    
    // 处理收藏的查询列表 - 放在前面处理，避免和通用查询列表冲突
    if (url.match(/\/api\/queries\/favorites(\?.*)?$/) && method === 'GET') {
      console.log('[Mock] 处理收藏查询列表请求');
      
      // 过滤出收藏的查询
      const favoriteQueries = mockQueries.filter(q => q.isFavorite);
      
      console.log(`[Mock] 返回${favoriteQueries.length}个收藏查询`);
      return { 
        success: true, 
        data: favoriteQueries
      };
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
      
      // 查找查询
      const query = mockQueries.find(q => q.id === queryId);
      if (!query) {
        console.warn(`[Mock] 未找到查询 ${queryId}，返回空执行计划`);
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
      
      console.log('[Mock] 返回模拟执行计划');
      return { success: true, data: mockPlan };
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
    
    // 获取单个查询 - 需要放在通用查询处理之前
    const singleQueryMatch = url.match(/\/api\/queries\/([^\/\?]+)$/);
    if (singleQueryMatch && method === 'GET') {
      const queryId = singleQueryMatch[1];
      console.log('[Mock] 获取单个查询:', queryId);
      const query = mockQueries.find(q => q.id === queryId);
      
      if (!query) {
        console.warn(`[Mock] 未找到ID为${queryId}的查询`);
        throw new Error(`未找到ID为${queryId}的查询`);
      }
      
      return { success: true, data: query };
    }
    
    // 处理查询列表 - 提取url参数并过滤
    if (url.match(/\/api\/queries(\?.*)?$/) && method === 'GET') {
      console.log('[Mock] 处理查询列表请求:', url);
      
      // 解析查询参数
      const searchParams = new URL('http://localhost' + url, 'http://localhost').searchParams;
      const page = parseInt(searchParams.get('page') || '1', 10);
      const size = parseInt(searchParams.get('size') || '10', 10);
      const status = searchParams.get('status');
      const dataSourceId = searchParams.get('dataSourceId');
      const searchTerm = searchParams.get('search');
      
      // 应用过滤
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
          q.name.toLowerCase().includes(keyword) || 
          q.description.toLowerCase().includes(keyword)
        );
      }
      
      // 应用分页
      const start = (page - 1) * size;
      const end = start + size;
      const paginatedQueries = filteredQueries.slice(start, Math.min(end, filteredQueries.length));
      
      console.log(`[Mock] 返回${paginatedQueries.length}个查询，总数：${filteredQueries.length}`);
      
      return { 
        success: true, 
        data: {
          items: paginatedQueries,
          total: filteredQueries.length,
          page: page,
          size: size,
          totalPages: Math.ceil(filteredQueries.length / size)
        }
      };
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