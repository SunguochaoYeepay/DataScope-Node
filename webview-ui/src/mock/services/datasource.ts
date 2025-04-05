/**
 * 数据源Mock服务
 * 
 * 提供数据源相关API的模拟实现
 */

import { mockDataSources } from '../data/datasource';
import type { DataSource } from '../data/datasource';
import { mockConfig } from '../config';

// 临时存储模拟数据源，允许模拟增删改操作
let dataSources = [...mockDataSources];

/**
 * 模拟延迟
 */
async function simulateDelay(): Promise<void> {
  const delay = typeof mockConfig.delay === 'number' ? mockConfig.delay : 300;
  return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * 重置数据源数据
 */
export function resetDataSources(): void {
  dataSources = [...mockDataSources];
}

/**
 * 获取数据源列表
 * @param params 查询参数
 * @returns 分页数据源列表
 */
export async function getDataSources(params?: {
  page?: number;
  size?: number;
  name?: string;
  type?: string;
  status?: string;
}): Promise<{
  items: DataSource[];
  pagination: {
    total: number;
    page: number;
    size: number;
    totalPages: number;
  };
}> {
  // 模拟延迟
  await simulateDelay();
  
  const page = params?.page || 1;
  const size = params?.size || 10;
  
  // 应用过滤
  let filteredItems = [...dataSources];
  
  // 按名称过滤
  if (params?.name) {
    const keyword = params.name.toLowerCase();
    filteredItems = filteredItems.filter(ds => 
      ds.name.toLowerCase().includes(keyword) || 
      (ds.description && ds.description.toLowerCase().includes(keyword))
    );
  }
  
  // 按类型过滤
  if (params?.type) {
    filteredItems = filteredItems.filter(ds => ds.type === params.type);
  }
  
  // 按状态过滤
  if (params?.status) {
    filteredItems = filteredItems.filter(ds => ds.status === params.status);
  }
  
  // 应用分页
  const start = (page - 1) * size;
  const end = Math.min(start + size, filteredItems.length);
  const paginatedItems = filteredItems.slice(start, end);
  
  // 返回分页结果
  return {
    items: paginatedItems,
    pagination: {
      total: filteredItems.length,
      page,
      size,
      totalPages: Math.ceil(filteredItems.length / size)
    }
  };
}

/**
 * 获取单个数据源
 * @param id 数据源ID
 * @returns 数据源详情
 */
export async function getDataSource(id: string): Promise<DataSource> {
  // 模拟延迟
  await simulateDelay();
  
  // 查找数据源
  const dataSource = dataSources.find(ds => ds.id === id);
  
  if (!dataSource) {
    throw new Error(`未找到ID为${id}的数据源`);
  }
  
  return dataSource;
}

/**
 * 创建数据源
 * @param data 数据源数据
 * @returns 创建的数据源
 */
export async function createDataSource(data: Partial<DataSource>): Promise<DataSource> {
  // 模拟延迟
  await simulateDelay();
  
  // 创建新ID
  const newId = `ds-${Date.now()}`;
  
  // 创建新的数据源
  const newDataSource: DataSource = {
    id: newId,
    name: data.name || 'New Data Source',
    description: data.description || '',
    type: data.type || 'mysql',
    host: data.host,
    port: data.port,
    databaseName: data.databaseName,
    username: data.username,
    status: data.status || 'pending',
    syncFrequency: data.syncFrequency || 'manual',
    lastSyncTime: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  };
  
  // 添加到列表
  dataSources.push(newDataSource);
  
  return newDataSource;
}

/**
 * 更新数据源
 * @param id 数据源ID
 * @param data 更新数据
 * @returns 更新后的数据源
 */
export async function updateDataSource(id: string, data: Partial<DataSource>): Promise<DataSource> {
  // 模拟延迟
  await simulateDelay();
  
  // 找到要更新的数据源索引
  const index = dataSources.findIndex(ds => ds.id === id);
  
  if (index === -1) {
    throw new Error(`未找到ID为${id}的数据源`);
  }
  
  // 更新数据源
  const updatedDataSource: DataSource = {
    ...dataSources[index],
    ...data,
    updatedAt: new Date().toISOString()
  };
  
  // 替换数据源
  dataSources[index] = updatedDataSource;
  
  return updatedDataSource;
}

/**
 * 删除数据源
 * @param id 数据源ID
 */
export async function deleteDataSource(id: string): Promise<void> {
  // 模拟延迟
  await simulateDelay();
  
  // 找到要删除的数据源索引
  const index = dataSources.findIndex(ds => ds.id === id);
  
  if (index === -1) {
    throw new Error(`未找到ID为${id}的数据源`);
  }
  
  // 删除数据源
  dataSources.splice(index, 1);
}

/**
 * 测试数据源连接
 * @param params 连接参数
 * @returns 连接测试结果
 */
export async function testConnection(params: Partial<DataSource>): Promise<{
  success: boolean;
  message?: string;
  details?: any;
}> {
  // 模拟延迟
  await simulateDelay();
  
  // 实际使用时可能会有更复杂的连接测试逻辑
  // 这里简单模拟成功/失败
  const success = Math.random() > 0.2; // 80%成功率
  
  return {
    success,
    message: success ? '连接成功' : '连接失败: 无法连接到数据库服务器',
    details: success ? {
      responseTime: Math.floor(Math.random() * 50) + 10,
      version: '8.0.28',
      connectionId: Math.floor(Math.random() * 10000) + 1000
    } : {
      errorCode: 'CONNECTION_REFUSED',
      errorDetails: '无法建立到服务器的连接，请检查网络设置和凭据'
    }
  };
}

// 导出服务
export default {
  getDataSources,
  getDataSource,
  createDataSource,
  updateDataSource,
  deleteDataSource,
  testConnection,
  resetDataSources
}; 