import { getApiBaseUrl } from './query';

// 查询服务状态类型
export type QueryServiceStatus = 'ENABLED' | 'DISABLED';

// 查询服务状态信息
export interface QueryStatusInfo {
  status: QueryServiceStatus;
  disabledReason?: string;
  disabledAt?: string;
  disabledBy?: string;
}

// 禁用查询参数
export interface DisableQueryParams {
  queryId: string;
  reason: string;
}

// 模拟API
const mockStatusApi = {
  // 获取查询服务状态
  async getQueryStatus(queryId: string): Promise<QueryStatusInfo> {
    console.log('模拟获取查询服务状态:', queryId);
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 根据查询ID模拟不同状态
    const isDisabled = queryId.includes('disabled') || Math.random() < 0.3;
    
    if (isDisabled) {
      return {
        status: 'DISABLED',
        disabledReason: '此查询服务存在性能问题，已被暂时禁用',
        disabledAt: new Date(Date.now() - 86400000).toISOString(),
        disabledBy: 'admin'
      };
    } else {
      return {
        status: 'ENABLED'
      };
    }
  },
  
  // 启用查询服务
  async enableQuery(queryId: string): Promise<QueryStatusInfo> {
    console.log('模拟启用查询服务:', queryId);
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      status: 'ENABLED'
    };
  },
  
  // 禁用查询服务
  async disableQuery(params: DisableQueryParams): Promise<QueryStatusInfo> {
    console.log('模拟禁用查询服务:', params);
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      status: 'DISABLED',
      disabledReason: params.reason,
      disabledAt: new Date().toISOString(),
      disabledBy: 'current_user'
    };
  }
};

// 使用环境变量判断是否使用模拟API
export const isUsingMockApi = () => {
  return import.meta.env.VITE_USE_MOCK_API === 'true';
};

// 查询状态服务
export const queryStatusService = {
  // 获取查询服务状态
  async getQueryStatus(queryId: string): Promise<QueryStatusInfo> {
    if (isUsingMockApi()) {
      return mockStatusApi.getQueryStatus(queryId);
    }
    
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/queries/${queryId}/status`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`获取查询服务状态失败: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      const result = responseData.data || responseData;
      
      // 转换为QueryStatusInfo格式
      return {
        status: result.status,
        disabledReason: result.disabledReason || result.disabled_reason,
        disabledAt: result.disabledAt || result.disabled_at,
        disabledBy: result.disabledBy || result.disabled_by
      };
    } catch (error) {
      console.error('获取查询服务状态错误:', error);
      throw error;
    }
  },
  
  // 启用查询服务
  async enableQuery(queryId: string): Promise<QueryStatusInfo> {
    if (isUsingMockApi()) {
      return mockStatusApi.enableQuery(queryId);
    }
    
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/queries/${queryId}/enable`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`启用查询服务失败: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      const result = responseData.data || responseData;
      
      // 转换为QueryStatusInfo格式
      return {
        status: result.status,
        disabledReason: result.disabledReason || result.disabled_reason,
        disabledAt: result.disabledAt || result.disabled_at,
        disabledBy: result.disabledBy || result.disabled_by
      };
    } catch (error) {
      console.error('启用查询服务错误:', error);
      throw error;
    }
  },
  
  // 禁用查询服务
  async disableQuery(params: DisableQueryParams): Promise<QueryStatusInfo> {
    if (isUsingMockApi()) {
      return mockStatusApi.disableQuery(params);
    }
    
    try {
      const requestBody = {
        reason: params.reason
      };
      
      const response = await fetch(`${getApiBaseUrl()}/api/queries/${params.queryId}/disable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error(`禁用查询服务失败: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      const result = responseData.data || responseData;
      
      // 转换为QueryStatusInfo格式
      return {
        status: result.status,
        disabledReason: result.disabledReason || result.disabled_reason,
        disabledAt: result.disabledAt || result.disabled_at,
        disabledBy: result.disabledBy || result.disabled_by
      };
    } catch (error) {
      console.error('禁用查询服务错误:', error);
      throw error;
    }
  },
  
  // 检查查询服务是否已启用
  async isQueryEnabled(queryId: string): Promise<boolean> {
    try {
      const statusInfo = await this.getQueryStatus(queryId);
      return statusInfo.status === 'ENABLED';
    } catch (error) {
      console.error('检查查询服务状态错误:', error);
      // 出错时默认为禁用状态，确保安全
      return false;
    }
  }
};

export default queryStatusService;