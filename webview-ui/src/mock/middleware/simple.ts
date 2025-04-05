import { Connect } from 'vite';
import * as http from 'http';

/**
 * 创建一个简单的测试中间件
 * 只处理/api/test路径，用于测试Mock系统是否正常工作
 */
export function createSimpleMiddleware() {
  console.log('[简单中间件] 已创建测试中间件，将处理/api/test路径的请求');
  
  return function simpleMiddleware(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    next: Connect.NextFunction
  ) {
    const url = req.url || '';
    const method = req.method || 'UNKNOWN';
    
    // 只处理/api/test路径
    if (url === '/api/test') {
      console.log(`[简单中间件] 收到测试请求: ${method} ${url}`);
      
      try {
        // 设置CORS头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        // 处理OPTIONS预检请求
        if (method === 'OPTIONS') {
          console.log('[简单中间件] 处理OPTIONS预检请求');
          res.statusCode = 204;
          res.end();
          return;
        }
        
        // 重要！确保覆盖掉所有已有的Content-Type，避免被后续中间件更改
        res.removeHeader('Content-Type');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.statusCode = 200;
        
        // 准备响应数据
        const responseData = {
          success: true,
          message: '简单测试中间件响应成功',
          data: {
            time: new Date().toISOString(),
            method: method,
            url: url,
            headers: req.headers,
            params: url.includes('?') ? url.split('?')[1] : null
          }
        };
        
        // 发送响应前确保中断请求链
        console.log('[简单中间件] 发送测试响应');
        res.end(JSON.stringify(responseData, null, 2));
        
        // 重要！不调用next()，确保请求到此结束
        return;
      } catch (error) {
        // 处理错误
        console.error('[简单中间件] 处理请求时出错:', error);
        
        // 重要！清除已有的头，避免Content-Type被更改
        res.removeHeader('Content-Type');
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({
          success: false,
          message: '处理请求时出错',
          error: error instanceof Error ? error.message : String(error)
        }));
        
        // 重要！不调用next()，确保请求到此结束
        return;
      }
    }
    
    // 不处理的请求交给下一个中间件
    next();
  };
} 