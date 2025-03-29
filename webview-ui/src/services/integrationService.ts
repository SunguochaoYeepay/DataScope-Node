/**
 * 集成服务
 * 提供与后端集成API的交互
 */
import type { IntegrationConfig, ApiConfig } from '@/types/integration';
import { http } from '@/utils/http';

/**
 * 集成服务
 */
export const integrationService = {
  /**
   * 获取所有集成配置
   */
  getIntegrations: async (): Promise<IntegrationConfig[]> => {
    const response = await http.get('/api/v1/low-code/apis');
    return response.data || [];
  },
  
  /**
   * 获取集成配置详情
   * @param id 集成配置ID
   */
  getIntegrationById: async (id: string): Promise<IntegrationConfig> => {
    const response = await http.get(`/api/v1/low-code/apis/${id}`);
    return response.data;
  },
  
  /**
   * 创建集成配置
   * @param data 集成配置数据
   */
  createIntegration: async (data: Partial<IntegrationConfig>): Promise<IntegrationConfig> => {
    const response = await http.post('/api/v1/low-code/apis', data);
    return response.data;
  },
  
  /**
   * 更新集成配置
   * @param id 集成配置ID
   * @param data 更新数据
   */
  updateIntegration: async (id: string, data: Partial<IntegrationConfig>): Promise<IntegrationConfig> => {
    const response = await http.put(`/api/v1/low-code/apis/${id}`, data);
    return response.data;
  },
  
  /**
   * 删除集成配置
   * @param id 集成配置ID
   */
  deleteIntegration: async (id: string): Promise<void> => {
    await http.delete(`/api/v1/low-code/apis/${id}`);
  },
  
  /**
   * 获取API配置
   * @param id 集成配置ID
   */
  getIntegrationConfig: async (id: string): Promise<ApiConfig> => {
    const response = await http.get(`/api/v1/low-code/apis/${id}/config`);
    return response.data;
  },
  
  /**
   * 测试集成
   * @param id 集成配置ID
   * @param params 测试参数
   */
  testIntegration: async (id: string, params: any): Promise<any> => {
    const response = await http.post(`/api/v1/low-code/apis/${id}/test`, params);
    return response.data;
  }
};