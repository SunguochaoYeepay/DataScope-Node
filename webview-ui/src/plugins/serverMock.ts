import { mockQueries, mockDataSources } from './mockData';
import { Connect } from 'vite';

/**
 * 创建一个Vite服务器中间件，用于处理API请求
 * 主要针对curl等外部工具发送的请求，返回JSON而不是HTML
 */
export function createMockServerMiddleware(): Connect.NextHandleFunction {
  console.log('[Server] 创建Mock服务器中间件');
  
  return async (req, res, next) => {
    // 只处理API请求
    if (req.url?.includes('/api/')) {
      console.log('[Server Mock] 拦截API请求:', req.url, req.method);
      
      // 确保req.method存在，默认为GET
      const method = req.method || 'GET';
      
      try {
        // 获取单个查询: GET /api/queries/{id}
        const singleQueryMatch = req.url.match(/\/api\/queries\/([^\/\?]+)$/);
        if (singleQueryMatch && method === 'GET') {
          const queryId = singleQueryMatch[1];
          console.log('[Server Mock] 获取单个查询:', queryId);
          
          // 查找查询
          const query = mockQueries.find(q => q.id === queryId);
          
          if (!query) {
            console.warn(`[Server Mock] 未找到ID为${queryId}的查询，返回错误响应`);
            // 返回404错误
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
              success: false, 
              message: `未找到ID为${queryId}的查询`,
              error: {
                code: 'NOT_FOUND',
                message: `未找到ID为${queryId}的查询`
              }
            }));
            return;
          }
          
          console.log('[Server Mock] 返回查询详情:', query.id, query.name);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, data: query }));
          return;
        }
        
        // 获取查询列表: GET /api/queries
        if (req.url.match(/\/api\/queries(\?.*)?$/) && method === 'GET') {
          console.log('[Server Mock] 获取查询列表');
          
          // 解析查询参数
          const urlObj = new URL(`http://localhost${req.url}`);
          const page = parseInt(urlObj.searchParams.get('page') || '1', 10);
          const size = parseInt(urlObj.searchParams.get('size') || '10', 10);
          
          // 应用分页
          const start = (page - 1) * size;
          const end = start + size;
          const paginatedQueries = mockQueries.slice(start, Math.min(end, mockQueries.length));
          
          console.log(`[Server Mock] 返回${paginatedQueries.length}个查询`);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ 
            success: true, 
            data: {
              items: paginatedQueries,
              total: mockQueries.length,
              page: page,
              size: size,
              totalPages: Math.ceil(mockQueries.length / size)
            }
          }));
          return;
        }
        
        // 获取数据源列表: GET /api/datasources
        if (req.url.match(/\/api\/datasources(\?.*)?$/) && method === 'GET') {
          console.log('[Server Mock] 获取数据源列表');
          
          // 解析查询参数
          const urlObj = new URL(`http://localhost${req.url}`);
          const page = parseInt(urlObj.searchParams.get('page') || '1', 10);
          const size = parseInt(urlObj.searchParams.get('size') || '10', 10);
          
          // 应用分页
          const start = (page - 1) * size;
          const end = start + size;
          const paginatedSources = mockDataSources.slice(start, Math.min(end, mockDataSources.length));
          
          console.log(`[Server Mock] 返回${paginatedSources.length}个数据源`);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ 
            success: true, 
            data: {
              items: paginatedSources,
              pagination: {
                total: mockDataSources.length,
                totalPages: Math.ceil(mockDataSources.length / size),
                page,
                size
              }
            }
          }));
          return;
        }
        
        // 执行查询: POST /api/queries/{id}/execute
        const executeQueryMatch = req.url.match(/\/api\/queries\/([^\/\?]+)\/execute/);
        if (executeQueryMatch && method === 'POST') {
          const queryId = executeQueryMatch[1];
          console.log('[Server Mock] 执行查询:', queryId);
          
          // 返回模拟查询结果
          const mockResult = {
            id: `result-${Date.now()}`,
            queryId: queryId,
            status: 'COMPLETED',
            executionTime: 253,
            createdAt: new Date().toISOString(),
            rowCount: 20,
            columns: ['id', 'name', 'email', 'age', 'status', 'created_at'],
            fields: [
              { name: 'id', type: 'integer', displayName: 'ID' },
              { name: 'name', type: 'string', displayName: '名称' },
              { name: 'email', type: 'string', displayName: '邮箱' },
              { name: 'age', type: 'integer', displayName: '年龄' },
              { name: 'status', type: 'string', displayName: '状态' },
              { name: 'created_at', type: 'timestamp', displayName: '创建时间' }
            ],
            rows: Array.from({ length: 20 }, (_, i) => ({
              id: i + 1,
              name: `测试用户 ${i + 1}`,
              email: `user${i + 1}@example.com`,
              age: Math.floor(Math.random() * 50) + 18,
              status: i % 3 === 0 ? 'active' : (i % 3 === 1 ? 'pending' : 'inactive'),
              created_at: new Date(Date.now() - i * 86400000).toISOString()
            }))
          };
          
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, data: mockResult }));
          return;
        }
        
        // 其他API请求返回通用成功响应
        console.log(`[Server Mock] 通用处理: ${req.url}`);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ 
          success: true, 
          data: { message: `API请求处理成功: ${req.url}` }
        }));
        
      } catch (error) {
        // 处理任何可能发生的错误
        console.error('[Server Mock] 处理API请求时出错:', error);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ 
          success: false, 
          message: `API请求处理失败: ${error instanceof Error ? error.message : String(error)}`,
          error: {
            code: 'INTERNAL_ERROR',
            message: '处理API请求时发生内部错误'
          }
        }));
      }
      return;
    }
    
    // 不是API请求，交给下一个中间件处理
    next();
  };
}