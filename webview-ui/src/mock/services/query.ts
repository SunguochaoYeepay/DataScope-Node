/**
 * 查询Mock服务
 * 
 * 提供查询相关API的模拟实现
 */

import { delay, createPaginationResponse, createMockResponse, createMockErrorResponse } from './utils';
import { mockConfig } from '../config';

// 模拟查询数据
const mockQueries = Array.from({ length: 10 }, (_, i) => {
  const id = `query-${i + 1}`;
  const timestamp = new Date(Date.now() - i * 86400000).toISOString();
  
  return {
    id,
    name: `示例查询 ${i + 1}`,
    description: `这是示例查询 ${i + 1} 的描述`,
    folderId: i % 3 === 0 ? 'folder-1' : (i % 3 === 1 ? 'folder-2' : 'folder-3'),
    dataSourceId: `ds-${(i % 5) + 1}`,
    dataSourceName: `数据源 ${(i % 5) + 1}`,
    queryType: i % 2 === 0 ? 'SQL' : 'NATURAL_LANGUAGE',
    queryText: i % 2 === 0 ? 
      `SELECT * FROM example_table WHERE id > ${i} ORDER BY name LIMIT 10` : 
      `查找最近10条${i % 2 === 0 ? '订单' : '用户'}记录`,
    status: i % 4 === 0 ? 'DRAFT' : (i % 4 === 1 ? 'PUBLISHED' : (i % 4 === 2 ? 'DEPRECATED' : 'ARCHIVED')),
    serviceStatus: i % 2 === 0 ? 'ENABLED' : 'DISABLED',
    createdAt: timestamp,
    updatedAt: new Date(Date.now() - i * 43200000).toISOString(),
    createdBy: { id: 'user1', name: '测试用户' },
    updatedBy: { id: 'user1', name: '测试用户' },
    executionCount: Math.floor(Math.random() * 50),
    isFavorite: i % 3 === 0,
    isActive: i % 5 !== 0,
    lastExecutedAt: new Date(Date.now() - i * 432000).toISOString(),
    resultCount: Math.floor(Math.random() * 100) + 10,
    executionTime: Math.floor(Math.random() * 500) + 10,
    tags: [`标签${i+1}`, `类型${i % 3}`],
    currentVersion: {
      id: `ver-${id}-1`,
      queryId: id,
      versionNumber: 1,
      name: '当前版本',
      sql: `SELECT * FROM example_table WHERE id > ${i} ORDER BY name LIMIT 10`,
      dataSourceId: `ds-${(i % 5) + 1}`,
      status: 'PUBLISHED',
      isLatest: true,
      createdAt: timestamp
    },
    versions: [{
      id: `ver-${id}-1`,
      queryId: id,
      versionNumber: 1,
      name: '当前版本',
      sql: `SELECT * FROM example_table WHERE id > ${i} ORDER BY name LIMIT 10`,
      dataSourceId: `ds-${(i % 5) + 1}`,
      status: 'PUBLISHED',
      isLatest: true,
      createdAt: timestamp
    }]
  };
});

// 重置查询数据
export function resetQueries(): void {
  // 保留引用，只重置内容
  while (mockQueries.length > 0) {
    mockQueries.pop();
  }
  
  // 重新生成查询数据
  Array.from({ length: 10 }, (_, i) => {
    const id = `query-${i + 1}`;
    const timestamp = new Date(Date.now() - i * 86400000).toISOString();
    
    mockQueries.push({
      id,
      name: `示例查询 ${i + 1}`,
      description: `这是示例查询 ${i + 1} 的描述`,
      folderId: i % 3 === 0 ? 'folder-1' : (i % 3 === 1 ? 'folder-2' : 'folder-3'),
      dataSourceId: `ds-${(i % 5) + 1}`,
      dataSourceName: `数据源 ${(i % 5) + 1}`,
      queryType: i % 2 === 0 ? 'SQL' : 'NATURAL_LANGUAGE',
      queryText: i % 2 === 0 ? 
        `SELECT * FROM example_table WHERE id > ${i} ORDER BY name LIMIT 10` : 
        `查找最近10条${i % 2 === 0 ? '订单' : '用户'}记录`,
      status: i % 4 === 0 ? 'DRAFT' : (i % 4 === 1 ? 'PUBLISHED' : (i % 4 === 2 ? 'DEPRECATED' : 'ARCHIVED')),
      serviceStatus: i % 2 === 0 ? 'ENABLED' : 'DISABLED',
      createdAt: timestamp,
      updatedAt: new Date(Date.now() - i * 43200000).toISOString(),
      createdBy: { id: 'user1', name: '测试用户' },
      updatedBy: { id: 'user1', name: '测试用户' },
      executionCount: Math.floor(Math.random() * 50),
      isFavorite: i % 3 === 0,
      isActive: i % 5 !== 0,
      lastExecutedAt: new Date(Date.now() - i * 432000).toISOString(),
      resultCount: Math.floor(Math.random() * 100) + 10,
      executionTime: Math.floor(Math.random() * 500) + 10,
      tags: [`标签${i+1}`, `类型${i % 3}`],
      currentVersion: {
        id: `ver-${id}-1`,
        queryId: id,
        versionNumber: 1,
        name: '当前版本',
        sql: `SELECT * FROM example_table WHERE id > ${i} ORDER BY name LIMIT 10`,
        dataSourceId: `ds-${(i % 5) + 1}`,
        status: 'PUBLISHED',
        isLatest: true,
        createdAt: timestamp
      },
      versions: [{
        id: `ver-${id}-1`,
        queryId: id,
        versionNumber: 1,
        name: '当前版本',
        sql: `SELECT * FROM example_table WHERE id > ${i} ORDER BY name LIMIT 10`,
        dataSourceId: `ds-${(i % 5) + 1}`,
        status: 'PUBLISHED',
        isLatest: true,
        createdAt: timestamp
      }]
    });
  });
}

/**
 * 模拟延迟
 */
async function simulateDelay(): Promise<void> {
  const delayTime = typeof mockConfig.delay === 'number' ? mockConfig.delay : 300;
  return delay(delayTime);
}

/**
 * 查询服务
 */
const queryService = {
  /**
   * 获取查询列表
   */
  async getQueries(params?: any): Promise<any> {
    await simulateDelay();
    
    const page = params?.page || 1;
    const size = params?.size || 10;
    
    // 应用过滤
    let filteredItems = [...mockQueries];
    
    // 按名称过滤
    if (params?.name) {
      const keyword = params.name.toLowerCase();
      filteredItems = filteredItems.filter(q => 
        q.name.toLowerCase().includes(keyword) || 
        (q.description && q.description.toLowerCase().includes(keyword))
      );
    }
    
    // 按数据源过滤
    if (params?.dataSourceId) {
      filteredItems = filteredItems.filter(q => q.dataSourceId === params.dataSourceId);
    }
    
    // 按状态过滤
    if (params?.status) {
      filteredItems = filteredItems.filter(q => q.status === params.status);
    }
    
    // 按类型过滤
    if (params?.queryType) {
      filteredItems = filteredItems.filter(q => q.queryType === params.queryType);
    }
    
    // 按收藏过滤
    if (params?.isFavorite) {
      filteredItems = filteredItems.filter(q => q.isFavorite === true);
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
  },
  
  /**
   * 获取单个查询
   */
  async getQuery(id: string): Promise<any> {
    await simulateDelay();
    
    // 查找查询
    const query = mockQueries.find(q => q.id === id);
    
    if (!query) {
      throw new Error(`未找到ID为${id}的查询`);
    }
    
    return query;
  },
  
  /**
   * 创建查询
   */
  async createQuery(data: any): Promise<any> {
    await simulateDelay();
    
    // 创建新ID，格式与现有ID一致
    const id = `query-${mockQueries.length + 1}`;
    const timestamp = new Date().toISOString();
    
    // 创建新查询
    const newQuery = {
      id,
      name: data.name || `新查询 ${id}`,
      description: data.description || '',
      folderId: data.folderId || null,
      dataSourceId: data.dataSourceId,
      dataSourceName: data.dataSourceName || `数据源 ${data.dataSourceId}`,
      queryType: data.queryType || 'SQL',
      queryText: data.queryText || '',
      status: data.status || 'DRAFT',
      serviceStatus: data.serviceStatus || 'DISABLED',
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: data.createdBy || { id: 'user1', name: '测试用户' },
      updatedBy: data.updatedBy || { id: 'user1', name: '测试用户' },
      executionCount: 0,
      isFavorite: data.isFavorite || false,
      isActive: data.isActive || true,
      lastExecutedAt: null,
      resultCount: 0,
      executionTime: 0,
      tags: data.tags || [],
      currentVersion: {
        id: `ver-${id}-1`,
        queryId: id,
        versionNumber: 1,
        name: '初始版本',
        sql: data.queryText || '',
        dataSourceId: data.dataSourceId,
        status: 'DRAFT',
        isLatest: true,
        createdAt: timestamp
      },
      versions: [{
        id: `ver-${id}-1`,
        queryId: id,
        versionNumber: 1,
        name: '初始版本',
        sql: data.queryText || '',
        dataSourceId: data.dataSourceId,
        status: 'DRAFT',
        isLatest: true,
        createdAt: timestamp
      }]
    };
    
    // 添加到列表
    mockQueries.push(newQuery);
    
    return newQuery;
  },
  
  /**
   * 更新查询
   */
  async updateQuery(id: string, data: any): Promise<any> {
    await simulateDelay();
    
    // 查找要更新的查询索引
    const index = mockQueries.findIndex(q => q.id === id);
    
    if (index === -1) {
      throw new Error(`未找到ID为${id}的查询`);
    }
    
    // 更新查询
    const updatedQuery = {
      ...mockQueries[index],
      ...data,
      updatedAt: new Date().toISOString(),
      updatedBy: data.updatedBy || mockQueries[index].updatedBy || { id: 'user1', name: '测试用户' }
    };
    
    // 替换查询
    mockQueries[index] = updatedQuery;
    
    return updatedQuery;
  },
  
  /**
   * 删除查询
   */
  async deleteQuery(id: string): Promise<void> {
    await simulateDelay();
    
    // 查找要删除的查询索引
    const index = mockQueries.findIndex(q => q.id === id);
    
    if (index === -1) {
      throw new Error(`未找到ID为${id}的查询`);
    }
    
    // 删除查询
    mockQueries.splice(index, 1);
  },
  
  /**
   * 执行查询
   */
  async executeQuery(id: string, params?: any): Promise<any> {
    await simulateDelay();
    
    // 查找查询
    const query = mockQueries.find(q => q.id === id);
    
    if (!query) {
      throw new Error(`未找到ID为${id}的查询`);
    }
    
    // 生成模拟结果
    const columns = ['id', 'name', 'email', 'status', 'created_at'];
    const rows = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `用户 ${i + 1}`,
      email: `user${i + 1}@example.com`,
      status: i % 2 === 0 ? 'active' : 'inactive',
      created_at: new Date(Date.now() - i * 86400000).toISOString()
    }));
    
    // 更新查询执行统计
    const index = mockQueries.findIndex(q => q.id === id);
    if (index !== -1) {
      mockQueries[index] = {
        ...mockQueries[index],
        executionCount: (mockQueries[index].executionCount || 0) + 1,
        lastExecutedAt: new Date().toISOString(),
        resultCount: rows.length
      };
    }
    
    // 返回结果
    return {
      columns,
      rows,
      metadata: {
        executionTime: Math.random() * 0.5 + 0.1,
        rowCount: rows.length,
        totalPages: 1
      },
      query: {
        id: query.id,
        name: query.name,
        dataSourceId: query.dataSourceId
      }
    };
  },
  
  /**
   * 切换查询收藏状态
   */
  async toggleFavorite(id: string): Promise<any> {
    await simulateDelay();
    
    // 查找查询
    const index = mockQueries.findIndex(q => q.id === id);
    
    if (index === -1) {
      throw new Error(`未找到ID为${id}的查询`);
    }
    
    // 切换收藏状态
    mockQueries[index] = {
      ...mockQueries[index],
      isFavorite: !mockQueries[index].isFavorite,
      updatedAt: new Date().toISOString()
    };
    
    return mockQueries[index];
  },
  
  /**
   * 获取查询历史
   */
  async getQueryHistory(params?: any): Promise<any> {
    await simulateDelay();
    
    const page = params?.page || 1;
    const size = params?.size || 10;
    
    // 生成模拟历史记录
    const totalItems = 20;
    const histories = Array.from({ length: totalItems }, (_, i) => {
      const timestamp = new Date(Date.now() - i * 3600000).toISOString();
      const queryIndex = i % mockQueries.length;
      
      return {
        id: `hist-${i + 1}`,
        queryId: mockQueries[queryIndex].id,
        queryName: mockQueries[queryIndex].name,
        executedAt: timestamp,
        executionTime: Math.random() * 0.5 + 0.1,
        rowCount: Math.floor(Math.random() * 100) + 1,
        userId: 'user1',
        userName: '测试用户',
        status: i % 8 === 0 ? 'FAILED' : 'SUCCESS',
        errorMessage: i % 8 === 0 ? '查询执行超时' : null
      };
    });
    
    // 应用分页
    const start = (page - 1) * size;
    const end = Math.min(start + size, totalItems);
    const paginatedItems = histories.slice(start, end);
    
    // 返回分页结果
    return {
      items: paginatedItems,
      pagination: {
        total: totalItems,
        page,
        size,
        totalPages: Math.ceil(totalItems / size)
      }
    };
  },
  
  /**
   * 获取查询版本列表
   */
  async getQueryVersions(queryId: string, params?: any): Promise<any> {
    await simulateDelay();
    
    // 查找查询
    const query = mockQueries.find(q => q.id === queryId);
    
    if (!query) {
      throw new Error(`未找到ID为${queryId}的查询`);
    }
    
    // 返回版本列表
    return query.versions || [];
  },
  
  /**
   * 创建查询版本
   */
  async createQueryVersion(queryId: string, data: any): Promise<any> {
    await simulateDelay();
    
    // 查找查询
    const index = mockQueries.findIndex(q => q.id === queryId);
    
    if (index === -1) {
      throw new Error(`未找到ID为${queryId}的查询`);
    }
    
    // 创建新版本
    const query = mockQueries[index];
    const newVersionNumber = (query.versions?.length || 0) + 1;
    const timestamp = new Date().toISOString();
    
    const newVersion = {
      id: `ver-${queryId}-${newVersionNumber}`,
      queryId,
      versionNumber: newVersionNumber,
      name: data.name || `版本 ${newVersionNumber}`,
      sql: data.sql || query.queryText || '',
      dataSourceId: data.dataSourceId || query.dataSourceId,
      status: 'DRAFT',
      isLatest: true,
      createdAt: timestamp
    };
    
    // 更新之前版本的isLatest标志
    if (query.versions && query.versions.length > 0) {
      query.versions = query.versions.map(v => ({
        ...v,
        isLatest: false
      }));
    }
    
    // 添加新版本
    if (!query.versions) {
      query.versions = [];
    }
    query.versions.push(newVersion);
    
    // 更新当前版本
    mockQueries[index] = {
      ...query,
      currentVersion: newVersion,
      updatedAt: timestamp
    };
    
    return newVersion;
  },
  
  /**
   * 发布查询版本
   */
  async publishQueryVersion(versionId: string): Promise<any> {
    await simulateDelay();
    
    // 查找包含此版本的查询
    let query = null;
    let versionIndex = -1;
    let queryIndex = -1;
    
    for (let i = 0; i < mockQueries.length; i++) {
      if (mockQueries[i].versions) {
        const vIndex = mockQueries[i].versions.findIndex(v => v.id === versionId);
        if (vIndex !== -1) {
          query = mockQueries[i];
          versionIndex = vIndex;
          queryIndex = i;
          break;
        }
      }
    }
    
    if (!query || versionIndex === -1) {
      throw new Error(`未找到ID为${versionId}的查询版本`);
    }
    
    // 更新版本状态
    const updatedVersion = {
      ...query.versions[versionIndex],
      status: 'PUBLISHED',
      publishedAt: new Date().toISOString()
    };
    
    query.versions[versionIndex] = updatedVersion;
    
    // 更新查询状态
    mockQueries[queryIndex] = {
      ...query,
      status: 'PUBLISHED',
      currentVersion: updatedVersion,
      updatedAt: new Date().toISOString()
    };
    
    return updatedVersion;
  },
  
  /**
   * 废弃查询版本
   */
  async deprecateQueryVersion(versionId: string): Promise<any> {
    await simulateDelay();
    
    // 查找包含此版本的查询
    let query = null;
    let versionIndex = -1;
    let queryIndex = -1;
    
    for (let i = 0; i < mockQueries.length; i++) {
      if (mockQueries[i].versions) {
        const vIndex = mockQueries[i].versions.findIndex(v => v.id === versionId);
        if (vIndex !== -1) {
          query = mockQueries[i];
          versionIndex = vIndex;
          queryIndex = i;
          break;
        }
      }
    }
    
    if (!query || versionIndex === -1) {
      throw new Error(`未找到ID为${versionId}的查询版本`);
    }
    
    // 更新版本状态
    const updatedVersion = {
      ...query.versions[versionIndex],
      status: 'DEPRECATED',
      deprecatedAt: new Date().toISOString()
    };
    
    query.versions[versionIndex] = updatedVersion;
    
    // 如果废弃的是当前版本，则更新查询状态
    if (query.currentVersion && query.currentVersion.id === versionId) {
      mockQueries[queryIndex] = {
        ...query,
        status: 'DEPRECATED',
        currentVersion: updatedVersion,
        updatedAt: new Date().toISOString()
      };
    } else {
      mockQueries[queryIndex] = {
        ...query,
        versions: query.versions,
        updatedAt: new Date().toISOString()
      };
    }
    
    return updatedVersion;
  },
  
  /**
   * 激活查询版本
   */
  async activateQueryVersion(queryId: string, versionId: string): Promise<any> {
    await simulateDelay();
    
    // 查找查询
    const queryIndex = mockQueries.findIndex(q => q.id === queryId);
    
    if (queryIndex === -1) {
      throw new Error(`未找到ID为${queryId}的查询`);
    }
    
    const query = mockQueries[queryIndex];
    
    // 查找版本
    if (!query.versions) {
      throw new Error(`查询 ${queryId} 没有版本`);
    }
    
    const versionIndex = query.versions.findIndex(v => v.id === versionId);
    
    if (versionIndex === -1) {
      throw new Error(`未找到ID为${versionId}的查询版本`);
    }
    
    // 获取要激活的版本
    const versionToActivate = query.versions[versionIndex];
    
    // 更新当前版本和查询状态
    mockQueries[queryIndex] = {
      ...query,
      currentVersion: versionToActivate,
      status: versionToActivate.status,
      updatedAt: new Date().toISOString()
    };
    
    return versionToActivate;
  }
};

export default queryService; 