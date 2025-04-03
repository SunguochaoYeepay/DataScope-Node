import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Integration } from '@/types/integration';
import { api } from '@/services/api';

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
      // 调用接口获取集成列表
      const result = await api.get('/api/integrations');
      
      if (result && result.data) {
        integrations.value = result.data;
      }
      
      return result.data;
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
      // 调用接口获取单个集成
      const result = await api.get(`/api/integrations/${id}`);
      
      if (result && result.data) {
        currentIntegration.value = result.data;
      }
      
      return result.data;
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
      // 调用接口创建集成
      const result = await api.post('/api/integrations', integration);
      
      if (result && result.data) {
        // 更新本地数据
        integrations.value.push(result.data);
        currentIntegration.value = result.data;
      }
      
      return result.data;
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
      // 调用接口更新集成
      const result = await api.put(`/api/integrations/${id}`, integration);
      
      if (result && result.data) {
        // 更新本地数据
        const index = integrations.value.findIndex(item => item.id === id);
        if (index !== -1) {
          integrations.value[index] = result.data;
        }
        
        currentIntegration.value = result.data;
      }
      
      return result.data;
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
      const result = await api.patch(`/api/integrations/${id}/status`, { status });
      
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
      // 调用接口删除集成
      await api.delete(`/api/integrations/${id}`);
      
      // 更新本地数据
      integrations.value = integrations.value.filter(item => item.id !== id);
      
      if (currentIntegration.value && currentIntegration.value.id === id) {
        currentIntegration.value = null;
      }
      
      return true;
    } catch (err: any) {
      console.error('删除集成失败', err);
      error.value = err.message || '删除集成失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // 执行查询
  const executeQuery = async (queryId: string, params: any) => {
    loading.value = true;
    error.value = null;
    
    try {
      // 调用接口执行查询
      const result = await api.post(`/api/queries/${queryId}/execute`, params);
      return result.data;
    } catch (err: any) {
      console.error('执行查询失败', err);
      error.value = err.message || '执行查询失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // 调用URL集成点
  const callUrlIntegrationPoint = async (url: string, method: string, data: any, headers: Record<string, string> = {}) => {
    loading.value = true;
    error.value = null;
    
    try {
      // 根据method选择对应的api方法
      let result;
      switch (method.toLowerCase()) {
        case 'get':
          result = await api.get(url, { headers });
          break;
        case 'post':
          result = await api.post(url, data, { headers });
          break;
        case 'put':
          result = await api.put(url, data, { headers });
          break;
        case 'patch':
          result = await api.patch(url, data, { headers });
          break;
        case 'delete':
          result = await api.delete(url, { headers });
          break;
        default:
          throw new Error(`不支持的HTTP方法: ${method}`);
      }
      
      return result.data;
    } catch (err: any) {
      console.error('调用URL集成点失败', err);
      error.value = err.message || '调用URL集成点失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // 调用表单提交集成点
  const callFormSubmitIntegrationPoint = async (formId: string, action: string, data: any) => {
    loading.value = true;
    error.value = null;
    
    try {
      const result = await api.post(`/api/forms/${formId}/${action}`, data);
      return result.data;
    } catch (err: any) {
      console.error('调用表单提交集成点失败', err);
      error.value = err.message || '调用表单提交集成点失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  return {
    // 状态
    integrations,
    currentIntegration,
    loading,
    error,
    
    // 方法
    fetchIntegrations,
    fetchIntegrationById,
    createIntegration,
    updateIntegration,
    updateIntegrationStatus,
    deleteIntegration,
    executeQuery,
    callUrlIntegrationPoint,
    callFormSubmitIntegrationPoint
  };
});