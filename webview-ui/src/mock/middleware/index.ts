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

// 模拟数据源列表
const MOCK_DATASOURCES = [
  { id: 1, name: '数据源1', type: 'mysql', host: 'localhost', port: 3306, username: 'root', database: 'test_db1', status: 'active' },
  { id: 2, name: '数据源2', type: 'postgres', host: 'db.example.com', port: 5432, username: 'admin', database: 'test_db2', status: 'active' },
  { id: 3, name: '数据源3', type: 'mongodb', host: '192.168.1.100', port: 27017, username: 'mongodb', database: 'test_db3', status: 'inactive' }
];

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

// 处理数据源API
function handleDatasourcesApi(req: IncomingMessage, res: ServerResponse, urlPath: string): boolean {
  const method = req.method?.toUpperCase();
  
  if (urlPath === '/api/datasources' && method === 'GET') {
    logMock('debug', `处理GET请求: /api/datasources`);
    sendJsonResponse(res, 200, { 
      data: MOCK_DATASOURCES, 
      total: MOCK_DATASOURCES.length,
      success: true
    });
    return true;
  }
  
  if (urlPath.match(/^\/api\/datasources\/\d+$/) && method === 'GET') {
    const id = parseInt(urlPath.split('/').pop() || '0');
    const datasource = MOCK_DATASOURCES.find(d => d.id === id);
    
    logMock('debug', `处理GET请求: ${urlPath}, ID: ${id}`);
    
    if (datasource) {
      sendJsonResponse(res, 200, { 
        data: datasource,
        success: true
      });
    } else {
      sendJsonResponse(res, 404, { 
        error: '数据源不存在',
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
      if (!handled) handled = handleDatasourcesApi(req, res, urlPath);
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