import { defineStore } from 'pinia';
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import type { QueryServiceStatus } from '@/services/queryStatus';
import { getApiBaseUrl } from '@/services/query';

// 查询服务状态信息
export interface QueryStatusInfo {
  queryId: string;
  status: QueryServiceStatus;
  disabledReason?: string;
  disabledAt?: string;
  disabledBy?: string;
}

export const useQueryStatusStore = defineStore('queryStatus', () => {
  // 状态
  const queryStatusMap = ref<Map<string, QueryStatusInfo>>(new Map());
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  // 获取查询状态
  const getQueryStatus = async (queryId: string): Promise<QueryStatusInfo | null> => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // 检查缓存中是否已有数据
      if (queryStatusMap.value.has(queryId)) {
        return queryStatusMap.value.get(queryId) || null;
      }
      
      // 从API获取状态
      const response = await fetch(`${getApiBaseUrl()}/api/queries/${queryId}/status`);
      
      if (!response.ok) {
        throw new Error(`获取查询状态失败: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // 确保有正确的响应格式
      if (!data || !data.success) {
        throw new Error(data?.error?.message || '获取查询状态失败：响应格式无效');
      }
      
      const statusInfo: QueryStatusInfo = {
        queryId,
        status: data.data.status || 'ENABLED',
        disabledReason: data.data.disabledReason,
        disabledAt: data.data.disabledAt,
        disabledBy: data.data.disabledBy
      };
      
      // 更新状态缓存
      queryStatusMap.value.set(queryId, statusInfo);
      
      return statusInfo;
    } catch (err) {
      console.error('获取查询状态失败:', err);
      error.value = err instanceof Error ? err : new Error(String(err));
      message.error(`获取查询状态失败: ${error.value.message}`);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // 启用查询服务
  const enableQueryService = async (queryId: string): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/queries/${queryId}/enable`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`启用查询服务失败: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data || !data.success) {
        throw new Error(data?.error?.message || '启用查询服务失败');
      }
      
      // 更新本地状态
      if (queryStatusMap.value.has(queryId)) {
        const currentStatus = queryStatusMap.value.get(queryId);
        if (currentStatus) {
          queryStatusMap.value.set(queryId, {
            ...currentStatus,
            status: 'ENABLED',
            disabledReason: undefined,
            disabledAt: undefined,
            disabledBy: undefined
          });
        }
      }
      
      message.success('查询服务已启用');
      return true;
    } catch (err) {
      console.error('启用查询服务失败:', err);
      error.value = err instanceof Error ? err : new Error(String(err));
      message.error(`启用查询服务失败: ${error.value.message}`);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // 禁用查询服务
  const disableQueryService = async (queryId: string, reason: string): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/queries/${queryId}/disable`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });
      
      if (!response.ok) {
        throw new Error(`禁用查询服务失败: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data || !data.success) {
        throw new Error(data?.error?.message || '禁用查询服务失败');
      }
      
      // 更新本地状态
      if (queryStatusMap.value.has(queryId)) {
        const currentStatus = queryStatusMap.value.get(queryId);
        if (currentStatus) {
          queryStatusMap.value.set(queryId, {
            ...currentStatus,
            status: 'DISABLED',
            disabledReason: reason,
            disabledAt: new Date().toISOString(),
            disabledBy: 'current-user' // 实际应用中应使用当前用户ID
          });
        }
      }
      
      message.success('查询服务已禁用');
      return true;
    } catch (err) {
      console.error('禁用查询服务失败:', err);
      error.value = err instanceof Error ? err : new Error(String(err));
      message.error(`禁用查询服务失败: ${error.value.message}`);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    queryStatusMap,
    isLoading,
    error,
    getQueryStatus,
    enableQueryService,
    disableQueryService
  };
}); 