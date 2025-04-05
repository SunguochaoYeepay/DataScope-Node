import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Integration, IntegrationQuery, ChartConfig } from '@/types/integration';
import { ChartType, ChartTheme, ColumnAlign } from '@/types/integration';
import type { IntegrationConfig } from '@/types/integration/api-models';
import { integrationService } from '@/services/integrationService';

// 直接定义IntegrationStatus类型而不是导入
type IntegrationStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE';

// 是否使用模拟数据 - 根据环境变量决定
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

// API基础URL从环境变量获取
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// 日志开关-判断mock状态
console.log(`[集成Store] 初始化，MOCK模式: ${USE_MOCK ? '启用' : '禁用'}, API地址: ${API_BASE_URL}`);

export const useIntegrationStore = defineStore('integration', () => {
  // 状态
  const integrations = ref<Integration[]>([]);
  const currentIntegration = ref<Integration | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  // 转换API响应到Integration类型
  const convertToIntegration = (data: IntegrationConfig): Integration => {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      type: data.type,
      status: data.status,
      queryId: data.queryId,
      dataSourceId: data.query?.dataSourceId,
      formConfig: data.config?.formConfig ? {
        layout: 'vertical',
        conditions: data.config.formConfig.fields.map(field => ({
          field: field.name,
          label: field.label,
          type: field.type as any,
          required: field.required,
          displayOrder: 0,
          visibility: 'visible'
        })),
        buttons: []
      } : undefined,
      tableConfig: data.config?.tableConfig ? {
        columns: data.config.tableConfig.columns.map(col => ({
          field: col.dataIndex,
          label: col.title,
          type: 'text',
          sortable: true,
          filterable: true,
          align: ColumnAlign.LEFT,
          visible: true,
          displayOrder: 0
        })),
        actions: [],
        pagination: {
          enabled: true,
          pageSize: 10,
          pageSizeOptions: [10, 20, 50]
        },
        export: {
          enabled: false,
          formats: [],
          maxRows: 1000
        },
        batchActions: [],
        aggregation: {
          enabled: false,
          groupByFields: [],
          aggregationFunctions: []
        },
        advancedFilters: {
          enabled: false,
          defaultFilters: [],
          savedFilters: []
        }
      } : undefined,
      chartConfig: data.config?.chartConfig ? {
        type: ChartType.LINE,
        title: data.config.chartConfig.type || '',
        description: '',
        theme: ChartTheme.LIGHT,
        height: 400,
        showLegend: true,
        animation: true,
        dataMapping: {
          xField: '',
          yField: '',
          seriesField: '',
          valueField: ''
        },
        styleOptions: {
          colors: [],
          backgroundColor: '#fff',
          fontFamily: 'Arial',
          borderRadius: 4,
          padding: [20, 20, 20, 20]
        },
        interactions: {
          enableZoom: false,
          enablePan: false,
          enableSelect: true,
          tooltipMode: 'single'
        }
      } : undefined,
      integrationPoint: {
        id: data.id,
        name: data.name,
        type: 'URL',
        urlConfig: {
          url: `${API_BASE_URL}/low-code/apis/${data.id}/query`,
          method: 'POST',
          headers: {}
        }
      },
      createTime: data.createdAt,
      updateTime: data.updatedAt
    };
  };

  // 获取集成列表
  const fetchIntegrations = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      if (USE_MOCK) {
        // 使用模拟数据
        console.log('[集成Store] 使用模拟数据获取集成列表');
        
        // 新增：尝试直接使用fetch
        try {
          console.log('[集成Store] DEBUG: 尝试直接使用fetch请求');
          const rawResponse = await fetch('/api/low-code/apis');
          
          if (!rawResponse.ok) {
            console.error('[集成Store] DEBUG: fetch请求失败, 状态码:', rawResponse.status);
          } else {
            console.log('[集成Store] DEBUG: fetch请求成功, 状态码:', rawResponse.status);
            
            try {
              // 使用clone以便可以多次读取
              const textResponse = await rawResponse.clone().text();
              console.log('[集成Store] DEBUG: fetch原始响应文本:', textResponse.substring(0, 500));
              
              if (textResponse.trim() === '') {
                console.error('[集成Store] DEBUG: fetch响应文本为空');
              } else {
                const jsonResponse = await rawResponse.json();
                console.log('[集成Store] DEBUG: fetch响应JSON:', 
                  Array.isArray(jsonResponse) ? `数组(${jsonResponse.length}条)` : 
                  typeof jsonResponse, 
                  JSON.stringify(jsonResponse).substring(0, 500)
                );
                
                // 如果直接fetch成功获取数据，使用这些数据
                if (Array.isArray(jsonResponse) && jsonResponse.length > 0) {
                  console.log('[集成Store] DEBUG: 使用直接fetch获取的数据');
                  const convertedData = jsonResponse.map(convertToIntegration);
                  integrations.value = convertedData;
                  return integrations.value;
                }
              }
            } catch (parseError) {
              console.error('[集成Store] DEBUG: 解析fetch响应失败:', parseError);
            }
          }
        } catch (fetchError) {
          console.error('[集成Store] DEBUG: 直接fetch请求失败:', fetchError);
        }
        
        // 如果fetch失败，回退到使用HTTP服务
        console.log('[集成Store] 回退到使用HTTP服务');
        const result = await integrationService.getIntegrations();
        
        // 打印原始响应结果
        console.log('[集成Store] Mock API原始响应:', JSON.stringify(result).substring(0, 500));
        
        // 处理不同的响应格式
        let integrationData: any[] = [];
        
        if (Array.isArray(result)) {
          console.log('[集成Store] Mock - 收到数组格式数据, 长度:', result.length);
          integrationData = result;
        } else if (result && typeof result === 'object') {
          const resultObj = result as Record<string, any>;
          if (resultObj.items && Array.isArray(resultObj.items)) {
            console.log('[集成Store] Mock - 收到带items的对象格式数据');
            integrationData = resultObj.items;
          } else if (resultObj.data && Array.isArray(resultObj.data)) {
            console.log('[集成Store] Mock - 收到带data的对象格式数据');
            integrationData = resultObj.data;
          } else {
            console.warn('[集成Store] Mock - 未知的响应格式:', result);
          }
        } else {
          console.warn('[集成Store] Mock - 未知的响应格式:', result);
        }
        
        // 打印API数据处理结果
        console.log('[集成Store] 处理后的集成数据:', JSON.stringify(integrationData).substring(0, 500));
        
        // 开始转换数据
        console.log('[集成Store] 开始转换数据到Integration类型, 数据条数:', integrationData.length);
        const convertedData = integrationData.map((item, index) => {
          console.log(`[集成Store] 转换第${index+1}项:`, item.id, item.name, item.type);
          return convertToIntegration(item);
        });
        
        // 转换并保存数据
        integrations.value = convertedData;
        console.log('[集成Store] 最终集成数据:', JSON.stringify(integrations.value).substring(0, 500));
        return integrations.value;
      } else {
        // 使用fetch API请求真实后端
        console.log('[集成Store] 使用API请求获取集成列表');
        const response = await fetch(`${API_BASE_URL}/low-code/apis`);
        if (!response.ok) {
          throw new Error(`API请求失败: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('[集成Store] 获取到集成数据:', result);
        
        // 处理不同格式的响应
        if (Array.isArray(result)) {
          // 直接是数组 - 这是我们现在的API格式
          console.log('[集成Store] 收到数组格式数据, 长度:', result.length);
          integrations.value = result.map(convertToIntegration);
          return integrations.value;
        } else if (result && result.data) {
          // 包装在data字段中 - 之前的API格式
          console.log('[集成Store] 收到对象格式数据, 数据长度:', Array.isArray(result.data) ? result.data.length : '非数组');
          integrations.value = result.data.map(convertToIntegration);
          return integrations.value;
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
      
      // 如果在出错的情况下，我们仍然有数据，不应该丢失这些数据
      // 返回当前的集成列表，而不是抛出异常
      if (integrations.value.length > 0) {
        console.warn('[集成Store] 虽然请求发生错误，但仍然保留现有数据');
        return integrations.value;
      }
      
      // 只有在真的没有数据的情况下才返回空数组
      return [];
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
        const result = await integrationService.getIntegrationById(id);
        if (result) {
          const converted = convertToIntegration(result);
          currentIntegration.value = converted;
          console.log('[集成Store] Mock模式 - 获取到集成数据:', converted);
          return converted;
        }
        return null;
      } else {
        // 使用fetch API替代api服务
        const response = await fetch(`${API_BASE_URL}/low-code/apis/${id}`);
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
            result = convertToIntegration(responseData);
          }
        }
        
        if (!result && responseData && responseData.data) {
          // 包装在data字段中 - 之前的API格式
          console.log('[集成Store] 收到对象格式数据(包装在data字段中)');
          result = convertToIntegration(responseData.data);
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
        const result = await integrationService.createIntegration(integration as Partial<IntegrationConfig>);
        const converted = convertToIntegration(result);
        integrations.value.push(converted);
        return converted;
      } else {
        // 使用fetch API替代api服务
        const response = await fetch(`${API_BASE_URL}/low-code/apis`, {
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
        const converted = convertToIntegration(result.data || result);
        integrations.value.push(converted);
        return converted;
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
        const result = await integrationService.updateIntegration(id, integration as Partial<IntegrationConfig>);
        const converted = convertToIntegration(result);
        
        // 更新本地数据
        const index = integrations.value.findIndex(item => item.id === id);
        if (index !== -1) {
          integrations.value[index] = converted;
        }
        
        // 如果当前正在查看这个集成，更新currentIntegration
        if (currentIntegration.value && currentIntegration.value.id === id) {
          currentIntegration.value = converted;
        }
        
        return converted;
      } else {
        // 使用fetch API替代api服务
        const response = await fetch(`${API_BASE_URL}/low-code/apis/${id}`, {
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
        const converted = convertToIntegration(result.data || result);
        
        // 更新本地数据
        const index = integrations.value.findIndex(item => item.id === id);
        if (index !== -1) {
          integrations.value[index] = converted;
        }
        
        // 如果当前正在查看这个集成，更新currentIntegration
        if (currentIntegration.value && currentIntegration.value.id === id) {
          currentIntegration.value = converted;
        }
        
        return converted;
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
        await integrationService.deleteIntegration(id);
        
        // 更新本地数据
        integrations.value = integrations.value.filter(item => item.id !== id);
        
        // 如果当前正在查看这个集成，清空currentIntegration
        if (currentIntegration.value && currentIntegration.value.id === id) {
          currentIntegration.value = null;
        }
        
        return true;
      } else {
        // 使用fetch API替代api服务
        const response = await fetch(`${API_BASE_URL}/low-code/apis/${id}`, {
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
        // 从当前集成或查询信息中获取ID
        const integrationId = currentIntegration.value?.id || '';
        const result = await integrationService.queryIntegration(integrationId, queryInfo);
        return result;
      } else {
        // 使用fetch API替代api服务
        const response = await fetch(`${API_BASE_URL}/low-code/query`, {
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
        const response = await fetch(`${API_BASE_URL}/low-code/apis/${id}/status`, {
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
        const converted = convertToIntegration(result.data || result);
        
        // 更新本地数据
        const index = integrations.value.findIndex(item => item.id === id);
        if (index !== -1) {
          integrations.value[index] = converted;
        }
        
        // 如果当前正在查看这个集成，更新currentIntegration
        if (currentIntegration.value && currentIntegration.value.id === id) {
          currentIntegration.value = converted;
        }
        
        return converted;
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
      const result = await fetch(`${API_BASE_URL}/low-code/apis/${id}/config`);
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