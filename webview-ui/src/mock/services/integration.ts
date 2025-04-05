/**
 * 集成Mock服务
 * 
 * 提供集成相关API的模拟实现
 */

import { delay, createPaginationResponse, createMockResponse, createMockErrorResponse } from './utils';
import { mockConfig } from '../config';
import { mockIntegrations } from '../data/integration';

/**
 * 模拟延迟
 */
async function simulateDelay(): Promise<void> {
  const delayTime = typeof mockConfig.delay === 'number' ? mockConfig.delay : 300;
  return delay(delayTime);
}

/**
 * 集成服务
 */
const integrationService = {
  /**
   * 获取集成列表（原始实现）
   */
  async getIntegrationsOriginal(params?: any): Promise<any> {
    await simulateDelay();
    
    const page = params?.page || 1;
    const size = params?.size || 10;
    
    // 应用过滤
    let filteredItems = [...mockIntegrations];
    
    // 按名称过滤
    if (params?.name) {
      const keyword = params.name.toLowerCase();
      filteredItems = filteredItems.filter(i => 
        i.name.toLowerCase().includes(keyword) || 
        (i.description && i.description.toLowerCase().includes(keyword))
      );
    }
    
    // 按类型过滤
    if (params?.type) {
      filteredItems = filteredItems.filter(i => i.type === params.type);
    }
    
    // 按状态过滤
    if (params?.status) {
      filteredItems = filteredItems.filter(i => i.status === params.status);
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
   * 获取单个集成
   */
  async getIntegration(id: string): Promise<any> {
    await simulateDelay();
    
    // 查找集成
    const integration = mockIntegrations.find(i => i.id === id);
    
    if (!integration) {
      throw new Error(`未找到ID为${id}的集成`);
    }
    
    return integration;
  },
  
  /**
   * 创建集成
   */
  async createIntegration(data: any): Promise<any> {
    await simulateDelay();
    
    // 创建新集成
    const newId = `integration-${Date.now()}`;
    const timestamp = new Date().toISOString();
    
    const newIntegration = {
      id: newId,
      name: data.name || '新集成',
      description: data.description || '',
      type: data.type || 'REST',
      baseUrl: data.baseUrl || 'https://api.example.com',
      authType: data.authType || 'NONE',
      status: 'ACTIVE',
      createdAt: timestamp,
      updatedAt: timestamp,
      endpoints: data.endpoints || []
    };
    
    // 根据认证类型添加相应字段
    if (data.authType === 'BASIC') {
      Object.assign(newIntegration, {
        username: data.username || 'user',
        password: data.password || '********'
      });
    } else if (data.authType === 'API_KEY') {
      Object.assign(newIntegration, {
        apiKey: data.apiKey || '********'
      });
    } else if (data.authType === 'OAUTH2') {
      Object.assign(newIntegration, {
        clientId: data.clientId || 'client',
        clientSecret: data.clientSecret || '********'
      });
    }
    
    // 添加到模拟数据
    mockIntegrations.push(newIntegration);
    
    return newIntegration;
  },
  
  /**
   * 更新集成
   */
  async updateIntegration(id: string, data: any): Promise<any> {
    await simulateDelay();
    
    // 查找集成
    const index = mockIntegrations.findIndex(i => i.id === id);
    
    if (index === -1) {
      throw new Error(`未找到ID为${id}的集成`);
    }
    
    // 更新数据
    const updatedIntegration = {
      ...mockIntegrations[index],
      ...data,
      id, // 确保ID不变
      updatedAt: new Date().toISOString()
    };
    
    // 更新模拟数据
    mockIntegrations[index] = updatedIntegration;
    
    return updatedIntegration;
  },
  
  /**
   * 删除集成
   */
  async deleteIntegration(id: string): Promise<boolean> {
    await simulateDelay();
    
    // 查找集成
    const index = mockIntegrations.findIndex(i => i.id === id);
    
    if (index === -1) {
      throw new Error(`未找到ID为${id}的集成`);
    }
    
    // 从模拟数据中删除
    mockIntegrations.splice(index, 1);
    
    return true;
  },
  
  /**
   * 测试集成
   */
  async testIntegration(id: string, params: any = {}): Promise<any> {
    await simulateDelay();
    
    // 查找集成
    const integration = mockIntegrations.find(i => i.id === id);
    
    if (!integration) {
      throw new Error(`未找到ID为${id}的集成`);
    }
    
    // 返回模拟测试结果
    return {
      success: true,
      resultType: 'JSON',
      jsonResponse: {
        status: 'success',
        message: '连接测试成功',
        timestamp: new Date().toISOString(),
        details: {
          responseTime: Math.round(Math.random() * 100) + 50,
          serverInfo: 'Mock Server v1.0',
          endpoint: params.endpoint || integration.endpoints[0]?.path || '/'
        },
        data: Array.from({ length: 3 }, (_, i) => ({
          id: i + 1,
          name: `样本数据 ${i + 1}`,
          value: Math.round(Math.random() * 1000) / 10
        }))
      }
    };
  },
  
  /**
   * 执行集成查询
   */
  async executeQuery(id: string, params: any = {}): Promise<any> {
    await simulateDelay();
    
    // 查找集成
    const integration = mockIntegrations.find(i => i.id === id);
    
    if (!integration) {
      throw new Error(`未找到ID为${id}的集成`);
    }
    
    // 返回模拟执行结果
    return {
      success: true,
      resultType: 'JSON',
      jsonResponse: {
        status: 'success',
        timestamp: new Date().toISOString(),
        query: params.query || '默认查询',
        data: Array.from({ length: 5 }, (_, i) => ({
          id: `record-${i + 1}`,
          name: `记录 ${i + 1}`,
          description: `这是查询返回的记录 ${i + 1}`,
          createdAt: new Date(Date.now() - i * 86400000).toISOString(),
          properties: {
            type: i % 2 === 0 ? 'A' : 'B',
            value: Math.round(Math.random() * 100),
            active: i % 3 !== 0
          }
        }))
      }
    };
  },
  
  // 兼容旧的接口, 直接调用新的实现
  async getMockIntegrations(): Promise<any[]> {
    const result = await integrationService.getIntegrationsOriginal({});
    return result.items;
  },
  
  async getMockIntegration(id: string): Promise<any | null> {
    try {
      const integration = await integrationService.getIntegration(id);
      return integration;
    } catch (error) {
      console.error('获取集成失败:', error);
      return null;
    }
  },
  
  async createMockIntegration(data: any): Promise<any> {
    return integrationService.createIntegration(data);
  },
  
  async updateMockIntegration(id: string, updates: any): Promise<any> {
    return integrationService.updateIntegration(id, updates);
  },
  
  async deleteMockIntegration(id: string): Promise<boolean> {
    try {
      return await integrationService.deleteIntegration(id);
    } catch (error) {
      console.error('删除集成失败:', error);
      return false;
    }
  },
  
  async executeMockQuery(integrationId: string, query: any): Promise<any> {
    try {
      const result = await integrationService.executeQuery(integrationId, query);
      return {
        success: true,
        data: result.jsonResponse.data
      };
    } catch (error) {
      console.error('执行查询失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  },
  
  /**
   * 获取单个集成详情（适配新接口）
   * 此方法作为适配器，返回前端期望的IntegrationConfig格式
   */
  async getIntegrationById(id: string): Promise<any> {
    await simulateDelay();
    
    console.log(`[Mock集成服务] 获取单个集成详情，ID: ${id}`);
    
    // 查找集成
    const integration = mockIntegrations.find(i => i.id === id);
    
    if (!integration) {
      console.error(`[Mock集成服务] 未找到ID为${id}的集成`);
      throw new Error(`未找到ID为${id}的集成`);
    }
    
    console.log(`[Mock集成服务] 找到集成: ${integration.name}`);
    
    // 根据ID确定固定的dataSourceId和queryId，避免随机生成
    const dataSourceId = id === 'integration-1' ? 'ds-1' : 
                        (id === 'integration-2' ? 'ds-2' : 'ds-3');
    const queryId = id === 'integration-1' ? 'query-1' : 
                   (id === 'integration-2' ? 'query-2' : 'query-3');
    
    // 转换为符合前端期望的IntegrationConfig格式
    const result = {
      id: integration.id,
      name: integration.name,
      description: integration.description || '',
      queryId: queryId,
      type: integration.type === 'REST' ? 'TABLE' : (integration.type === 'GraphQL' ? 'CHART' : integration.type),
      dataSourceId: dataSourceId,
      status: integration.status,
      createdAt: integration.createdAt,
      updatedAt: integration.updatedAt,
      config: {
        tableConfig: {
          columns: [
            { key: 'id', dataIndex: 'id', title: 'ID' },
            { key: 'name', dataIndex: 'name', title: '名称' },
            { key: 'status', dataIndex: 'status', title: '状态' },
            { key: 'createdAt', dataIndex: 'createdAt', title: '创建时间' }
          ]
        },
        formConfig: {
          fields: [
            { name: 'name', label: '名称', type: 'INPUT', required: true },
            { name: 'status', label: '状态', type: 'SELECT', required: true }
          ]
        },
        chartConfig: {
          type: 'line',
          options: {}
        }
      },
      query: {
        id: queryId,
        name: '关联查询 ' + integration.name,
        dataSourceId: dataSourceId,
        sql: `SELECT * FROM ${integration.name.toLowerCase().replace(/\s+/g, '_')}_table LIMIT 100`
      },
      // 添加前端需要的字段
      tableConfig: {
        columns: [
          { field: 'id', label: 'ID', type: 'text', sortable: true, filterable: true, align: 'left', visible: true, displayOrder: 0 },
          { field: 'name', label: '名称', type: 'text', sortable: true, filterable: true, align: 'left', visible: true, displayOrder: 1 },
          { field: 'status', label: '状态', type: 'text', sortable: true, filterable: true, align: 'left', visible: true, displayOrder: 2 },
          { field: 'createdAt', label: '创建时间', type: 'datetime', sortable: true, filterable: true, align: 'left', visible: true, displayOrder: 3 }
        ],
        actions: [
          { name: 'view', label: '查看', type: 'primary', icon: 'eye' },
          { name: 'edit', label: '编辑', type: 'default', icon: 'edit' }
        ],
        pagination: {
          enabled: true,
          pageSize: 10,
          pageSizeOptions: [10, 20, 50, 100]
        },
        export: {
          enabled: true,
          formats: ['CSV', 'EXCEL'],
          maxRows: 1000
        }
      },
      createTime: integration.createdAt,
      updateTime: integration.updatedAt,
      queryParams: [],
      // 添加更多前端可能需要的信息
      datasource: {
        id: dataSourceId,
        name: dataSourceId === 'ds-1' ? 'MySQL示例数据库' : 
              (dataSourceId === 'ds-2' ? 'PostgreSQL生产库' : 'SQLite本地库'),
        type: dataSourceId === 'ds-1' ? 'mysql' : 
              (dataSourceId === 'ds-2' ? 'postgresql' : 'sqlite')
      }
    };
    
    console.log(`[Mock集成服务] 返回集成详情:`, JSON.stringify(result).substring(0, 300) + '...');
    
    return result;
  },
  
  /**
   * 获取集成列表（适配新接口）
   * 此方法作为适配器，返回前端期望的集成列表格式
   */
  async getIntegrations(params?: any): Promise<any> {
    await simulateDelay();
    
    // 首先检查mockIntegrations是否有数据
    console.log('[Mock集成服务] 原始mockIntegrations数据长度:', mockIntegrations.length);
    if (mockIntegrations.length === 0) {
      console.log('[Mock集成服务] mockIntegrations为空，尝试重新初始化数据');
      // 如果mockIntegrations为空，尝试重新初始化
      const { resetIntegrations } = require('../data/integration');
      resetIntegrations();
      console.log('[Mock集成服务] 重新初始化后数据长度:', mockIntegrations.length);
    }
    
    const page = params?.page || 1;
    const size = params?.size || 10;
    
    // 应用过滤
    let filteredItems = [...mockIntegrations];
    
    // 按名称过滤
    if (params?.name) {
      const keyword = params.name.toLowerCase();
      filteredItems = filteredItems.filter(i => 
        i.name.toLowerCase().includes(keyword) || 
        (i.description && i.description.toLowerCase().includes(keyword))
      );
    }
    
    // 按类型过滤
    if (params?.type) {
      filteredItems = filteredItems.filter(i => i.type === params.type);
    }
    
    // 按状态过滤
    if (params?.status) {
      filteredItems = filteredItems.filter(i => i.status === params.status);
    }
    
    // 转换成前端期望的格式
    const mappedItems = filteredItems.map(item => {
      // 确定正确的集成类型
      let integrationType = item.type;
      if (item.type === 'REST') {
        integrationType = 'TABLE';
      } else if (item.type === 'GraphQL') {
        integrationType = 'CHART';
      }
      
      // 根据ID确定固定的dataSourceId和queryId
      const dataSourceId = item.id === 'integration-1' ? 'ds-1' : 
                          (item.id === 'integration-2' ? 'ds-2' : 'ds-3');
      const queryId = item.id === 'integration-1' ? 'query-1' : 
                     (item.id === 'integration-2' ? 'query-2' : 'query-3');
      
      return {
        id: item.id,
        name: item.name,
        description: item.description || '',
        queryId: queryId,
        type: integrationType,
        dataSourceId: dataSourceId,
        status: item.status || 'ACTIVE',
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString(),
        config: {
          tableConfig: {
            columns: [
              { key: 'id', dataIndex: 'id', title: 'ID' },
              { key: 'name', dataIndex: 'name', title: '名称' },
              { key: 'status', dataIndex: 'status', title: '状态' },
              { key: 'createdAt', dataIndex: 'createdAt', title: '创建时间' }
            ]
          }
        },
        datasource: {
          id: dataSourceId,
          name: dataSourceId === 'ds-1' ? 'MySQL示例数据库' : 
                (dataSourceId === 'ds-2' ? 'PostgreSQL生产库' : 'SQLite本地库'),
          type: dataSourceId === 'ds-1' ? 'mysql' : 
                (dataSourceId === 'ds-2' ? 'postgresql' : 'sqlite')
        }
      };
    });
    
    console.log('[Mock集成服务] 返回转换后的集成数据:', mappedItems.length, '条');
    if (mappedItems.length > 0) {
      console.log('[Mock集成服务] 第一条数据结构:', JSON.stringify(mappedItems[0]).substring(0, 300) + '...');
    }
    
    // 应用分页
    const start = (page - 1) * size;
    const end = Math.min(start + size, mappedItems.length);
    const paginatedItems = mappedItems.slice(start, end);
    
    console.log('[Mock中间件] 获取到集成列表数据: 数组(' + paginatedItems.length + '条)');
    if (paginatedItems.length > 0) {
      console.log('[Mock中间件] 第一条数据样例:', JSON.stringify(paginatedItems[0]).substring(0, 300) + '...');
    }
    console.log('[Mock中间件] 返回集成列表响应: 数组(' + paginatedItems.length + '条) 内容示例:', 
                JSON.stringify(paginatedItems[0]).substring(0, 100));
    
    // 返回结果 - 这里直接返回数组，因为API预期是直接返回数组而不是分页对象
    return paginatedItems;
  }
};

// 添加兼容旧API的导出
export const getMockIntegrations = integrationService.getMockIntegrations;
export const getMockIntegration = integrationService.getMockIntegration;
export const createMockIntegration = integrationService.createMockIntegration;
export const updateMockIntegration = integrationService.updateMockIntegration;
export const deleteMockIntegration = integrationService.deleteMockIntegration;
export const executeMockQuery = integrationService.executeMockQuery;

export default integrationService;