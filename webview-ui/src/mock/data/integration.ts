/**
 * 集成服务Mock数据
 * 
 * 提供集成API的模拟数据
 */

// 模拟集成
export const mockIntegrations = [
  {
    id: 'integration-1',
    name: '示例REST API',
    description: '连接到示例REST API服务',
    type: 'REST',
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
      },
      {
        id: 'endpoint-2',
        name: '获取单个用户',
        method: 'GET',
        path: '/users/{id}',
        description: '根据ID获取单个用户'
      }
    ]
  },
  {
    id: 'integration-2',
    name: '天气API',
    description: '连接到天气预报API',
    type: 'REST',
    baseUrl: 'https://api.weather.com',
    authType: 'API_KEY',
    apiKey: '********',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 1728000000).toISOString(),
    updatedAt: new Date(Date.now() - 432000000).toISOString(),
    endpoints: [
      {
        id: 'endpoint-3',
        name: '获取当前天气',
        method: 'GET',
        path: '/current',
        description: '获取指定位置的当前天气'
      },
      {
        id: 'endpoint-4',
        name: '获取天气预报',
        method: 'GET',
        path: '/forecast',
        description: '获取未来7天的天气预报'
      }
    ]
  },
  {
    id: 'integration-3',
    name: '支付网关',
    description: '连接到支付处理API',
    type: 'REST',
    baseUrl: 'https://api.payment.com',
    authType: 'OAUTH2',
    clientId: 'client123',
    clientSecret: '********',
    status: 'INACTIVE',
    createdAt: new Date(Date.now() - 864000000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    endpoints: [
      {
        id: 'endpoint-5',
        name: '创建支付',
        method: 'POST',
        path: '/payments',
        description: '创建新的支付请求'
      },
      {
        id: 'endpoint-6',
        name: '获取支付状态',
        method: 'GET',
        path: '/payments/{id}',
        description: '检查支付状态'
      },
      {
        id: 'endpoint-7',
        name: '退款',
        method: 'POST',
        path: '/payments/{id}/refund',
        description: '处理退款请求'
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
      name: '示例REST API',
      description: '连接到示例REST API服务',
      type: 'REST',
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
        },
        {
          id: 'endpoint-2',
          name: '获取单个用户',
          method: 'GET',
          path: '/users/{id}',
          description: '根据ID获取单个用户'
        }
      ]
    },
    {
      id: 'integration-2',
      name: '天气API',
      description: '连接到天气预报API',
      type: 'REST',
      baseUrl: 'https://api.weather.com',
      authType: 'API_KEY',
      apiKey: '********',
      status: 'ACTIVE',
      createdAt: new Date(Date.now() - 1728000000).toISOString(),
      updatedAt: new Date(Date.now() - 432000000).toISOString(),
      endpoints: [
        {
          id: 'endpoint-3',
          name: '获取当前天气',
          method: 'GET',
          path: '/current',
          description: '获取指定位置的当前天气'
        },
        {
          id: 'endpoint-4',
          name: '获取天气预报',
          method: 'GET',
          path: '/forecast',
          description: '获取未来7天的天气预报'
        }
      ]
    },
    {
      id: 'integration-3',
      name: '支付网关',
      description: '连接到支付处理API',
      type: 'REST',
      baseUrl: 'https://api.payment.com',
      authType: 'OAUTH2',
      clientId: 'client123',
      clientSecret: '********',
      status: 'INACTIVE',
      createdAt: new Date(Date.now() - 864000000).toISOString(),
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
      endpoints: [
        {
          id: 'endpoint-5',
          name: '创建支付',
          method: 'POST',
          path: '/payments',
          description: '创建新的支付请求'
        },
        {
          id: 'endpoint-6',
          name: '获取支付状态',
          method: 'GET',
          path: '/payments/{id}',
          description: '检查支付状态'
        },
        {
          id: 'endpoint-7',
          name: '退款',
          method: 'POST',
          path: '/payments/{id}/refund',
          description: '处理退款请求'
        }
      ]
    }
  ].forEach(item => mockIntegrations.push(item));
}

export default mockIntegrations;