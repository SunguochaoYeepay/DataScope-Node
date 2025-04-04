/**
 * 模拟数据集中管理文件
 * 此文件集中管理所有接口所需的模拟数据，确保数据一致性
 */

import type { Query, QueryStatus, QueryType, QueryServiceStatus } from '../types/query';

// 模拟数据源
export const mockDataSources = [
  {
    id: 'ds-1',
    name: 'MySQL示例数据库',
    description: '连接到示例MySQL数据库',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    database: 'example_db',
    username: 'user',
    status: 'active',
    syncFrequency: 'daily',
    lastSyncTime: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 2592000000).toISOString(),
    updatedAt: new Date(Date.now() - 864000000).toISOString(),
    isActive: true
  },
  {
    id: 'ds-2',
    name: 'PostgreSQL生产库',
    description: '连接到PostgreSQL生产环境数据库',
    type: 'postgresql',
    host: '192.168.1.100',
    port: 5432,
    database: 'production_db',
    username: 'admin',
    status: 'active',
    syncFrequency: 'hourly',
    lastSyncTime: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date(Date.now() - 7776000000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    isActive: true
  },
  {
    id: 'ds-3',
    name: 'SQLite本地库',
    description: '连接到本地SQLite数据库',
    type: 'sqlite',
    database: '/path/to/local.db',
    status: 'active',
    syncFrequency: 'manual',
    lastSyncTime: null,
    createdAt: new Date(Date.now() - 1728000000).toISOString(),
    updatedAt: new Date(Date.now() - 345600000).toISOString(),
    isActive: true
  },
  {
    id: 'ds-4',
    name: 'SQL Server测试库',
    description: '连接到SQL Server测试环境',
    type: 'sqlserver',
    host: '192.168.1.200',
    port: 1433,
    database: 'test_db',
    username: 'tester',
    status: 'inactive',
    syncFrequency: 'weekly',
    lastSyncTime: new Date(Date.now() - 604800000).toISOString(),
    createdAt: new Date(Date.now() - 5184000000).toISOString(),
    updatedAt: new Date(Date.now() - 2592000000).toISOString(),
    isActive: false
  },
  {
    id: 'ds-5',
    name: 'Oracle企业库',
    description: '连接到Oracle企业数据库',
    type: 'oracle',
    host: '192.168.1.150',
    port: 1521,
    database: 'enterprise_db',
    username: 'system',
    status: 'active',
    syncFrequency: 'daily',
    lastSyncTime: new Date(Date.now() - 172800000).toISOString(),
    createdAt: new Date(Date.now() - 10368000000).toISOString(),
    updatedAt: new Date(Date.now() - 1728000000).toISOString(),
    isActive: true
  }
];

// 模拟元数据
export const mockMetadata = {
  tables: [
    {
      name: 'users',
      schema: 'public',
      type: 'TABLE',
      description: '用户表',
      rowCount: 10000,
      totalSize: 2048000,
      createdAt: new Date(Date.now() - 5184000000).toISOString(),
      columns: [
        { name: 'id', type: 'INT', nullable: false, primary: true, description: '用户ID' },
        { name: 'username', type: 'VARCHAR(50)', nullable: false, description: '用户名' },
        { name: 'email', type: 'VARCHAR(100)', nullable: false, description: '电子邮件' },
        { name: 'created_at', type: 'TIMESTAMP', nullable: false, description: '创建时间' }
      ]
    },
    {
      name: 'orders',
      schema: 'public',
      type: 'TABLE',
      description: '订单表',
      rowCount: 50000,
      totalSize: 8192000,
      createdAt: new Date(Date.now() - 4752000000).toISOString(),
      columns: [
        { name: 'id', type: 'INT', nullable: false, primary: true, description: '订单ID' },
        { name: 'user_id', type: 'INT', nullable: false, description: '用户ID' },
        { name: 'amount', type: 'DECIMAL(10,2)', nullable: false, description: '订单金额' },
        { name: 'created_at', type: 'TIMESTAMP', nullable: false, description: '创建时间' }
      ]
    },
    {
      name: 'products',
      schema: 'public',
      type: 'TABLE',
      description: '产品表',
      rowCount: 5000,
      totalSize: 1024000,
      createdAt: new Date(Date.now() - 4320000000).toISOString(),
      columns: [
        { name: 'id', type: 'INT', nullable: false, primary: true, description: '产品ID' },
        { name: 'name', type: 'VARCHAR(100)', nullable: false, description: '产品名称' },
        { name: 'price', type: 'DECIMAL(10,2)', nullable: false, description: '产品价格' },
        { name: 'stock', type: 'INT', nullable: false, description: '库存数量' }
      ]
    }
  ]
};

// 模拟查询
export const mockQueries: Query[] = Array.from({ length: 10 }, (_, i) => {
  const id = `query-${i + 1}`;
  const timestamp = new Date(Date.now() - i * 86400000).toISOString();
  
  return {
    id,
    name: `示例查询 ${i + 1}`,
    description: `这是示例查询 ${i + 1} 的描述`,
    folderId: i % 3 === 0 ? 'folder-1' : (i % 3 === 1 ? 'folder-2' : 'folder-3'),
    dataSourceId: `ds-${(i % 5) + 1}`,
    dataSourceName: mockDataSources[(i % 5)].name,
    queryType: (i % 2 === 0 ? 'SQL' : 'NATURAL_LANGUAGE') as QueryType,
    queryText: i % 2 === 0 ? 
      `SELECT * FROM example_table WHERE id > ${i} ORDER BY name LIMIT 10` : 
      `查找最近10条${i % 2 === 0 ? '订单' : '用户'}记录`,
    status: (i % 4 === 0 ? 'DRAFT' : (i % 4 === 1 ? 'PUBLISHED' : (i % 4 === 2 ? 'DEPRECATED' : 'ARCHIVED'))) as QueryStatus,
    serviceStatus: (i % 2 === 0 ? 'ENABLED' : 'DISABLED') as QueryServiceStatus,
    createdAt: timestamp,
    updatedAt: new Date(Date.now() - i * 43200000).toISOString(),
    createdBy: { id: 'user1', name: '测试用户' },
    updatedBy: { id: 'user1', name: '测试用户' },
    executionCount: Math.floor(Math.random() * 50),
    isFavorite: i % 3 === 0,
    isActive: i % 5 !== 0,
    lastExecutedAt: new Date(Date.now() - i * 432000).toISOString(),
    resultCount: Math.floor(Math.random() * 100) + 10,
    executionTime: Math.floor(Math.random() * 500) + 10,
    tags: [`标签${i+1}`, `类型${i % 3}`],
    currentVersion: {
      id: `ver-${id}-1`,
      queryId: id,
      versionNumber: 1,
      name: '当前版本',
      sql: `SELECT * FROM example_table WHERE id > ${i} ORDER BY name LIMIT 10`,
      dataSourceId: `ds-${(i % 5) + 1}`,
      status: 'PUBLISHED',
      isLatest: true,
      createdAt: timestamp
    },
    versions: [{
      id: `ver-${id}-1`,
      queryId: id,
      versionNumber: 1,
      name: '当前版本',
      sql: `SELECT * FROM example_table WHERE id > ${i} ORDER BY name LIMIT 10`,
      dataSourceId: `ds-${(i % 5) + 1}`,
      status: 'PUBLISHED',
      isLatest: true,
      createdAt: timestamp
    }]
  };
});

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