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
  
  // 获取收藏查询列表
  if (urlPath === '/api/queries/favorites' && method === 'GET') {
    logMock('debug', `处理GET请求: /api/queries/favorites`);
    console.log('[Mock] 处理收藏查询列表请求, 参数:', urlQuery);
    
    try {
      // 使用服务层获取收藏查询列表
      const result = await queryService.getFavoriteQueries({
        page: parseInt(urlQuery.page as string) || 1,
        size: parseInt(urlQuery.size as string) || 10,
        name: urlQuery.name as string || urlQuery.search as string,
        dataSourceId: urlQuery.dataSourceId as string,
        status: urlQuery.status as string
      });
      
      console.log('[Mock] 收藏查询列表结果:', {
        itemsCount: result.items.length,
        pagination: result.pagination
      });
      
      sendJsonResponse(res, 200, { 
        data: result.items, 
        pagination: result.pagination,
        success: true
      });
    } catch (error) {
      console.error('[Mock] 获取收藏查询列表失败:', error);
      sendJsonResponse(res, 500, { 
        error: '获取收藏查询列表失败',
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
  
  // 删除查询
  if (urlPath.match(/^\/api\/queries\/[^\/]+$/) && method === 'DELETE') {
    const id = urlPath.split('/').pop() || '';
    
    logMock('debug', `处理DELETE请求: ${urlPath}, ID: ${id}`);
    
    try {
      await queryService.deleteQuery(id);
      
      sendJsonResponse(res, 200, {
        message: '查询删除成功',
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 404, {
        error: '删除查询失败',
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  
  // 执行查询
  if (urlPath.match(/^\/api\/queries\/[^\/]+\/run$/) && method === 'POST') {
    const id = urlPath.split('/')[3] || '';
    
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
  
  // 执行查询（兼容execute路径）
  if (urlPath.match(/^\/api\/queries\/[^\/]+\/execute$/) && method === 'POST') {
    const id = urlPath.split('/')[3] || '';
    
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
  
  // 切换查询收藏状态
  if (urlPath.match(/^\/api\/queries\/[^\/]+\/favorite$/) && method === 'POST') {
    const id = urlPath.split('/')[3] || '';
    
    logMock('debug', `处理POST请求: ${urlPath}, ID: ${id}`);
    
    try {
      const body = await parseRequestBody(req);
      const result = await queryService.toggleFavorite(id);
      
      sendJsonResponse(res, 200, {
        data: result,
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 404, {
        error: '更新收藏状态失败',
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  
  // 获取查询版本
  if (urlPath.match(/^\/api\/queries\/[^\/]+\/versions$/) && method === 'GET') {
    const id = urlPath.split('/')[3] || '';
    
    logMock('debug', `处理GET请求: ${urlPath}, ID: ${id}`);
    
    try {
      const versions = await queryService.getQueryVersions(id);
      
      sendJsonResponse(res, 200, {
        data: versions,
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 404, {
        error: '获取查询版本失败',
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  
  // 获取查询特定版本
  if (urlPath.match(/^\/api\/queries\/[^\/]+\/versions\/[^\/]+$/) && method === 'GET') {
    const parts = urlPath.split('/');
    const queryId = parts[3] || '';
    const versionId = parts[5] || '';
    
    logMock('debug', `处理GET请求: ${urlPath}, 查询ID: ${queryId}, 版本ID: ${versionId}`);
    
    try {
      const versions = await queryService.getQueryVersions(queryId);
      const version = versions.find((v: any) => v.id === versionId);
      
      if (!version) {
        throw new Error(`未找到ID为${versionId}的查询版本`);
      }
      
      sendJsonResponse(res, 200, {
        data: version,
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 404, {
        error: '获取查询版本失败',
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
  
  // 检查URL是否匹配集成API
  const isIntegrationPath = urlPath.includes('/low-code/apis');
  
  // 打印所有集成相关请求以便调试
  if (isIntegrationPath) {
    console.log(`[Mock] 检测到集成API请求: ${method} ${urlPath}`, urlQuery);
  }
  
  // 获取集成列表
  if (urlPath === '/api/low-code/apis' && method === 'GET') {
    logMock('debug', `处理GET请求: /api/low-code/apis`);
    
    try {
      const result = await integrationService.getIntegrations({
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
        error: '获取集成列表失败',
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  
  // 获取单个集成
  if (urlPath.match(/^\/api\/low-code\/apis\/[^\/]+$/) && method === 'GET') {
    const id = urlPath.split('/').pop() || '';
    
    logMock('debug', `处理GET请求: ${urlPath}, ID: ${id}`);
    
    try {
      const integration = await integrationService.getIntegration(id);
      sendJsonResponse(res, 200, { 
        data: integration,
        success: true
      });
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
      
      sendJsonResponse(res, 201, {
        data: newIntegration,
        message: '集成创建成功',
        success: true
      });
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
  if (urlPath.match(/^\/api\/low-code\/apis\/[^\/]+$/) && method === 'PUT') {
    const id = urlPath.split('/').pop() || '';
    
    logMock('debug', `处理PUT请求: ${urlPath}, ID: ${id}`);
    
    try {
      const body = await parseRequestBody(req);
      const updatedIntegration = await integrationService.updateIntegration(id, body);
      
      sendJsonResponse(res, 200, {
        data: updatedIntegration,
        message: '集成更新成功',
        success: true
      });
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
  if (urlPath.match(/^\/api\/low-code\/apis\/[^\/]+$/) && method === 'DELETE') {
    const id = urlPath.split('/').pop() || '';
    
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
  
  // 测试集成 - 修正URL匹配模式
  if (urlPath.match(/^\/api\/low-code\/apis\/[^\/]+\/test$/) && method === 'POST') {
    // 从URL中提取集成ID - 修正ID提取方式
    const segments = urlPath.split('/');
    const idIndex = segments.findIndex(s => s === 'apis') + 1;
    const id = idIndex < segments.length ? segments[idIndex] : '';
    
    logMock('debug', `处理POST请求: ${urlPath}, 集成ID: ${id}`);
    
    try {
      const body = await parseRequestBody(req);
      const result = await integrationService.testIntegration(id, body);
      
      sendJsonResponse(res, 200, {
        data: result,
        success: true
      });
    } catch (error) {
      sendJsonResponse(res, 400, {
        error: '测试集成失败',
        message: error instanceof Error ? error.message : String(error),
        success: false
      });
    }
    return true;
  }
  
  // 执行集成查询 - 修正URL匹配模式
  if (urlPath.match(/^\/api\/low-code\/apis\/[^\/]+\/query$/) && method === 'POST') {
    // 从URL中提取集成ID - 修正ID提取方式
    const segments = urlPath.split('/');
    const idIndex = segments.findIndex(s => s === 'apis') + 1;
    const id = idIndex < segments.length ? segments[idIndex] : '';
    
    logMock('debug', `处理POST请求: ${urlPath}, 集成ID: ${id}`);
    
    try {
      const body = await parseRequestBody(req);
      const result = await integrationService.executeQuery(id, body);
      
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
      
      // 检查是否应该处理此请求
      if (!url.includes('/api/')) {
        return next();
      }
      
      // 增强处理重复的API路径
      let processedUrl = url;
      if (url.includes('/api/api/')) {
        processedUrl = url.replace(/\/api\/api\//g, '/api/');
        logMock('debug', `检测到重复的API路径，已修正: ${url} -> ${processedUrl}`);
        // 修改原始请求的URL，确保后续处理能正确识别
        req.url = processedUrl;
      }
      
      // 测试：打印所有API请求以便调试
      console.log(`[Mock] 处理API请求: ${req.method} ${processedUrl}`);
      
      const parsedUrl = parse(processedUrl, true);
      const urlPath = parsedUrl.pathname || '';
      const urlQuery = parsedUrl.query || {};
      
      // 再次检查是否应该处理此请求（使用处理后的URL）
      if (!shouldMockRequest(processedUrl)) {
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
      if (!handled) handled = await handleQueriesApi(req, res, urlPath, urlQuery);
      if (!handled) handled = await handleIntegrationApi(req, res, urlPath, urlQuery);
      
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