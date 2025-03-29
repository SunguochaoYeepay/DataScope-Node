import { jest } from '@jest/globals';
import { DatabaseConnector } from '../../src/types/db-interface';

/**
 * 创建模拟数据库连接器
 * 针对单元测试使用
 */
export function createMockDatabaseConnector() {
  const connector = {
    testConnection: jest.fn().mockResolvedValue(true),
    executeQuery: jest.fn().mockResolvedValue({
      columns: ['id', 'name'],
      rows: [{ id: 1, name: 'test' }],
      rowCount: 1,
      executionTime: 10
    }),
    close: jest.fn().mockResolvedValue(undefined),
    explainQuery: jest.fn().mockResolvedValue({
      query: 'SELECT * FROM users',
      planNodes: [{ type: 'scan', table: 'users', rows: 100 }]
    }),
    cancelQuery: jest.fn().mockResolvedValue(true),
    getQueryPlan: jest.fn().mockResolvedValue({
      query: 'SELECT * FROM test',
      planNodes: []
    }),
    getSchemas: jest.fn().mockResolvedValue(['schema1', 'schema2']),
    getTables: jest.fn().mockResolvedValue(['table1', 'table2']),
    getColumns: jest.fn().mockResolvedValue([
      { name: 'id', dataType: 'int', nullable: false },
      { name: 'name', dataType: 'varchar', nullable: true }
    ]),
    getPrimaryKeys: jest.fn().mockResolvedValue(['id']),
    getForeignKeys: jest.fn().mockResolvedValue([
      { column: 'user_id', referencedTable: 'users', referencedColumn: 'id' }
    ]),
    getIndexes: jest.fn().mockResolvedValue([
      { name: 'idx_name', columns: ['name'], isUnique: false }
    ]),
    isJsonExplainSupported: true
  };

  // @ts-ignore 忽略类型错误，在测试中模拟接口即可
  return connector;
}

/**
 * 创建模拟数据源
 */
export function createMockDataSource(dbType = 'mysql') {
  return {
    id: 'test-ds-id',
    name: 'Test DB',
    type: dbType,
    host: 'localhost',
    port: 3306,
    username: 'user',
    status: 'active',
    description: 'Test Database',
    nonce: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'test-user-id',
    updatedBy: 'test-user-id',
    active: true,
    databaseName: 'test_db'
  };
}

/**
 * 创建模拟查询保存对象
 */
export function createMockSavedQuery() {
  return {
    id: 'query-123',
    name: 'Test Query',
    sqlContent: 'SELECT * FROM users',
    dataSourceId: 'test-ds-id',
    description: 'Test query description',
    isPublic: false,
    status: 'active',
    nonce: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'test-user-id',
    updatedBy: 'test-user-id',
    executionCount: 5,
    lastExecutedAt: new Date(),
    queryType: 'SELECT',
    isFavorite: false,
    folderId: null,
    tags: null
  };
}

/**
 * 创建模拟查询执行历史
 */
export function createMockQueryHistory() {
  return [
    {
      id: 'history-1',
      dataSourceId: 'test-ds-id',
      sqlContent: 'SELECT * FROM users',
      status: 'COMPLETED',
      startTime: new Date(Date.now() - 60000),
      endTime: new Date(),
      duration: 500,
      rowCount: 10,
      errorMessage: null,
      createdAt: new Date(),
      createdBy: 'test-user-id',
      queryId: null
    },
    {
      id: 'history-2',
      dataSourceId: 'test-ds-id',
      sqlContent: 'SELECT COUNT(*) FROM orders',
      status: 'COMPLETED',
      startTime: new Date(Date.now() - 120000),
      endTime: new Date(Date.now() - 119500),
      duration: 500,
      rowCount: 1,
      errorMessage: null,
      createdAt: new Date(),
      createdBy: 'test-user-id',
      queryId: null
    }
  ];
}

/**
 * 创建模拟查询计划
 */
export function createMockQueryPlan() {
  return {
    id: 'plan-123',
    dataSourceId: 'test-ds-id',
    sql: 'SELECT * FROM users',
    planData: JSON.stringify({
      query: 'SELECT * FROM users',
      planNodes: [{ type: 'scan', table: 'users', rows: 100 }],
      estimatedCost: 100,
      estimatedRows: 100
    }),
    createdAt: new Date(),
    optimizationTips: JSON.stringify([
      { type: 'INDEX', description: '为users表的email列添加索引', impact: 'HIGH' }
    ])
  };
}

/**
 * 创建模拟优化提示
 */
export function createMockOptimizationTips() {
  return [
    { type: 'INDEX', description: '为users表的email列添加索引', impact: 'HIGH' },
    { type: 'JOIN', description: '优化表连接顺序', impact: 'MEDIUM' }
  ];
}

/**
 * 创建模拟QueryService
 */
export function createMockQueryService() {
  // @ts-ignore 忽略类型错误，在测试中模拟服务即可
  return {
    explainQuery: jest.fn().mockResolvedValue({
      query: 'SELECT * FROM users',
      planNodes: [{ type: 'scan', table: 'users', rows: 100 }]
    }),
    getQueryOptimizationTips: jest.fn().mockResolvedValue([
      { type: 'INDEX', description: '为users表的email列添加索引', impact: 'HIGH' }
    ]),
    getQueryHistory: jest.fn().mockResolvedValue({
      history: createMockQueryHistory(),
      total: 2,
      limit: 50,
      offset: 0
    }),
    getQueryPlanById: jest.fn().mockResolvedValue(createMockQueryPlan()),
    saveQuery: jest.fn().mockResolvedValue(createMockSavedQuery()),
    getQueries: jest.fn().mockResolvedValue([createMockSavedQuery()]),
    getQueryById: jest.fn().mockResolvedValue(createMockSavedQuery()),
    updateQuery: jest.fn().mockResolvedValue(createMockSavedQuery()),
    deleteQuery: jest.fn().mockResolvedValue(undefined),
    cancelQuery: jest.fn().mockResolvedValue(true),
    executeQuery: jest.fn().mockResolvedValue({
      columns: ['id', 'name'],
      rows: [{ id: 1, name: 'User 1' }],
      rowCount: 1,
      executionTime: 15
    }),
    getQueryPlanHistory: jest.fn().mockResolvedValue({
      history: [createMockQueryPlan()],
      total: 1,
      limit: 20,
      offset: 0
    })
  };
}
