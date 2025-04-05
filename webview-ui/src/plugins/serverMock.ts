/**
 * 备份文件 - 此Mock服务已被禁用，使用src/mock替代
 * 
 * 此文件保留作为参考，但为避免与主Mock服务冲突，已完全禁用
 */

import { mockQueries, mockDataSources } from './mockData';
import { Connect } from 'vite';

/**
 * 创建一个Vite服务器中间件，用于处理API请求
 * 主要针对curl等外部工具发送的请求，返回JSON而不是HTML
 * 
 * 注意：此中间件已被禁用，返回一个空中间件不处理任何请求
 */
export function createMockServerMiddleware(): Connect.NextHandleFunction {
  console.log('[ServerMock] 此Mock服务已废弃，使用src/mock替代');
  
  // 直接返回一个空中间件，不处理任何请求
  return (req, res, next) => {
    next();
  };
}

// 导出备份数据，以便在需要时可以查看
export { mockQueries, mockDataSources };

/*
 * 原始实现已被注释掉，避免与主Mock服务冲突
 *
export function createMockServerMiddleware(): Connect.NextHandleFunction {
  console.log('[Server] 创建Mock服务器中间件');
  
  // 强制禁用Mock API
  const useMockApi = false;
  
  console.log('[Server] Mock API状态:', useMockApi ? '启用' : '禁用');
  
  // 如果未启用，则不处理任何请求
  if (!useMockApi) {
    console.log('[Server] Mock服务器已禁用，所有请求将直接传递到后端');
    return (req, res, next) => {
      next();
    };
  }
  
  // 打印mockDataSources内容，以便调试
  console.log('[Server] mockDataSources长度:', mockDataSources ? mockDataSources.length : 'undefined');
  if (mockDataSources && mockDataSources.length > 0) {
    console.log('[Server] 第一个数据源示例:', JSON.stringify(mockDataSources[0], null, 2));
  }
  
  return async (req, res, next) => {
    // 如果请求URL包含/api/但不是API请求，直接传递
    if (!useMockApi || !req.url?.includes('/api/')) {
      return next();
    }
    
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
          
          // 简化响应，不进行任何复杂逻辑
          const mockItems = [
            {
              id: 'ds-test-1',
              name: '测试数据源 1',
              description: '简化版测试数据源',
              type: 'mysql',
              host: 'localhost',
              port: 3306,
              database: 'test_db',
              username: 'user',
              status: 'active',
              syncFrequency: 'manual',
              lastSyncTime: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              isActive: true
            }
          ];
          
          console.log('[Server Mock] 返回简化数据源列表');
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ 
            success: true, 
            data: {
              items: mockItems,
              pagination: {
                total: mockItems.length,
                totalPages: 1,
                page: 1,
                size: 10
              }
            }
          }));
          return;
        }
        
        // 添加数据源状态检查端点: GET /api/datasources/{id}/check-status
        const checkStatusMatch = req.url.match(/\/api\/datasources\/([^\/\?]+)\/check-status/);
        if (checkStatusMatch && method === 'GET') {
          const dataSourceId = checkStatusMatch[1];
          console.log('[Server Mock] 检查数据源状态:', dataSourceId);
          
          // 查找数据源
          const dataSource = mockDataSources.find(ds => ds.id === dataSourceId);
          
          if (!dataSource) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
              success: false, 
              error: {
                statusCode: 404,
                message: `未找到ID为${dataSourceId}的数据源`,
                code: 'NOT_FOUND',
                details: null
              }
            }));
            return;
          }
          
          // 返回状态检查结果
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ 
            success: true, 
            data: {
              id: dataSource.id,
              status: dataSource.status,
              isActive: dataSource.isActive,
              lastCheckedAt: new Date().toISOString(),
              message: dataSource.status === 'error' ? '连接失败' : '连接正常',
              details: {
                responseTime: Math.floor(Math.random() * 100) + 10,
                activeConnections: Math.floor(Math.random() * 5) + 1,
                connectionPoolSize: 10
              }
            }
          }));
          return;
        }
        
        // 添加元数据同步端点: POST /api/metadata/datasources/{dataSourceId}/sync
        const metadataSyncMatch = req.url.match(/\/api\/metadata\/datasources\/([^\/\?]+)\/sync/);
        if (metadataSyncMatch && method === 'POST') {
          const dataSourceId = metadataSyncMatch[1];
          console.log('[Server Mock] 同步数据源元数据:', dataSourceId);
          
          // 查找数据源
          const dataSource = mockDataSources.find(ds => ds.id === dataSourceId);
          
          if (!dataSource) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
              success: false, 
              error: {
                statusCode: 404,
                message: `未找到ID为${dataSourceId}的数据源`,
                code: 'NOT_FOUND',
                details: null
              }
            }));
            return;
          }
          
          // 获取请求数据
          let requestBody = '';
          req.on('data', (chunk) => {
            requestBody += chunk.toString();
          });
          
          req.on('end', () => {
            let filters = {};
            try {
              if (requestBody) {
                const data = JSON.parse(requestBody);
                filters = data.filters || {};
                console.log('[Server Mock] 同步元数据过滤器:', filters);
              }
            } catch (e) {
              console.error('[Server Mock] 解析同步参数失败:', e);
            }
            
            // 返回同步结果
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
              success: true, 
              data: {
                success: true,
                syncId: `sync-${Date.now()}`,
                dataSourceId: dataSource.id,
                startTime: new Date().toISOString(),
                endTime: new Date(Date.now() + 5000).toISOString(),
                tablesCount: Math.floor(Math.random() * 20) + 5,
                viewsCount: Math.floor(Math.random() * 10) + 1,
                syncDuration: Math.floor(Math.random() * 5000) + 1000,
                status: 'completed',
                message: '同步完成',
                errors: []
              }
            }));
          });
          return;
        }
        
        // 添加数据源统计信息端点: GET /api/datasources/{id}/stats
        const statsMatch = req.url.match(/\/api\/datasources\/([^\/\?]+)\/stats/);
        if (statsMatch && method === 'GET') {
          const dataSourceId = statsMatch[1];
          console.log('[Server Mock] 获取数据源统计信息:', dataSourceId);
          
          // 查找数据源
          const dataSource = mockDataSources.find(ds => ds.id === dataSourceId);
          
          if (!dataSource) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
              success: false, 
              error: {
                statusCode: 404,
                message: `未找到ID为${dataSourceId}的数据源`,
                code: 'NOT_FOUND',
                details: null
              }
            }));
            return;
          }
          
          // 返回统计信息
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ 
            success: true, 
            data: {
              dataSourceId: dataSource.id,
              tablesCount: Math.floor(Math.random() * 50) + 5,
              viewsCount: Math.floor(Math.random() * 10) + 1,
              totalRows: Math.floor(Math.random() * 1000000) + 1000,
              totalSize: `${(Math.random() * 100 + 10).toFixed(2)} MB`,
              lastUpdate: new Date().toISOString(),
              queriesCount: Math.floor(Math.random() * 500) + 10,
              connectionPoolSize: Math.floor(Math.random() * 10) + 5,
              activeConnections: Math.floor(Math.random() * 5) + 1,
              avgQueryTime: `${(Math.random() * 100 + 10).toFixed(2)}ms`,
              totalTables: Math.floor(Math.random() * 50) + 5,
              totalViews: Math.floor(Math.random() * 10) + 1,
              totalQueries: Math.floor(Math.random() * 500) + 10,
              avgResponseTime: Math.floor(Math.random() * 100) + 10,
              peakConnections: Math.floor(Math.random() * 20) + 5
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
        console.error('[Server Mock] 错误堆栈:', error instanceof Error ? error.stack : 'No stack trace');
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ 
          success: false, 
          error: {
            statusCode: 500,
            code: 'INTERNAL_ERROR',
            message: `处理API请求时发生内部错误: ${error instanceof Error ? error.message : String(error)}`,
            details: error instanceof Error ? error.stack : undefined
          }
        }));
      }
      return;
    }
    
    // 不是API请求，交给下一个中间件处理
    next();
  };
}
*/