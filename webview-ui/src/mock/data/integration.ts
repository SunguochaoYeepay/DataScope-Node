/**
 * 集成服务Mock数据
 * 
 * 提供集成API的模拟数据
 */

// 模拟集成
export const mockIntegrations = [
  {
    id: 'integration-1',
    name: '示例用户数据表格',
    description: '展示用户数据的表格集成',
    type: 'TABLE',
    baseUrl: 'https://api.example.com/v1',
    authType: 'BASIC',
    username: 'api_user',
    password: '********',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 2592000000).toISOString(),
    updatedAt: new Date(Date.now() - 864000000).toISOString(),
    endpoints: [
      {
        id: 'endpoint-1',
        name: '获取用户列表',
        method: 'GET',
        path: '/users',
        description: '获取所有用户的列表'
      }
    ]
  },
  {
    id: 'integration-2',
    name: '天气数据图表',
    description: '展示天气预报的数据图表集成',
    type: 'CHART',
    baseUrl: 'https://api.weather.com',
    authType: 'API_KEY',
    apiKey: '********',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 1728000000).toISOString(),
    updatedAt: new Date(Date.now() - 432000000).toISOString(),
    endpoints: [
      {
        id: 'endpoint-3',
        name: '获取天气数据',
        method: 'GET',
        path: '/forecast',
        description: '获取未来7天的天气预报'
      }
    ]
  },
  {
    id: 'integration-3',
    name: '简单订单查询',
    description: '提供简单的订单查询集成',
    type: 'SIMPLE_TABLE',
    baseUrl: 'https://api.orders.com',
    authType: 'OAUTH2',
    clientId: 'client123',
    clientSecret: '********',
    status: 'INACTIVE',
    createdAt: new Date(Date.now() - 864000000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    endpoints: [
      {
        id: 'endpoint-5',
        name: '查询订单',
        method: 'GET',
        path: '/orders',
        description: '查询订单数据'
      }
    ]
  }
];

// 重置集成数据
export function resetIntegrations(): void {
  // 保留引用，只重置内容
  while (mockIntegrations.length > 0) {
    mockIntegrations.pop();
  }
  
  // 重新生成集成数据
  [
    {
      id: 'integration-1',
      name: '示例用户数据表格',
      description: '展示用户数据的表格集成',
      type: 'TABLE',
      baseUrl: 'https://api.example.com/v1',
      authType: 'BASIC',
      username: 'api_user',
      password: '********',
      status: 'ACTIVE',
      createdAt: new Date(Date.now() - 2592000000).toISOString(),
      updatedAt: new Date(Date.now() - 864000000).toISOString(),
      endpoints: [
        {
          id: 'endpoint-1',
          name: '获取用户列表',
          method: 'GET',
          path: '/users',
          description: '获取所有用户的列表'
        }
      ]
    },
    {
      id: 'integration-2',
      name: '天气数据图表',
      description: '展示天气预报的数据图表集成',
      type: 'CHART',
      baseUrl: 'https://api.weather.com',
      authType: 'API_KEY',
      apiKey: '********',
      status: 'ACTIVE',
      createdAt: new Date(Date.now() - 1728000000).toISOString(),
      updatedAt: new Date(Date.now() - 432000000).toISOString(),
      endpoints: [
        {
          id: 'endpoint-3',
          name: '获取天气数据',
          method: 'GET',
          path: '/forecast',
          description: '获取未来7天的天气预报'
        }
      ]
    },
    {
      id: 'integration-3',
      name: '简单订单查询',
      description: '提供简单的订单查询集成',
      type: 'SIMPLE_TABLE',
      baseUrl: 'https://api.orders.com',
      authType: 'OAUTH2',
      clientId: 'client123',
      clientSecret: '********',
      status: 'INACTIVE',
      createdAt: new Date(Date.now() - 864000000).toISOString(),
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
      endpoints: [
        {
          id: 'endpoint-5',
          name: '查询订单',
          method: 'GET',
          path: '/orders',
          description: '查询订单数据'
        }
      ]
    }
  ].forEach(item => mockIntegrations.push(item));
}

export default mockIntegrations;