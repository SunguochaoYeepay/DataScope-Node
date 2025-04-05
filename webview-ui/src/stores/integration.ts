import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Integration, IntegrationQuery } from '@/types/integration';
// 删除对已删除的api服务的引用
// import { api } from '@/services/api';
import {
  getMockIntegrations,
  getMockIntegration,
  createMockIntegration,
  updateMockIntegration,
  deleteMockIntegration,
  executeMockQuery
} from '@/services/mockData';

// 是否使用模拟数据
const USE_MOCK = true; // 始终使用模拟数据，因为api服务已被删除

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
        // 使用fetch API替代api服务
        const response = await fetch('/api/low-code/apis');
        if (!response.ok) {
          throw new Error(`API请求失败: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('[集成Store] 获取到集成数据:', result);
        
        // 处理不同格式的响应
        if (Array.isArray(result)) {
          // 直接是数组 - 这是我们现在的API格式
          console.log('[集成Store] 收到数组格式数据, 长度:', result.length);
          integrations.value = result;
          return result;
        } else if (result && result.data) {
          // 包装在data字段中 - 之前的API格式
          console.log('[集成Store] 收到对象格式数据, 数据长度:', Array.isArray(result.data) ? result.data.length : '非数组');
          integrations.value = result.data;
          return result.data;
        } else {
          // 未知格式，记录日志并返回空数组
          console.error('[集成Store] 未知的API响应格式:', result);
          integrations.value = [];
          return [];
        }
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
      console.log('[集成Store] 开始获取单个集成, ID:', id);
      
      if (USE_MOCK) {
        // 使用模拟数据
        const result = await getMockIntegration(id);
        if (result) {
          currentIntegration.value = result;
          console.log('[集成Store] Mock模式 - 获取到集成数据:', result);
        }
        return result;
      } else {
        // 使用fetch API替代api服务
        const response = await fetch(`/api/low-code/apis/${id}`);
        if (!response.ok) {
          throw new Error(`API请求失败: ${response.status}`);
        }
        
        const responseData = await response.json();
        console.log('[集成Store] 获取到单个集成原始数据:', responseData);
        
        let result = null;
        // 处理不同格式的响应
        if (responseData && typeof responseData === 'object' && !Array.isArray(responseData)) {
          // 直接是对象 - 这是我们当前的API格式
          if (responseData.id && responseData.name) {
            console.log('[集成Store] 收到对象格式数据(直接是集成对象)');
            result = responseData;
            
            // 检查并确保集成对象包含必要字段
            if (!result.dataSourceId && result.config && result.config.dataSourceId) {
              console.log('[集成Store] 从config中提取dataSourceId:', result.config.dataSourceId);
              result.dataSourceId = result.config.dataSourceId;
            }
            
            if (!result.queryId && result.config && result.config.queryId) {
              console.log('[集成Store] 从config中提取queryId:', result.config.queryId);
              result.queryId = result.config.queryId;
            }
          }
        } 
        
        if (!result && responseData && responseData.data) {
          // 包装在data字段中 - 之前的API格式
          console.log('[集成Store] 收到对象格式数据(包装在data字段中)');
          result = responseData.data;
          
          // 检查并确保集成对象包含必要字段
          if (!result.dataSourceId && result.config && result.config.dataSourceId) {
            console.log('[集成Store] 从包装数据的config中提取dataSourceId:', result.config.dataSourceId);
            result.dataSourceId = result.config.dataSourceId;
          }
          
          if (!result.queryId && result.config && result.config.queryId) {
            console.log('[集成Store] 从包装数据的config中提取queryId:', result.config.queryId);
            result.queryId = result.config.queryId;
          }
        } 
        
        if (!result) {
          // 其他格式的响应
          console.error('[集成Store] 未知的单个集成API响应格式:', responseData);
          return null;
        }
        
        // 打印关键字段
        console.log(`[集成Store] 处理后的集成数据: ID=${result.id}, 名称=${result.name}, 数据源=${result.dataSourceId}, 查询=${result.queryId}`);
        
        currentIntegration.value = result;
        return result;
      }
    } catch (err: any) {
      console.error('[集成Store] 获取集成失败', err);
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
        // 使用fetch API替代api服务
        const response = await fetch('/api/low-code/apis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(integration)
        });
        
        if (!response.ok) {
          throw new Error(`API请求失败: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result && result.data) {
          // 更新本地数据
          integrations.value.push(result.data);
          currentIntegration.value = result.data;
          return result.data;
        } else if (result) {
          // 直接返回结果
          integrations.value.push(result);
          currentIntegration.value = result;
          return result;
        }
        
        return null;
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
        
        // 如果当前正在查看这个集成，更新currentIntegration
        if (currentIntegration.value && currentIntegration.value.id === id) {
          currentIntegration.value = result;
        }
        
        return result;
      } else {
        // 使用fetch API替代api服务
        const response = await fetch(`/api/low-code/apis/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(integration)
        });
        
        if (!response.ok) {
          throw new Error(`API请求失败: ${response.status}`);
        }
        
        const result = await response.json();
        
        let updatedIntegration = null;
        if (result && result.data) {
          updatedIntegration = result.data;
        } else if (result && typeof result === 'object') {
          updatedIntegration = result;
        }
        
        if (updatedIntegration) {
          // 更新本地数据
          const index = integrations.value.findIndex(item => item.id === id);
          if (index !== -1) {
            integrations.value[index] = updatedIntegration;
          }
          
          // 如果当前正在查看这个集成，更新currentIntegration
          if (currentIntegration.value && currentIntegration.value.id === id) {
            currentIntegration.value = updatedIntegration;
          }
        }
        
        return updatedIntegration;
      }
    } catch (err: any) {
      console.error('更新集成失败', err);
      error.value = err.message || '更新集成失败';
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
        await deleteMockIntegration(id);
        
        // 更新本地数据
        integrations.value = integrations.value.filter(item => item.id !== id);
        
        // 如果当前正在查看这个集成，清空currentIntegration
        if (currentIntegration.value && currentIntegration.value.id === id) {
          currentIntegration.value = null;
        }
        
        return true;
      } else {
        // 使用fetch API替代api服务
        const response = await fetch(`/api/low-code/apis/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error(`API请求失败: ${response.status}`);
        }
        
        // 更新本地数据
        integrations.value = integrations.value.filter(item => item.id !== id);
        
        // 如果当前正在查看这个集成，清空currentIntegration
        if (currentIntegration.value && currentIntegration.value.id === id) {
          currentIntegration.value = null;
        }
        
        return true;
      }
    } catch (err: any) {
      console.error('删除集成失败', err);
      error.value = err.message || '删除集成失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // 执行集成查询
  const executeIntegrationQuery = async (queryInfo: IntegrationQuery) => {
    loading.value = true;
    error.value = null;
    
    try {
      if (USE_MOCK) {
        // 使用模拟数据
        const result = await executeMockQuery(queryInfo);
        return result;
      } else {
        // 使用fetch API替代api服务
        const response = await fetch('/api/low-code/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(queryInfo)
        });
        
        if (!response.ok) {
          throw new Error(`API请求失败: ${response.status}`);
        }
        
        const result = await response.json();
        return result.data || result;
      }
    } catch (err: any) {
      console.error('执行集成查询失败', err);
      error.value = err.message || '执行集成查询失败';
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
      if (USE_MOCK) {
        // 在模拟数据模式下，使用更新集成的方法
        return await updateIntegration(id, { status } as Partial<Integration>);
      } else {
        // 使用fetch API替代api服务
        const response = await fetch(`/api/low-code/apis/${id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status })
        });
        
        if (!response.ok) {
          throw new Error(`API请求失败: ${response.status}`);
        }
        
        const result = await response.json();
        
        // 更新本地数据
        const index = integrations.value.findIndex(item => item.id === id);
        if (index !== -1) {
          integrations.value[index].status = status;
        }
        
        // 如果当前正在查看这个集成，更新currentIntegration
        if (currentIntegration.value && currentIntegration.value.id === id) {
          currentIntegration.value.status = status;
        }
        
        return result.data || result;
      }
    } catch (err: any) {
      console.error('更新集成状态失败', err);
      error.value = err.message || '更新集成状态失败';
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
      const result = await fetch(`/api/low-code/apis/${id}/config`);
      if (!result.ok) {
        throw new Error(`API请求失败: ${result.status}`);
      }
      return await result.json();
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
    
    // 方法
    fetchIntegrations,
    fetchIntegrationById,
    createIntegration,
    updateIntegration,
    deleteIntegration,
    executeIntegrationQuery,
    updateIntegrationStatus,
    getIntegrationConfig,
    
    // 工具方法
    filterByType,
    filterByStatus,
    searchIntegrations
  };
});