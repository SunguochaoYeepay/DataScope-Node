import type { Integration, IntegrationQuery } from '@/types/integration';
import { ChartType } from '@/types/integration';

// 图表数据接口
interface ChartData {
  month: string;
  product: string;
  sales: number;
}

// 模拟集成列表数据
const mockIntegrations: Integration[] = [
  {
    id: 'int-001',
    name: '客户数据集成',
    description: '与CRM系统的客户数据集成',
    type: 'SIMPLE_TABLE',
    status: 'ACTIVE',
    queryId: 'query-001',
    dataSourceId: 'ds-001',
    integrationPoint: {
      id: 'ip-001',
      name: 'CRM API 集成点',
      type: 'URL',
      urlConfig: {
        url: 'https://api.example.com/crm',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    },
    createTime: '2023-01-15T08:30:00Z',
    updateTime: '2023-03-20T14:15:00Z'
  },
  {
    id: 'int-002',
    name: '订单系统集成',
    description: '与企业ERP系统的订单数据集成',
    type: 'TABLE',
    status: 'ACTIVE',
    queryId: 'query-002',
    dataSourceId: 'ds-002',
    integrationPoint: {
      id: 'ip-002',
      name: 'ERP API 集成点',
      type: 'URL',
      urlConfig: {
        url: 'https://erp.company.internal/api',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }
    },
    createTime: '2023-02-10T10:45:00Z',
    updateTime: '2023-04-05T16:20:00Z'
  },
  {
    id: 'int-003',
    name: '销售数据可视化',
    description: '销售数据图表分析集成',
    type: 'CHART',
    status: 'ACTIVE',
    queryId: 'query-003',
    dataSourceId: 'ds-003',
    integrationPoint: {
      id: 'ip-003',
      name: '数据分析API集成点',
      type: 'URL',
      urlConfig: {
        url: 'https://analytics.example.com/api/sales',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    },
    chartConfig: {
      type: 'bar',
      title: '月度销售分析',
      description: '各产品线月度销售额分析',
      height: 400,
      showLegend: true,
      dataMapping: {
        xField: 'month',
        yField: 'sales',
        seriesField: 'product'
      },
      styleOptions: {
        colors: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de']
      }
    },
    createTime: '2023-03-05T09:15:00Z',
    updateTime: '2023-04-10T14:30:00Z'
  }
];

/**
 * 获取模拟集成列表
 */
export function getMockIntegrations(): Promise<Integration[]> {
  return Promise.resolve([...mockIntegrations]);
}

/**
 * 获取单个模拟集成详情
 */
export function getMockIntegration(id: string): Promise<Integration | null> {
  // 先从现有数据中查找，精确匹配ID
  let integration = mockIntegrations.find(i => i.id === id);
  
  // 如果没找到，尝试查找名称含有ID数字部分的集成
  if (!integration && id.includes('-')) {
    const idNumber = id.split('-')[1];
    // 找出所有ID中包含该数字的集成
    const matches = mockIntegrations.filter(i => i.id.includes(`-${idNumber}`));
    if (matches.length > 0) {
      integration = matches[0]; // 取第一个匹配项
    }
  }
  
  if (integration) {
    // 创建深拷贝以避免修改原始数据
    const result = JSON.parse(JSON.stringify(integration));
    
    // 确保dataSourceId和queryId字段存在且有值
    if (!result.dataSourceId) {
      console.log(`[Mock数据] 集成 ${id} 缺少dataSourceId，设置默认值`);
      result.dataSourceId = `ds-${id.split('-')[1] || '001'}`;
    }
    
    if (!result.queryId) {
      console.log(`[Mock数据] 集成 ${id} 缺少queryId，设置默认值`);
      result.queryId = `query-${id.split('-')[1] || '001'}`;
    }
    
    // 添加日志以检查数据完整性
    console.log(`[Mock数据] 返回集成详情:`, {
      id: result.id,
      name: result.name,
      dataSourceId: result.dataSourceId,
      queryId: result.queryId,
      type: result.type
    });
    
    // 为避免ID不匹配问题，将请求的ID设置为返回数据的ID
    result.id = id;
    
    return Promise.resolve(result);
  }
  
  // 如果仍然没找到，则创建一个带有默认值的新集成
  if (!integration) {
    console.log(`[Mock数据] 未找到ID为 ${id} 的集成，创建默认集成数据`);
    
    // 从ID中提取数字部分，如int-001中的001
    const idNumber = id.includes('-') ? id.split('-')[1] : '001';
    
    // 根据ID决定集成类型
    let integrationType: 'SIMPLE_TABLE' | 'TABLE' | 'CHART' = 'TABLE';
    let idNum = 0;
    
    if (idNumber && !isNaN(parseInt(idNumber))) {
      idNum = parseInt(idNumber);
      // 根据ID数字进行分配: 1-3是SIMPLE_TABLE, 4-6是TABLE, 7-9是CHART
      if (idNum % 3 === 1) {
        integrationType = 'SIMPLE_TABLE';
      } else if (idNum % 3 === 2) {
        integrationType = 'TABLE';
      } else {
        integrationType = 'CHART';
      }
    }
    
    const defaultIntegration: Integration = {
      id: id,
      name: `集成 ${id}`,
      description: '默认生成的集成配置',
      type: integrationType,
      status: 'ACTIVE',
      queryId: `query-${idNumber}`,
      dataSourceId: `ds-${idNumber}`,
      integrationPoint: {
        id: `ip-${idNumber}`,
        name: '默认集成点',
        type: 'URL',
        urlConfig: {
          url: 'https://example.com/api',
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }
      },
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
    
    // 如果是图表类型，添加图表配置
    if (integrationType === 'CHART') {
      defaultIntegration.chartConfig = {
        type: ChartType.BAR,
        title: '销售数据图表',
        description: '按月度展示的销售数据',
        height: 400,
        showLegend: true,
        dataMapping: {
          xField: 'month',
          yField: 'sales',
          seriesField: 'product'
        },
        styleOptions: {
          colors: ['#5470c6', '#91cc75', '#fac858']
        }
      };
    }
    
    return Promise.resolve(defaultIntegration);
  }
  
  console.warn(`[Mock数据] 未找到ID为 ${id} 的集成`);
  return Promise.resolve(null);
}

/**
 * 创建模拟集成
 */
export function createMockIntegration(integration: Omit<Integration, 'id' | 'createTime' | 'updateTime'>): Promise<Integration> {
  const newIntegration: Integration = {
    ...integration,
    id: `int-${Math.floor(Math.random() * 1000)}`,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  };
  
  return Promise.resolve(newIntegration);
}

/**
 * 更新模拟集成
 */
export function updateMockIntegration(id: string, updates: Partial<Integration>): Promise<Integration> {
  const integration = mockIntegrations.find(i => i.id === id);
  if (!integration) {
    return Promise.reject(new Error('Integration not found'));
  }
  
  const updatedIntegration: Integration = {
    ...integration,
    ...updates,
    updateTime: new Date().toISOString()
  };
  
  return Promise.resolve(updatedIntegration);
}

/**
 * 删除模拟集成
 */
export function deleteMockIntegration(id: string): Promise<boolean> {
  const integration = mockIntegrations.find(i => i.id === id);
  if (!integration) {
    return Promise.resolve(false);
  }
  
  return Promise.resolve(true);
}

/**
 * 执行模拟查询
 */
export function executeMockQuery(integrationId: string, query: IntegrationQuery): Promise<any> {
  // 模拟查询执行延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      // 根据不同的集成类型返回不同的模拟数据
      const integration = mockIntegrations.find(i => i.id === integrationId);
      
      if (!integration) {
        resolve({
          success: false,
          error: 'Integration not found'
        });
        return;
      }
      
      // 根据集成类型返回不同数据
      if (integration.type === 'SIMPLE_TABLE') {
        // 客户数据 (简单表格类型)
        resolve({
          success: true,
          data: [
            { id: 1, name: '张三', email: 'zhang@example.com', status: 'active' },
            { id: 2, name: '李四', email: 'li@example.com', status: 'inactive' },
            { id: 3, name: '王五', email: 'wang@example.com', status: 'active' }
          ]
        });
      } else if (integration.type === 'TABLE') {
        // 订单数据 (高级表格类型)
        resolve({
          success: true,
          data: {
            rows: [
              { orderId: 'ORD-001', amount: 1200.50, status: 'completed', date: '2023-04-10' },
              { orderId: 'ORD-002', amount: 856.75, status: 'pending', date: '2023-04-11' },
              { orderId: 'ORD-003', amount: 2450.00, status: 'processing', date: '2023-04-12' }
            ],
            columns: [
              { field: 'orderId', label: '订单ID', type: 'string' },
              { field: 'amount', label: '金额', type: 'number' },
              { field: 'status', label: '状态', type: 'string' },
              { field: 'date', label: '日期', type: 'date' }
            ],
            total: 3,
            page: 1,
            pageSize: 10
          }
        });
      } else if (integration.type === 'CHART') {
        // 图表数据 (销售数据可视化)
        const chartData: ChartData[] = [];
        const months = ['一月', '二月', '三月', '四月', '五月', '六月'];
        const products = ['产品A', '产品B', '产品C'];
        
        months.forEach(month => {
          products.forEach(product => {
            chartData.push({
              month,
              product,
              sales: Math.floor(Math.random() * 1000) + 500
            });
          });
        });
        
        resolve({
          success: true,
          data: chartData
        });
      } else {
        // 默认返回空数据
        resolve({
          success: true,
          data: []
        });
      }
    }, 500); // 模拟网络延迟
  });
}