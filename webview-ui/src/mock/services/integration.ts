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
   * 获取集成列表
   */
  async getIntegrations(params?: any): Promise<any> {
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
  }
};

export default integrationService;