import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Integration, IntegrationQuery } from '@/types/integration';
import { api } from '@/services/api';
import {
  getMockIntegrations,
  getMockIntegration,
  createMockIntegration,
  updateMockIntegration,
  deleteMockIntegration,
  executeMockQuery
} from '@/services/mockData';

// 是否使用模拟数据
const USE_MOCK = false;

// 集成状态类型
type IntegrationStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE';

export const useIntegrationStore = defineStore('integration', () => {
  // 状态
  const integrations = ref<Integration[]>([]);
  const currentIntegration = ref<Integration | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  // 获取集成列表
  const fetchIntegrations = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      if (USE_MOCK) {
        // 使用模拟数据
        const result = await getMockIntegrations();
        integrations.value = result;
        return result;
      } else {
        // 调用接口获取集成列表
        const result = await api.get('/api/low-code/apis');
        
        if (result && result.data) {
          integrations.value = result.data;
        }
        
        return result.data;
      }
    } catch (err: any) {
      console.error('获取集成列表失败', err);
      error.value = err.message || '获取集成列表失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // 获取单个集成
  const fetchIntegrationById = async (id: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      if (USE_MOCK) {
        // 使用模拟数据
        const result = await getMockIntegration(id);
        if (result) {
          currentIntegration.value = result;
        }
        return result;
      } else {
        // 调用接口获取单个集成
        const result = await api.get(`/api/low-code/apis/${id}`);
        
        if (result && result.data) {
          currentIntegration.value = result.data;
        }
        
        return result.data;
      }
    } catch (err: any) {
      console.error('获取集成失败', err);
      error.value = err.message || '获取集成失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // 创建集成
  const createIntegration = async (integration: Partial<Integration>) => {
    loading.value = true;
    error.value = null;
    
    try {
      if (USE_MOCK) {
        // 使用模拟数据
        const result = await createMockIntegration(integration);
        integrations.value.push(result);
        currentIntegration.value = result;
        return result;
      } else {
        // 调用接口创建集成
        const result = await api.post('/api/low-code/apis', integration);
        
        if (result && result.data) {
          // 更新本地数据
          integrations.value.push(result.data);
          currentIntegration.value = result.data;
        }
        
        return result.data;
      }
    } catch (err: any) {
      console.error('创建集成失败', err);
      error.value = err.message || '创建集成失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // 更新集成
  const updateIntegration = async (id: string, integration: Partial<Integration>) => {
    loading.value = true;
    error.value = null;
    
    try {
      if (USE_MOCK) {
        // 使用模拟数据
        const result = await updateMockIntegration(id, integration);
        
        // 更新本地数据
        const index = integrations.value.findIndex(item => item.id === id);
        if (index !== -1) {
          integrations.value[index] = result;
        }
        
        currentIntegration.value = result;
        return result;
      } else {
        // 调用接口更新集成
        const result = await api.put(`/api/low-code/apis/${id}`, integration);
        
        if (result && result.data) {
          // 更新本地数据
          const index = integrations.value.findIndex(item => item.id === id);
          if (index !== -1) {
            integrations.value[index] = result.data;
          }
          
          currentIntegration.value = result.data;
        }
        
        return result.data;
      }
    } catch (err: any) {
      console.error('更新集成失败', err);
      error.value = err.message || '更新集成失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // 更新集成状态
  const updateIntegrationStatus = async (id: string, status: IntegrationStatus) => {
    loading.value = true;
    error.value = null;
    
    try {
      // 调用接口更新集成状态
      const result = await api.patch(`/api/low-code/apis/${id}/status`, { status });
      
      if (result && result.data) {
        // 更新本地数据
        const index = integrations.value.findIndex(item => item.id === id);
        if (index !== -1) {
          integrations.value[index].status = status;
        }
        
        if (currentIntegration.value && currentIntegration.value.id === id) {
          currentIntegration.value.status = status;
        }
      }
      
      return result.data;
    } catch (err: any) {
      console.error('更新集成状态失败', err);
      error.value = err.message || '更新集成状态失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // 删除集成
  const deleteIntegration = async (id: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      if (USE_MOCK) {
        // 使用模拟数据
        const result = await deleteMockIntegration(id);
        
        if (result) {
          // 更新本地数据
          integrations.value = integrations.value.filter(item => item.id !== id);
          
          if (currentIntegration.value && currentIntegration.value.id === id) {
            currentIntegration.value = null;
          }
        }
        
        return result;
      } else {
        // 调用接口删除集成
        const result = await api.delete(`/api/low-code/apis/${id}`);
        
        // 更新本地数据
        integrations.value = integrations.value.filter(item => item.id !== id);
        
        if (currentIntegration.value && currentIntegration.value.id === id) {
          currentIntegration.value = null;
        }
        
        return result.data;
      }
    } catch (err: any) {
      console.error('删除集成失败', err);
      error.value = err.message || '删除集成失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // 测试集成
  const testIntegration = async (id: string, params?: Record<string, any>) => {
    loading.value = true;
    error.value = null;
    
    try {
      // 调用测试接口
      const result = await api.post(`/api/low-code/apis/${id}/test`, params || {});
      return result.data;
    } catch (err: any) {
      console.error('测试集成失败', err);
      error.value = err.message || '测试集成失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // 执行集成查询
  const executeQuery = async (integrationId: string, params: Record<string, any> = {}): Promise<any> => {
    loading.value = true;
    error.value = null;
    
    try {
      if (USE_MOCK) {
        // 使用模拟数据
        const mockParams: IntegrationQuery = {
          sql: params.sql,
          params: params.params,
          options: params.options
        };
        const result = await executeMockQuery(integrationId, mockParams);
        return result;
      } else {
        // 调用执行接口 - 修改为正确的API路径和参数格式
        const result = await api.post(`/api/queries/execute`, {
          dataSourceId: params.dataSourceId, // 确保包含数据源ID
          queryId: integrationId,
          sql: params.sql,
          params: params.params || []
        });
        
        return result.data;
      }
    } catch (err: any) {
      console.error('执行查询失败', err);
      error.value = err.message || '执行查询失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // 获取集成配置
  const getIntegrationConfig = async (id: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      // 调用接口获取配置
      const result = await api.get(`/api/low-code/apis/${id}/config`);
      return result.data;
    } catch (err: any) {
      console.error('获取集成配置失败', err);
      error.value = err.message || '获取集成配置失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // 按类型过滤集成
  const filterByType = (type: string) => {
    return computed(() => {
      return integrations.value.filter(item => item.type === type);
    });
  };
  
  // 按状态过滤集成
  const filterByStatus = (status: IntegrationStatus) => {
    return computed(() => {
      return integrations.value.filter(item => item.status === status);
    });
  };
  
  // 搜索集成
  const searchIntegrations = (query: string) => {
    return computed(() => {
      if (!query) return integrations.value;
      
      const lowercaseQuery = query.toLowerCase();
      return integrations.value.filter(item => 
        item.name.toLowerCase().includes(lowercaseQuery) || 
        (item.description && item.description.toLowerCase().includes(lowercaseQuery))
      );
    });
  };
  
  return {
    // 状态
    integrations,
    currentIntegration,
    loading,
    error,
    
    // 操作方法
    fetchIntegrations,
    fetchIntegrationById,
    createIntegration,
    updateIntegration,
    updateIntegrationStatus,
    deleteIntegration,
    testIntegration,
    executeQuery,
    getIntegrationConfig,
    
    // 工具方法
    filterByType,
    filterByStatus,
    searchIntegrations
  };
});