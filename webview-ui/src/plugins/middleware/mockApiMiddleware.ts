import { handleMockRequest } from '../fetch-interceptor';
import { Connect } from 'vite';

/**
 * Vite中间件，拦截服务器端API请求，返回模拟数据
 * 用于处理直接发送到服务器的请求，如来自curl的请求
 */
export function createMockApiMiddleware(): Connect.NextHandleFunction {
  console.log('[Server] 创建Mock API中间件');
  
  return async (req, res, next) => {
    // 只处理API请求
    if (req.url?.includes('/api/')) {
      console.log('[Server Mock] 拦截API请求:', req.url, req.method);
      
      // 提取请求体
      const chunks: Buffer[] = [];
      req.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });
      
      // 完成请求体读取后处理请求
      req.on('end', async () => {
        try {
          // 解析请求体
          let requestBody = {};
          if (chunks.length > 0) {
            const bodyStr = Buffer.concat(chunks).toString();
            if (bodyStr && bodyStr.trim() !== '') {
              try {
                requestBody = JSON.parse(bodyStr);
              } catch (e) {
                console.warn('[Server Mock] 解析请求体失败:', e);
              }
            }
          }
          
          // 创建请求上下文
          const init = {
            method: req.method,
            headers: req.headers as HeadersInit,
            body: Object.keys(requestBody).length > 0 ? JSON.stringify(requestBody) : undefined
          };
          
          // 处理请求
          const response = await handleMockRequest(req.url!, init);
          
          // 返回模拟数据
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify(response));
        } catch (error) {
          console.error('[Server Mock] 处理请求失败:', error);
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 500;
          res.end(JSON.stringify({
            success: false,
            message: error instanceof Error ? error.message : String(error)
          }));
        }
      });
    } else {
      next();
    }
  };
}