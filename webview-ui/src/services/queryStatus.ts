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

// 查询状态服务
export const queryStatusService = {
  // 获取查询服务状态
  async getQueryStatus(queryId: string): Promise<QueryStatusInfo> {
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