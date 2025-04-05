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
async function handleQueriesApi(req: IncomingMessage, res: ServerResponse, urlPath: string, urlQuery: any): Promise<boolean> {
  const method = req.method?.toUpperCase();
  
  // 检查URL是否匹配查询API
  const isQueriesPath = urlPath.includes('/queries');
  
  // 打印所有查询相关请求以便调试
  if (isQueriesPath) {
    console.log(`[Mock] 检测到查询API请求: ${method} ${urlPath}`, urlQuery);
  }
  
  // 获取查询列表
  if (urlPath === '/api/queries' && method === 'GET') {
    logMock('debug', `处理GET请求: /api/queries`);
    console.log('[Mock] 处理查询列表请求, 参数:', urlQuery);
    
    try {
      // 使用服务层获取查询列表，支持分页和过滤
      const result = await queryService.getQueries({
        page: parseInt(urlQuery.page as string) || 1,
        size: parseInt(urlQuery.size as string) || 10,
        name: urlQuery.name as string,
        dataSourceId: urlQuery.dataSourceId as string,
        status: urlQuery.status as string,
        queryType: urlQuery.queryType as string,
        isFavorite: urlQuery.isFavorite === 'true'
      });
      
      console.log('[Mock] 查询列表结果:', {
        itemsCount: result.items.length,
        pagination: result.pagination
      });
      
      console.log('[Mock] 返回查询列表数据格式:', { 
        data: `Array[${result.items.length}]`, 
        pagination: result.pagination,
        success: true
      });
      
      // 检查result.items是否包含数据，如果为空则从导入的模块中获取
      if (result.items.length === 0) {
        try {
          // 使用动态导入方式获取查询数据，避免循环依赖
          const mockQueryData = await import('../data/query');
          const mockQueries = mockQueryData.mockQueries || [];
          
          if (mockQueries.length > 0) {
            console.log('[Mock] 查询列表为空，使用模拟数据:', mockQueries.length);
            
            const page = parseInt(urlQuery.page as string) || 1;
            const size = parseInt(urlQuery.size as string) || 10;
            const start = (page - 1) * size;
            const end = Math.min(start + size, mockQueries.length);
            
            const paginatedItems = mockQueries.slice(start, end);
            const pagination = {
              total: mockQueries.length,
              page,
              size,
              totalPages: Math.ceil(mockQueries.length / size)
            };
            
            sendJsonResponse(res, 200, {
              data: paginatedItems,
              pagination,
              success: true
            });
            return true;
          }
        } catch (error) {
          console.error('[Mock] 导入查询模拟数据失败:', error);
        }
      }
      
      sendJsonResponse(res, 200, {
        data: result.items,
        pagination: result.pagination,
        success: true
      });
    } catch (error) {
      console.error('[Mock] 获取查询列表失败:', error);
      sendJsonResponse(res, 500, {
        error: '获取查询列表失败',
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  
  // 获取单个查询
  if (urlPath.match(/^\/api\/queries\/[^\/]+$/) && method === 'GET') {
    const id = urlPath.split('/').pop() || '';
    
    logMock('debug', `处理GET请求: ${urlPath}, ID: ${id}`);
    
    try {
      const query = await queryService.getQuery(id);
      sendJsonResponse(res, 200, {
        data: query,
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 404, {
        error: '查询不存在',
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  
  // 创建查询
  if (urlPath === '/api/queries' && method === 'POST') {
    logMock('debug', `处理POST请求: /api/queries`);
    
    try {
      const body = await parseRequestBody(req);
      const newQuery = await queryService.createQuery(body);
      
      sendJsonResponse(res, 201, {
        data: newQuery,
        message: '查询创建成功',
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 400, {
        error: '创建查询失败',
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  
  // 更新查询
  if (urlPath.match(/^\/api\/queries\/[^\/]+$/) && method === 'PUT') {
    const id = urlPath.split('/').pop() || '';
    
    logMock('debug', `处理PUT请求: ${urlPath}, ID: ${id}`);
    
    try {
      const body = await parseRequestBody(req);
      const updatedQuery = await queryService.updateQuery(id, body);
      
      sendJsonResponse(res, 200, {
        data: updatedQuery,
        message: '查询更新成功',
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 404, {
        error: '更新查询失败',
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  
  // 执行查询
  if (urlPath.match(/^\/api\/queries\/[^\/]+\/execute$/) && method === 'POST') {
    const id = urlPath.split('/')[3]; // 提取ID: /api/queries/{id}/execute
    
    logMock('debug', `处理POST请求: ${urlPath}, ID: ${id}`);
    
    try {
      const body = await parseRequestBody(req);
      const result = await queryService.executeQuery(id, body);
      
      sendJsonResponse(res, 200, {
        data: result,
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 400, {
        error: '执行查询失败',
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  
  // 创建查询版本
  if (urlPath.match(/^\/api\/queries\/[^\/]+\/versions$/) && method === 'POST') {
    const queryId = urlPath.split('/')[3]; // 提取查询ID: /api/queries/{id}/versions
    
    logMock('debug', `处理POST请求: ${urlPath}, 查询ID: ${queryId}`);
    
    try {
      const body = await parseRequestBody(req);
      const result = await queryService.createQueryVersion(queryId, body);
      
      sendJsonResponse(res, 201, {
        data: result,
        success: true,
        message: '查询版本创建成功'
      });
    } catch (error) {
      sendJsonResponse(res, 404, {
        error: '创建查询版本失败',
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  
  // 获取查询版本列表
  if (urlPath.match(/^\/api\/queries\/[^\/]+\/versions$/) && method === 'GET') {
    const queryId = urlPath.split('/')[3]; // 提取查询ID: /api/queries/{id}/versions
    
    logMock('debug', `处理GET请求: ${urlPath}, 查询ID: ${queryId}`);
    
    try {
      const versions = await queryService.getQueryVersions(queryId);
      
      sendJsonResponse(res, 200, {
        data: versions,
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 404, {
        error: '获取查询版本列表失败',
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  
  // 发布查询版本
  if (urlPath.match(/^\/api\/queries\/versions\/[^\/]+\/publish$/) && method === 'POST') {
    const versionId = urlPath.split('/')[4]; // 提取版本ID: /api/queries/versions/{id}/publish
    
    logMock('debug', `处理POST请求: ${urlPath}, 版本ID: ${versionId}`);
    
    try {
      const result = await queryService.publishQueryVersion(versionId);
      
      sendJsonResponse(res, 200, {
        data: result,
        success: true,
        message: '查询版本发布成功'
      });
    } catch (error) {
      sendJsonResponse(res, 404, {
        error: '发布查询版本失败',
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  
  // 激活查询版本
  if (urlPath.match(/^\/api\/queries\/[^\/]+\/versions\/[^\/]+\/activate$/) && method === 'POST') {
    const urlParts = urlPath.split('/');
    const queryId = urlParts[3]; // 提取查询ID: /api/queries/{queryId}/versions/{versionId}/activate
    const versionId = urlParts[5]; // 提取版本ID
    
    logMock('debug', `处理POST请求: ${urlPath}, 查询ID: ${queryId}, 版本ID: ${versionId}`);
    
    try {
      const result = await queryService.activateQueryVersion(queryId, versionId);
      
      sendJsonResponse(res, 200, {
        data: result,
        success: true,
        message: '查询版本激活成功'
      });
    } catch (error) {
      sendJsonResponse(res, 404, {
        error: '激活查询版本失败',
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
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
        
        // 如果要兼容旧版格式，直接返回数组
        const responseData = result.items;
        
        sendJsonResponse(res, 200, responseData);
      } catch (error) {
        sendJsonResponse(res, 500, { 
          error: '获取集成列表失败',
          message: error instanceof Error ? error.message : String(error),
          success: false
        });
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