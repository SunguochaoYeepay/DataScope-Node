import { Integration, IntegrationQuery } from '@/types/integration';

// 模拟集成列表数据
const mockIntegrations: Integration[] = [
  {
    id: 'int-001',
    name: '客户数据集成',
    description: '与CRM系统的客户数据集成',
    type: 'CRM',
    status: 'ACTIVE',
    connectionDetails: {
      url: 'https://api.example.com/crm',
      authType: 'API_KEY'
    },
    createdAt: '2023-01-15T08:30:00Z',
    updatedAt: '2023-03-20T14:15:00Z',
    createdBy: 'admin'
  },
  {
    id: 'int-002',
    name: '订单系统集成',
    description: '与企业ERP系统的订单数据集成',
    type: 'ERP',
    status: 'ACTIVE',
    connectionDetails: {
      url: 'https://erp.company.internal/api',
      authType: 'OAUTH2'
    },
    createdAt: '2023-02-10T10:45:00Z',
    updatedAt: '2023-04-05T16:20:00Z',
    createdBy: 'system'
  },
  {
    id: 'int-003',
    name: '支付网关集成',
    description: '与第三方支付处理系统集成',
    type: 'PAYMENT',
    status: 'INACTIVE',
    connectionDetails: {
      url: 'https://payments.example.com/gateway',
      authType: 'API_KEY'
    },
    createdAt: '2023-03-05T09:15:00Z',
    updatedAt: '2023-03-05T09:15:00Z',
    createdBy: 'admin'
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
  const integration = mockIntegrations.find(i => i.id === id);
  return Promise.resolve(integration || null);
}

/**
 * 创建模拟集成
 */
export function createMockIntegration(integration: Omit<Integration, 'id' | 'createdAt' | 'updatedAt'>): Promise<Integration> {
  const newIntegration: Integration = {
    ...integration,
    id: `int-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
    updatedAt: new Date().toISOString()
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
      
      switch (integration.type) {
        case 'CRM':
          resolve({
            success: true,
            data: [
              { id: 1, name: '张三', email: 'zhang@example.com', status: 'active' },
              { id: 2, name: '李四', email: 'li@example.com', status: 'inactive' },
              { id: 3, name: '王五', email: 'wang@example.com', status: 'active' }
            ]
          });
          break;
        case 'ERP':
          resolve({
            success: true,
            data: [
              { orderId: 'ORD-001', amount: 1200.50, status: 'completed', date: '2023-04-10' },
              { orderId: 'ORD-002', amount: 856.75, status: 'pending', date: '2023-04-11' },
              { orderId: 'ORD-003', amount: 2450.00, status: 'processing', date: '2023-04-12' }
            ]
          });
          break;
        case 'PAYMENT':
          resolve({
            success: true,
            data: [
              { transactionId: 'TXN-001', amount: 500, currency: 'CNY', status: 'success' },
              { transactionId: 'TXN-002', amount: 750, currency: 'CNY', status: 'success' },
              { transactionId: 'TXN-003', amount: 1000, currency: 'CNY', status: 'failed' }
            ]
          });
          break;
        default:
          resolve({
            success: true,
            data: []
          });
      }
    }, 500); // 模拟网络延迟
  });
}