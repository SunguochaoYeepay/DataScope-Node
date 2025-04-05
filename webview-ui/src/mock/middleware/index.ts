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
import { dataSourceService, queryService } from '../services';
import integrationService from '../services/integration';

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

/**
 * 检查并修正请求路径，处理可能存在的重复/api前缀
 * @param url 原始请求URL
 * @returns 修正后的URL
 */
const normalizeApiPath = (url: string): string => {
  // 记录所有请求路径，方便调试
  console.log(`[Mock中间件] 处理请求路径: ${url}`);
  
  // 移除URL中可能存在的重复的/api前缀
  if (url.startsWith('/api/api/')) {
    const fixedUrl = url.replace('/api/api/', '/api/');
    console.log(`[Mock中间件] 修正重复的API路径: ${url} => ${fixedUrl}`);
    return fixedUrl;
  }
  
  // 查找其他可能的路径问题
  if (url.includes('//')) {
    console.warn(`[Mock中间件] 检测到URL中有连续斜杠: ${url}`);
  }
  
  return url;
};

// 处理数据源API
async function handleDatasourcesApi(req: IncomingMessage, res: ServerResponse, urlPath: string, urlQuery: any): Promise<boolean> {
  const method = req.method?.toUpperCase();
  
  // 获取数据源列表
  if (urlPath === '/api/datasources' && method === 'GET') {
    logMock('debug', `处理GET请求: /api/datasources`);
    
    // 处理查询参数，支持嵌套格式params[key]
    const params: any = {};
    for (const key in urlQuery) {
      if (key.startsWith('params[') && key.endsWith(']')) {
        const paramName = key.substring(7, key.length - 1);
        params[paramName] = urlQuery[key];
      } else {
        params[key] = urlQuery[key];
      }
    }
    
    console.log('[Mock中间件] 数据源请求参数:', JSON.stringify(params));
    
    try {
      // 使用服务层获取数据源列表，支持分页和过滤
      const result = await dataSourceService.getDataSources({
        page: parseInt(params.page as string) || 1,
        size: parseInt(params.size as string) || 10,
        name: params.name as string,
        type: params.type as string,
        status: params.status as string
      });
      
      console.log(`[Mock中间件] 数据源服务返回结果: 获取到${result.items.length}条数据源`);
      if (result.items.length > 0) {
        console.log('[Mock中间件] 第一条数据源:', JSON.stringify(result.items[0]).substring(0, 200));
      }
      
      const response = { 
        data: result.items, 
        pagination: result.pagination,
        success: true
      };
      
      console.log('[Mock中间件] 返回数据源列表响应:', 
        `${result.items.length}条数据, 总数:${result.pagination.total}, 分页:${result.pagination.page}/${result.pagination.totalPages}`);
      
      sendJsonResponse(res, 200, response);
    } catch (error) {
      console.error('[Mock中间件] 获取数据源列表失败:', error);
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
async function handleQueriesApi(req: IncomingMessage, res: ServerResponse, urlPath: string, urlQuery: any): Promise<boolean> {
  const method = req.method?.toUpperCase();
  
  // 检查URL是否匹配查询API
  const isQueriesPath = urlPath.includes('/queries');
  
  // 打印所有查询相关请求以便调试
  if (isQueriesPath) {
    console.log(`[Mock] 检测到查询API请求: ${method} ${urlPath}`, urlQuery);
  }
  
  // 处理查询参数，支持嵌套格式params[key]
  const params: any = {};
  for (const key in urlQuery) {
    if (key.startsWith('params[') && key.endsWith(']')) {
      const paramName = key.substring(7, key.length - 1);
      params[paramName] = urlQuery[key];
    } else {
      params[key] = urlQuery[key];
    }
  }
  
  try {
    // 获取查询列表
    if (urlPath === '/api/queries' && method === 'GET') {
      logMock('debug', `处理GET请求: /api/queries`);
      console.log('[Mock] 处理查询列表请求, 参数:', params);
      
      try {
        // 使用服务层获取查询列表，支持分页和过滤
        const result = await queryService.getQueries({
          page: parseInt(params.page as string) || 1,
          size: parseInt(params.size as string) || 10,
          name: params.name as string,
          type: params.type as string,
          dataSourceId: params.dataSourceId as string,
          queryType: params.queryType as string,
          serviceStatus: params.serviceStatus as string
        });
        
        // 确保返回的数据具有正确的结构
        const response = {
          data: Array.isArray(result.data) ? result.data : [],
          pagination: result.pagination || {
            total: 0,
            page: parseInt(params.page as string) || 1,
            size: parseInt(params.size as string) || 10,
            totalPages: 0
          },
          success: true
        };
        
        console.log('[Mock] 查询列表结果:', {
          itemsCount: response.data.length,
          pagination: response.pagination
        });
        
        console.log('[Mock] 返回查询列表数据格式:', {
          data: Array.isArray(response.data) ? `Array[${response.data.length}]` : typeof response.data,
          pagination: response.pagination,
          success: response.success
        });
        
        sendJsonResponse(res, 200, response);
      } catch (error) {
        console.error('[Mock] 获取查询列表失败:', error);
        
        // 发生错误时返回空结果，避免前端报错
        sendJsonResponse(res, 200, { 
          data: [],
          pagination: {
            total: 0,
            page: parseInt(params.page as string) || 1,
            size: parseInt(params.size as string) || 10,
            totalPages: 0
          },
          success: true
        });
      }
      return true;
    }
  } catch (error) {
    console.error('[Mock] 处理查询API请求出错:', error);
    sendJsonResponse(res, 500, {
      error: '处理查询请求失败',
      message: error instanceof Error ? error.message : String(error),
      success: false
    });
    return true;
  }
  
  return false;
}

// 处理集成API
async function handleIntegrationApi(req: IncomingMessage, res: ServerResponse, urlPath: string, urlQuery: any): Promise<boolean> {
  const method = req.method?.toUpperCase();
  
  // 检查集成API路径
  const isLowCodeApisPath = urlPath.includes('/api/low-code/apis');
  
  if (isLowCodeApisPath) {
    console.log('[Mock] 检测到集成API请求:', method, urlPath, urlQuery);
    
    // 获取集成列表
    if (urlPath === '/api/low-code/apis' && method === 'GET') {
      logMock('debug', `处理GET请求: /api/low-code/apis`);
      
      try {
        // 使用服务层获取集成列表
        const result = await integrationService.getIntegrations({
          page: parseInt(urlQuery.page as string) || 1,
          size: parseInt(urlQuery.size as string) || 10,
          name: urlQuery.name as string,
          type: urlQuery.type as string,
          status: urlQuery.status as string
        });
        
        // 打印获取到的结果
        console.log('[Mock中间件] 获取到集成列表数据:', Array.isArray(result) ? `数组(${result.length}条)` : typeof result);
        if (Array.isArray(result) && result.length > 0) {
          console.log('[Mock中间件] 第一条数据样例:', JSON.stringify(result[0]).substring(0, 200) + '...');
        }
        
        // 直接返回数组形式的响应
        const responseData = result;
        
        console.log('[Mock中间件] 返回集成列表响应:', 
          Array.isArray(responseData) ? `数组(${responseData.length}条)` : typeof responseData,
          '内容示例:', Array.isArray(responseData) && responseData.length > 0 ? 
          JSON.stringify(responseData[0]).substring(0, 100) : '空数据');
        
        // 设置明确的响应头
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        
        // 转为JSON字符串并发送
        const jsonStr = JSON.stringify(responseData);
        console.log('[Mock中间件] 发送JSON响应:', jsonStr.substring(0, 200) + (jsonStr.length > 200 ? '...' : ''));
        res.end(jsonStr);
      } catch (error) {
        console.error('[Mock中间件] 获取集成列表失败:', error);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ 
          error: '获取集成列表失败',
          message: error instanceof Error ? error.message : String(error),
          success: false
        }));
      }
      return true;
    }
    
    // 获取单个集成
    const singleIntegrationMatch = urlPath.match(/^\/api\/low-code\/apis\/([^\/]+)$/);
    if (singleIntegrationMatch && method === 'GET') {
      const id = singleIntegrationMatch[1];
      
      logMock('debug', `处理GET请求: ${urlPath}, ID: ${id}`);
      
      try {
        const integration = await integrationService.getIntegration(id);
        
        // 直接返回集成对象，不包装在data中
        sendJsonResponse(res, 200, integration);
      } catch (error) {
        sendJsonResponse(res, 404, { 
          error: '集成不存在',
          message: error instanceof Error ? error.message : String(error),
          success: false 
        });
      }
      return true;
    }
    
    // 创建集成
    if (urlPath === '/api/low-code/apis' && method === 'POST') {
      logMock('debug', `处理POST请求: /api/low-code/apis`);
      
      try {
        const body = await parseRequestBody(req);
        const newIntegration = await integrationService.createIntegration(body);
        
        sendJsonResponse(res, 201, newIntegration);
      } catch (error) {
        sendJsonResponse(res, 400, {
          error: '创建集成失败',
          message: error instanceof Error ? error.message : String(error),
          success: false
        });
      }
      return true;
    }
    
    // 更新集成
    const updateIntegrationMatch = urlPath.match(/^\/api\/low-code\/apis\/([^\/]+)$/);
    if (updateIntegrationMatch && method === 'PUT') {
      const id = updateIntegrationMatch[1];
      
      logMock('debug', `处理PUT请求: ${urlPath}, ID: ${id}`);
      
      try {
        const body = await parseRequestBody(req);
        const updatedIntegration = await integrationService.updateIntegration(id, body);
        
        sendJsonResponse(res, 200, updatedIntegration);
      } catch (error) {
        sendJsonResponse(res, 404, {
          error: '更新集成失败',
          message: error instanceof Error ? error.message : String(error),
          success: false
        });
      }
      return true;
    }
    
    // 删除集成
    const deleteIntegrationMatch = urlPath.match(/^\/api\/low-code\/apis\/([^\/]+)$/);
    if (deleteIntegrationMatch && method === 'DELETE') {
      const id = deleteIntegrationMatch[1];
      
      logMock('debug', `处理DELETE请求: ${urlPath}, ID: ${id}`);
      
      try {
        await integrationService.deleteIntegration(id);
        
        sendJsonResponse(res, 200, {
          message: '集成删除成功',
          success: true
        });
      } catch (error) {
        sendJsonResponse(res, 404, {
          error: '删除集成失败',
          message: error instanceof Error ? error.message : String(error),
          success: false
        });
      }
      return true;
    }
    
    // 测试集成连接
    const testIntegrationMatch = urlPath.match(/^\/api\/low-code\/apis\/([^\/]+)\/test$/);
    if (testIntegrationMatch && method === 'POST') {
      const id = testIntegrationMatch[1];
      
      logMock('debug', `处理POST请求: ${urlPath}, ID: ${id}`);
      
      try {
        const body = await parseRequestBody(req);
        const result = await integrationService.testIntegration(id, body);
        
        sendJsonResponse(res, 200, result);
      } catch (error) {
        sendJsonResponse(res, 400, {
          error: '测试集成失败',
          message: error instanceof Error ? error.message : String(error),
          success: false
        });
      }
      return true;
    }
    
    // 执行集成查询
    const executeQueryMatch = urlPath.match(/^\/api\/low-code\/apis\/([^\/]+)\/execute$/);
    if (executeQueryMatch && method === 'POST') {
      const id = executeQueryMatch[1];
      
      logMock('debug', `处理POST请求: ${urlPath}, ID: ${id}`);
      
      try {
        const body = await parseRequestBody(req);
        const result = await integrationService.executeQuery(id, body);
        
        sendJsonResponse(res, 200, result);
      } catch (error) {
        sendJsonResponse(res, 400, {
          error: '执行集成查询失败',
          message: error instanceof Error ? error.message : String(error),
          success: false
        });
      }
      return true;
    }
  }
  
  return false;
}

/**
 * 处理请求
 * @param req 请求对象
 * @param res 响应对象
 * @param urlPath URL路径
 * @param urlQuery URL查询参数对象或查询字符串
 */
export async function handleRequest(req: any, res: any, urlPath: string, urlQuery: any) {
  try {
    // 使用normalizeApiPath修正路径
    const normalizedPath = normalizeApiPath(urlPath);
    
    // 如果路径不同，表示已修正重复的/api
    if (urlPath !== normalizedPath) {
      console.log(`[Mock中间件] 修正API路径: ${urlPath} => ${normalizedPath}`);
    }

    // 基于修正后的路径处理请求
    let handled = false;
    
    // 检查是否是集成API - 优先处理以避免冲突
    if (normalizedPath.includes('/low-code/apis')) {
      console.log('[Mock] 检测到集成API请求:', req.method, normalizedPath, urlQuery);
      handled = await handleIntegrationApi(req, res, normalizedPath, urlQuery);
      if (handled) return;
    }
    
    // 检查是否是数据源API
    if (normalizedPath.includes('/datasources')) {
      handled = await handleDatasourcesApi(req, res, normalizedPath, urlQuery);
      if (handled) return;
    }
    
    // 检查是否是查询API
    if (normalizedPath.includes('/queries')) {
      handled = await handleQueriesApi(req, res, normalizedPath, urlQuery);
      if (handled) return;
    }
    
    // 如果没有被处理，则返回404
    if (!handled) {
      sendJsonResponse(res, 404, {
        error: '未找到请求的API',
        message: `未找到路径: ${normalizedPath}`,
        success: false
      });
    }
  } catch (error) {
    console.error('[Mock] 处理请求时出错:', error);
    sendJsonResponse(res, 500, {
      error: '处理请求时出错',
      message: error instanceof Error ? error.message : String(error),
      success: false
    });
  }
}

/**
 * 创建Mock中间件
 * @returns Vite中间件函数
 */
export function createMockMiddleware(): Connect.NextHandleFunction {
  return async function mockMiddleware(req: Connect.IncomingMessage, res: ServerResponse, next: Connect.NextFunction) {
    // 如果未启用Mock或请求不适合Mock，直接传递给下一个中间件
    if (!shouldMockRequest(req)) {
      return next();
    }
    
    const url = parse(req.url || '', true);
    const urlPath = url.pathname || '';
    const urlQuery = url.query || {};
    
    logMock('debug', `收到请求: ${req.method} ${urlPath}`);
    
    // 处理OPTIONS请求
    if (req.method?.toUpperCase() === 'OPTIONS') {
      handleCors(res);
      res.statusCode = 204;
      res.end();
      return;
    }
    
    // 为所有响应添加CORS头
    handleCors(res);
    
    // 模拟网络延迟
    if (mockConfig.delay > 0) {
      await delay(mockConfig.delay);
    }
    
    try {
      await handleRequest(req, res, urlPath, urlQuery);
    } catch (error) {
      // 处理所有未捕获的错误
      console.error('[Mock] 处理请求时发生错误:', error);
      sendJsonResponse(res, 500, {
        error: '服务器错误',
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
  };
}

export default createMockMiddleware; 