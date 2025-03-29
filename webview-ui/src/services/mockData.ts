import type { Integration } from '@/types/integration';
import { ColumnAlign, FormComponentType } from '@/types/integration';
import { ChartType, ChartTheme, ColumnDisplayType } from '@/types/integration';
import { validateQueryParams, validateTableConfig, validateChartConfig } from '@/utils/typeMapping';
import { transformApiIntegrationToFrontend, transformFrontendIntegrationToApi } from '@/utils/apiTransformer';

// 扩展 Window 接口以支持我们的全局状态标记
declare global {
  interface Window {
    MOCK_INTEGRATIONS_INITIALIZED?: boolean;
  }
}

// 生成随机ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// 生成随机日期
const generateDate = (start: Date = new Date(2023, 0, 1), end: Date = new Date()): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString();
};

// 默认模拟集成数据
const defaultMockIntegrations: Integration[] = [
  // ... 其他集成配置 ...
  {
    id: 'int-004',
    name: '销售趋势图表',
    description: '展示销售数据趋势的可视化图表',
    type: 'CHART',
    status: 'ACTIVE',
    queryId: 'query-004',
    queryParams: [
      {
        name: 'startDate',
        type: 'date',
        format: 'date',
        formType: 'date',
        required: true,
        defaultValue: '2023-01-01',
        description: '查询开始日期',
        displayOrder: 0
      },
      {
        name: 'endDate',
        type: 'date',
        format: 'date',
        formType: 'date',
        required: true,
        defaultValue: '2023-12-31',
        description: '查询结束日期',
        displayOrder: 1
      },
      {
        name: 'timeGranularity',
        type: 'string',
        format: 'enum',
        formType: 'select',
        required: false,
        defaultValue: 'month',
        description: '时间粒度',
        displayOrder: 2,
        options: [
          { label: '按日', value: 'day' },
          { label: '按周', value: 'week' },
          { label: '按月', value: 'month' },
          { label: '按季度', value: 'quarter' },
          { label: '按年', value: 'year' }
        ]
      }
    ],
    chartConfig: {
      type: ChartType.BAR,
      title: '月度销售趋势',
      description: '展示各月份销售额和利润数据',
      height: 400,
      showLegend: true,
      animation: true,
      theme: ChartTheme.DEFAULT,
      dataMapping: {
        xField: 'month',
        yField: 'sales',
        valueField: 'value',
        categoryField: 'category'
      }
    },
    integrationPoint: {
      id: 'ip-004',
      name: '销售统计API',
      type: 'URL',
      urlConfig: {
        url: 'https://api.example.com/sales/stats',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'mock-api-key'
        }
      }
    },
    createTime: generateDate(new Date(2023, 5, 5)),
    updateTime: generateDate(new Date(2023, 8, 15))
  }
];

// 保存模拟集成到localStorage
export const saveMockIntegrationsToStorage = (integrations: Integration[]): void => {
  try {
    console.log('[DEBUG] Saving integrations to localStorage, count:', integrations.length);
    localStorage.setItem('mockIntegrations', JSON.stringify(integrations));
  } catch (error) {
    console.error('保存模拟集成到localStorage失败', error);
  }
};

// 从localStorage加载模拟集成
export const loadMockIntegrationsFromStorage = (): Integration[] => {
  try {
    const stored = localStorage.getItem('mockIntegrations');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('从localStorage加载模拟集成失败', error);
  }
  return [...defaultMockIntegrations];
};

// 初始化模拟数据
const mockIntegrations = loadMockIntegrationsFromStorage();

// 获取模拟集成列表
export const getMockIntegrations = async (): Promise<Integration[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockIntegrations]);
    }, 600);
  });
};

// 获取单个模拟集成
export const getMockIntegration = async (id: string): Promise<Integration | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const integration = mockIntegrations.find(item => item.id === id);
      resolve(integration || null);
    }, 600);
  });
};

// 创建模拟集成
export const createMockIntegration = async (integration: Partial<Integration>): Promise<Integration> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newIntegration: Integration = {
        id: `int-${generateId()}`,
        name: integration.name || '',
        description: integration.description || '',
        type: integration.type || 'TABLE',
        status: integration.status || 'DRAFT',
        queryId: integration.queryId || '',
        queryParams: validateQueryParams(integration.queryParams || []),
        formConfig: integration.formConfig,
        tableConfig: integration.tableConfig,
        chartConfig: integration.chartConfig,
        integrationPoint: integration.integrationPoint || {
          id: `ip-${generateId()}`,
          name: '',
          type: 'URL',
          urlConfig: {
            url: '',
            method: 'GET',
            headers: {}
          }
        },
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
      };
      
      mockIntegrations.push(newIntegration);
      saveMockIntegrationsToStorage(mockIntegrations);
      resolve(newIntegration);
    }, 600);
  });
};

// 更新模拟集成
export const updateMockIntegration = async (id: string, integration: Partial<Integration>): Promise<Integration | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockIntegrations.findIndex(item => item.id === id);
      if (index !== -1) {
        const updatedIntegration = {
          ...mockIntegrations[index],
          ...integration,
          updateTime: new Date().toISOString()
        };
        mockIntegrations[index] = updatedIntegration;
        saveMockIntegrationsToStorage(mockIntegrations);
        resolve(updatedIntegration);
      } else {
        resolve(null);
      }
    }, 600);
  });
};

// 删除模拟集成
export const deleteMockIntegration = async (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockIntegrations.findIndex(item => item.id === id);
      if (index !== -1) {
        mockIntegrations.splice(index, 1);
        saveMockIntegrationsToStorage(mockIntegrations);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 600);
  });
};

// 模拟执行查询
export const executeMockQuery = async (queryId: string, params: Record<string, any>): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let results: any[] = [];
      
      // 根据queryId返回不同的模拟数据
      switch (queryId) {
        case 'query-004': {
          // 根据图表类型返回不同格式的数据
          const chartType = params?.type?.toLowerCase() || 'bar';
          
          if (chartType === 'bar' || chartType === 'line') {
            results = [
              { month: '1月', sales: 150000, profit: 50000 },
              { month: '2月', sales: 200000, profit: 80000 },
              { month: '3月', sales: 180000, profit: 70000 },
              { month: '4月', sales: 220000, profit: 90000 },
              { month: '5月', sales: 250000, profit: 110000 },
              { month: '6月', sales: 280000, profit: 120000 }
            ];
          } else if (chartType === 'pie') {
            results = [
              { category: '电子产品', value: 450000 },
              { category: '家用电器', value: 250000 },
              { category: '日用品', value: 150000 },
              { category: '食品', value: 100000 },
              { category: '其他', value: 50000 }
            ];
          } else if (chartType === 'scatter') {
            results = [
              { x: 100, y: 80, size: 20, category: 'A' },
              { x: 150, y: 130, size: 40, category: 'A' },
              { x: 200, y: 160, size: 25, category: 'B' },
              { x: 250, y: 220, size: 35, category: 'B' },
              { x: 300, y: 180, size: 45, category: 'C' },
              { x: 350, y: 300, size: 30, category: 'C' },
              { x: 400, y: 320, size: 50, category: 'D' },
              { x: 450, y: 360, size: 15, category: 'D' }
            ];
          }
          break;
        }
        // ... 其他查询处理 ...
      }
      
      console.log('查询结果:', {
        queryId,
        params,
        resultCount: results.length,
        firstResult: results[0]
      });
      
      resolve(results);
    }, 600);
  });
};