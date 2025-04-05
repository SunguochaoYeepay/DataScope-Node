/**
 * Mock中间件管理模块
 * 
 * 提供统一的HTTP请求拦截中间件，用于模拟API响应
 * 负责管理和分发所有API请求到对应的服务处理函数
 */

import type { Connect } from 'vite';
import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import { mockConfig, shouldMockRequest, logMock } from '../config';

// 导入服务
import { dataSourceService } from '../services';

// 模拟查询列表
const MOCK_QUERIES = [
  { id: 1, name: '查询1', sql: 'SELECT * FROM users', datasource_id: 1, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-02T10:30:00Z' },
  { id: 2, name: '查询2', sql: 'SELECT count(*) FROM orders', datasource_id: 2, created_at: '2023-01-03T00:00:00Z', updated_at: '2023-01-05T14:20:00Z' },
  { id: 3, name: '复杂查询', sql: 'SELECT u.id, u.name, COUNT(o.id) as order_count FROM users u JOIN orders o ON u.id = o.user_id GROUP BY u.id, u.name', datasource_id: 1, created_at: '2023-01-10T00:00:00Z', updated_at: '2023-01-12T09:15:00Z' }
];

// 处理CORS请求
function handleCors(res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Mock-Enabled');
  res.setHeader('Access-Control-Max-Age', '86400');
}

// 发送JSON响应
function sendJsonResponse(res: ServerResponse, status: number, data: any) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

// 延迟执行
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 解析请求体
async function parseRequestBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

// 处理数据源API
async function handleDatasourcesApi(req: IncomingMessage, res: ServerResponse, urlPath: string, urlQuery: any): Promise<boolean> {
  const method = req.method?.toUpperCase();
  
  // 获取数据源列表
  if (urlPath === '/api/datasources' && method === 'GET') {
    logMock('debug', `处理GET请求: /api/datasources`);
    
    try {
      // 使用服务层获取数据源列表，支持分页和过滤
      const result = await dataSourceService.getDataSources({
        page: parseInt(urlQuery.page as string) || 1,
        size: parseInt(urlQuery.size as string) || 10,
        name: urlQuery.name as string,
        type: urlQuery.type as string,
        status: urlQuery.status as string
      });
      
      sendJsonResponse(res, 200, { 
        data: result.items, 
        pagination: result.pagination,
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 500, { 
        error: '获取数据源列表失败',
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  
  // 获取单个数据源
  if (urlPath.match(/^\/api\/datasources\/[^\/]+$/) && method === 'GET') {
    const id = urlPath.split('/').pop() || '';
    
    logMock('debug', `处理GET请求: ${urlPath}, ID: ${id}`);
    
    try {
      const datasource = await dataSourceService.getDataSource(id);
      sendJsonResponse(res, 200, { 
        data: datasource,
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 404, { 
        error: '数据源不存在',
        message: error instanceof Error ? error.message : String(error),
        success: false 
      });
    }
    return true;
  }
  
  // 创建数据源
  if (urlPath === '/api/datasources' && method === 'POST') {
    logMock('debug', `处理POST请求: /api/datasources`);
    
    try {
      const body = await parseRequestBody(req);
      const newDataSource = await dataSourceService.createDataSource(body);
      
      sendJsonResponse(res, 201, {
        data: newDataSource,
        message: '数据源创建成功',
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 400, {
        error: '创建数据源失败',
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  
  // 更新数据源
  if (urlPath.match(/^\/api\/datasources\/[^\/]+$/) && method === 'PUT') {
    const id = urlPath.split('/').pop() || '';
    
    logMock('debug', `处理PUT请求: ${urlPath}, ID: ${id}`);
    
    try {
      const body = await parseRequestBody(req);
      const updatedDataSource = await dataSourceService.updateDataSource(id, body);
      
      sendJsonResponse(res, 200, {
        data: updatedDataSource,
        message: '数据源更新成功',
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 404, {
        error: '更新数据源失败',
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  
  // 删除数据源
  if (urlPath.match(/^\/api\/datasources\/[^\/]+$/) && method === 'DELETE') {
    const id = urlPath.split('/').pop() || '';
    
    logMock('debug', `处理DELETE请求: ${urlPath}, ID: ${id}`);
    
    try {
      await dataSourceService.deleteDataSource(id);
      
      sendJsonResponse(res, 200, {
        message: '数据源删除成功',
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 404, {
        error: '删除数据源失败',
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  
  // 测试数据源连接
  if (urlPath === '/api/datasources/test-connection' && method === 'POST') {
    logMock('debug', `处理POST请求: /api/datasources/test-connection`);
    
    try {
      const body = await parseRequestBody(req);
      const result = await dataSourceService.testConnection(body);
      
      sendJsonResponse(res, 200, {
        data: result,
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 400, {
        error: '测试连接失败',
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  
  return false;
}

// 处理查询API
function handleQueriesApi(req: IncomingMessage, res: ServerResponse, urlPath: string): boolean {
  const method = req.method?.toUpperCase();
  
  if (urlPath === '/api/queries' && method === 'GET') {
    logMock('debug', `处理GET请求: /api/queries`);
    sendJsonResponse(res, 200, { 
      data: MOCK_QUERIES, 
      total: MOCK_QUERIES.length,
      success: true
    });
    return true;
  }
  
  if (urlPath.match(/^\/api\/queries\/\d+$/) && method === 'GET') {
    const id = parseInt(urlPath.split('/').pop() || '0');
    const query = MOCK_QUERIES.find(q => q.id === id);
    
    logMock('debug', `处理GET请求: ${urlPath}, ID: ${id}`);
    
    if (query) {
      sendJsonResponse(res, 200, { 
        data: query,
        success: true
      });
    } else {
      sendJsonResponse(res, 404, { 
        error: '查询不存在',
        success: false
      });
    }
    return true;
  }
  
  if (urlPath.match(/^\/api\/queries\/\d+\/run$/) && method === 'POST') {
    const id = parseInt(urlPath.split('/')[3] || '0');
    const query = MOCK_QUERIES.find(q => q.id === id);
    
    logMock('debug', `处理POST请求: ${urlPath}, ID: ${id}`);
    
    if (query) {
      // 模拟查询执行结果
      sendJsonResponse(res, 200, {
        data: [
          { id: 1, name: 'John Doe', email: 'john@example.com' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
          { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
        ],
        columns: ['id', 'name', 'email'],
        rows: 3,
        execution_time: 0.123,
        success: true
      });
    } else {
      sendJsonResponse(res, 404, { 
        error: '查询不存在',
        success: false
      });
    }
    return true;
  }
  
  return false;
}

// 创建中间件
export default function createMockMiddleware(): Connect.NextHandleFunction {
  // 如果Mock服务被禁用，返回空中间件
  if (!mockConfig.enabled) {
    console.log('[Mock] 服务已禁用，返回空中间件');
    return (req, res, next) => next();
  }
  
  console.log('[Mock] 创建中间件, 拦截API请求');
  
  return async function mockMiddleware(
    req: Connect.IncomingMessage,
    res: ServerResponse,
    next: Connect.NextFunction
  ) {
    try {
      // 解析URL
      const url = req.url || '';
      const parsedUrl = parse(url, true);
      const urlPath = parsedUrl.pathname || '';
      const urlQuery = parsedUrl.query || {};
      
      // 检查是否应该处理此请求
      if (!shouldMockRequest(url)) {
        return next();
      }
      
      logMock('debug', `收到请求: ${req.method} ${urlPath}`);
      
      // 处理CORS预检请求
      if (req.method === 'OPTIONS') {
        handleCors(res);
        res.statusCode = 204;
        res.end();
        return;
      }
      
      // 添加CORS头
      handleCors(res);
      
      // 模拟网络延迟
      if (mockConfig.delay > 0) {
        await delay(mockConfig.delay);
      }
      
      // 处理不同的API端点
      let handled = false;
      
      // 按顺序尝试不同的API处理器
      if (!handled) handled = await handleDatasourcesApi(req, res, urlPath, urlQuery);
      if (!handled) handled = handleQueriesApi(req, res, urlPath);
      
      // 如果没有处理，返回404
      if (!handled) {
        logMock('info', `未实现的API路径: ${req.method} ${urlPath}`);
        sendJsonResponse(res, 404, { 
          error: '未找到API端点',
          message: `API端点 ${urlPath} 未找到或未实现`,
          success: false
        });
      }
    } catch (error) {
      logMock('error', `处理请求出错:`, error);
      sendJsonResponse(res, 500, { 
        error: '服务器内部错误',
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
  };
} 