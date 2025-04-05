/**
 * 查询模拟数据
 * 
 * 提供查询相关的模拟数据
 */

import type { Query } from '@/types/query';

// 模拟查询数据
export const mockQueries: Query[] = Array.from({ length: 10 }, (_, i) => {
  const id = `query-${i + 1}`;
  const timestamp = new Date(Date.now() - i * 86400000).toISOString();
  
  return {
    id,
    name: `示例查询 ${i + 1}`,
    description: `这是示例查询 ${i + 1} 的描述`,
    folderId: i % 3 === 0 ? 'folder-1' : (i % 3 === 1 ? 'folder-2' : 'folder-3'),
    dataSourceId: `ds-${(i % 5) + 1}`,
    dataSourceName: `数据源 ${(i % 5) + 1}`,
    queryType: i % 2 === 0 ? 'SQL' : 'NATURAL_LANGUAGE',
    queryText: i % 2 === 0 ? 
      `SELECT * FROM example_table WHERE id > ${i} ORDER BY name LIMIT 10` : 
      `查找最近10条${i % 2 === 0 ? '订单' : '用户'}记录`,
    status: i % 4 === 0 ? 'DRAFT' : (i % 4 === 1 ? 'PUBLISHED' : (i % 4 === 2 ? 'DEPRECATED' : 'ARCHIVED')),
    serviceStatus: i % 2 === 0 ? 'ENABLED' : 'DISABLED',
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

export default mockQueries;