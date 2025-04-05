/**
 * Vite服务器Mock中间件
 * 
 * 提供Vite服务器中间件，用于拦截API请求并返回Mock数据
 */

import { Connect } from 'vite';
import { isMockEnabled, mockConfig } from './config';
import mockServices from './services';

/**
 * 创建Vite服务器中间件，处理API请求
 * @returns Vite中间件函数
 */
export function createMockMiddleware(): Connect.NextHandleFunction {
  console.log('[Mock] 创建Vite服务器中间件');
  
  // 检查Mock是否启用
  const enabled = isMockEnabled();
  console.log(`[Mock] Vite中间件状态: ${enabled ? '已启用' : '已禁用'}`);
  
  // 如果Mock未启用，则直接跳过
  if (!enabled) {
    console.log('[Mock] 中间件已禁用，所有请求将直接传递到后端');
    return (req, res, next) => {
      next();
    };
  }
  
  return async (req, res, next) => {
    // 仅处理API请求
    if (!req.url?.includes('/api/')) {
      return next();
    }
    
    console.log(`[Mock] 拦截服务器请求: ${req.url} ${req.method}`);
    
    // 模拟处理延迟
    const delay = typeof mockConfig.delay === 'number' ? mockConfig.delay : 300;
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    try {
      // 处理数据源API
      if (req.url.includes('/api/datasources')) {
        // 获取单个数据源
        const singleMatch = req.url.match(/\/api\/datasources\/([^\/\?]+)$/);
        if (singleMatch && req.method === 'GET') {
          const id = singleMatch[1];
          console.log(`[Mock] 获取数据源: ${id}`);
          
          const response = mockServices.dataSource.getDataSource(id);
          
          // 返回模拟响应
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(response));
          return;
        }
        
        // 获取数据源列表
        if (req.url.match(/\/api\/datasources(\?.*)?$/) && req.method === 'GET') {
          console.log('[Mock] 获取数据源列表');
          
          // 解析查询参数
          const urlObj = new URL(`http://localhost${req.url}`);
          const page = parseInt(urlObj.searchParams.get('page') || '1', 10);
          const size = parseInt(urlObj.searchParams.get('size') || '10', 10);
          
          const response = mockServices.dataSource.getDataSources({ page, size });
          
          // 返回模拟响应
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(response));
          return;
        }
      }
      
      // 处理查询API
      if (req.url.includes('/api/queries')) {
        // 获取单个查询
        const singleMatch = req.url.match(/\/api\/queries\/([^\/\?]+)$/);
        if (singleMatch && req.method === 'GET') {
          const id = singleMatch[1];
          console.log(`[Mock] 获取查询: ${id}`);
          
          const response = mockServices.query.getQuery(id);
          
          // 返回模拟响应
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(response));
          return;
        }
        
        // 获取查询列表
        if (req.url.match(/\/api\/queries(\?.*)?$/) && req.method === 'GET') {
          console.log('[Mock] 获取查询列表');
          
          // 解析查询参数
          const urlObj = new URL(`http://localhost${req.url}`);
          const page = parseInt(urlObj.searchParams.get('page') || '1', 10);
          const size = parseInt(urlObj.searchParams.get('size') || '10', 10);
          
          const response = mockServices.query.getQueries({ page, size });
          
          // 返回模拟响应
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(response));
          return;
        }
      }
      
      // 处理集成API (low-code APIs)
      if (req.url.includes('/api/low-code/apis')) {
        console.log('[Mock] 处理集成API请求:', req.url);
        
        // 获取单个集成
        const singleMatch = req.url.match(/\/api\/low-code\/apis\/([^\/\?]+)$/);
        if (singleMatch && req.method === 'GET') {
          const id = singleMatch[1];
          console.log(`[Mock] 获取集成详情: ${id}`);
          
          try {
            const response = await mockServices.integration.getIntegration(id);
            
            // 返回模拟响应
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(response));
          } catch (error) {
            // 处理未找到的情况
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: false,
              error: {
                code: 'NOT_FOUND',
                message: `未找到ID为${id}的集成`
              }
            }));
          }
          return;
        }
        
        // 获取集成列表
        if (req.url.match(/\/api\/low-code\/apis(\?.*)?$/) && req.method === 'GET') {
          console.log('[Mock] 获取集成列表');
          
          // 解析查询参数
          const urlObj = new URL(`http://localhost${req.url}`);
          const params = {
            page: parseInt(urlObj.searchParams.get('page') || '1', 10),
            size: parseInt(urlObj.searchParams.get('size') || '10', 10),
            type: urlObj.searchParams.get('type') || '',
            status: urlObj.searchParams.get('status') || ''
          };
          
          try {
            const response = await mockServices.integration.getIntegrations(params);
            
            // 返回模拟响应
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(response));
          } catch (error) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: false,
              error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : String(error)
              }
            }));
          }
          return;
        }
      }
      
      // 对于其他API请求，返回通用响应
      console.log(`[Mock] 通用处理: ${req.url}`);
      
      // 返回成功响应
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        success: true,
        data: {
          message: `模拟响应: ${req.method} ${req.url}`,
          timestamp: new Date().toISOString()
        }
      }));
      
    } catch (error) {
      // 处理错误
      console.error('[Mock] 处理请求出错:', error);
      
      // 返回错误响应
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        success: false,
        error: {
          statusCode: 500,
          code: 'MOCK_ERROR',
          message: error instanceof Error ? error.message : String(error),
          details: error instanceof Error ? error.stack : undefined
        }
      }));
    }
  };
}

// 导出中间件创建函数
export default createMockMiddleware; 