/**
 * 查询服务的模拟数据
 */

/**
 * 创建一个简单的UUID
 */
function generateMockId(): string {
  return '00000000-0000-0000-0000-000000000001';
}

/**
 * 模拟查询数据
 */
export const MockQueries = [
  {
    id: generateMockId(),
    name: '测试查询1',
    description: '用于测试的查询示例1',
    dataSourceId: generateMockId(),
    sqlContent: 'SELECT * FROM customers LIMIT 10',
    status: 'PUBLISHED',
    queryType: 'SQL',
    isFavorite: false,
    executionCount: 5,
    lastExecutedAt: new Date().toISOString(),
    tags: '测试,示例',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    updatedBy: 'system'
  }
];

/**
 * 模拟收藏数据
 */
export const MockFavorites = [
  {
    id: generateMockId(),
    queryId: generateMockId(),
    userId: 'system',
    createdAt: new Date().toISOString()
  }
];