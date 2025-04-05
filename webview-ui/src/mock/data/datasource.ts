/**
 * 数据源模拟数据
 * 
 * 提供数据源模拟数据，用于开发和测试
 */

// 数据源类型
export type DataSourceType = 'mysql' | 'postgresql' | 'oracle' | 'sqlserver' | 'sqlite';

// 数据源状态
export type DataSourceStatus = 'active' | 'inactive' | 'error' | 'pending';

// 同步频率
export type SyncFrequency = 'manual' | 'hourly' | 'daily' | 'weekly' | 'monthly';

// 数据源接口
export interface DataSource {
  id: string;
  name: string;
  description?: string;
  type: DataSourceType;
  host?: string;
  port?: number;
  databaseName?: string;
  username?: string;
  password?: string;
  status: DataSourceStatus;
  syncFrequency?: SyncFrequency;
  lastSyncTime?: string | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

/**
 * 模拟数据源列表
 */
export const mockDataSources: DataSource[] = [
  {
    id: 'ds-1',
    name: 'MySQL示例数据库',
    description: '连接到示例MySQL数据库',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    databaseName: 'example_db',
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
    databaseName: 'production_db',
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
    databaseName: '/path/to/local.db',
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
    databaseName: 'test_db',
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
    databaseName: 'enterprise_db',
    username: 'system',
    status: 'active',
    syncFrequency: 'daily',
    lastSyncTime: new Date(Date.now() - 172800000).toISOString(),
    createdAt: new Date(Date.now() - 10368000000).toISOString(),
    updatedAt: new Date(Date.now() - 1728000000).toISOString(),
    isActive: true
  }
];

/**
 * 生成模拟数据源
 * @param count 生成数量
 * @returns 模拟数据源数组
 */
export function generateMockDataSources(count: number = 5): DataSource[] {
  const types: DataSourceType[] = ['mysql', 'postgresql', 'oracle', 'sqlserver', 'sqlite'];
  const statuses: DataSourceStatus[] = ['active', 'inactive', 'error', 'pending'];
  const syncFreqs: SyncFrequency[] = ['manual', 'hourly', 'daily', 'weekly', 'monthly'];
  
  return Array.from({ length: count }, (_, i) => {
    const type = types[i % types.length];
    const now = Date.now();
    
    return {
      id: `ds-gen-${i + 1}`,
      name: `生成的${type}数据源 ${i + 1}`,
      description: `这是一个自动生成的${type}类型数据源 ${i + 1}`,
      type,
      host: type !== 'sqlite' ? 'localhost' : undefined,
      port: type !== 'sqlite' ? (3306 + i) : undefined,
      databaseName: type === 'sqlite' ? `/path/to/db_${i}.db` : `example_db_${i}`,
      username: type !== 'sqlite' ? `user_${i}` : undefined,
      status: statuses[i % statuses.length],
      syncFrequency: syncFreqs[i % syncFreqs.length],
      lastSyncTime: i % 3 === 0 ? null : new Date(now - i * 86400000).toISOString(),
      createdAt: new Date(now - (i + 10) * 86400000).toISOString(),
      updatedAt: new Date(now - i * 43200000).toISOString(),
      isActive: i % 4 !== 0
    };
  });
}

// 导出默认数据源列表
export default mockDataSources; 