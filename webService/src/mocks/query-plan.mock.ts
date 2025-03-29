/**
 * 查询计划模拟数据
 */
import { QueryPlan } from '../types/query-plan';

export const mockQueryPlan: QueryPlan = {
  query: 'SELECT * FROM users WHERE id = 1',
  estimatedRows: 1,
  estimatedCost: 5.2,
  database: 'test_db',
  planNodes: [
    {
      id: '1',
      type: 'const',
      table: 'users',
      partitions: null,
      rows: 1,
      filtered: 100.0,
      key: 'PRIMARY',
      keyLength: '4',
      refValue: 'const',
      extra: 'Using index',
    }
  ],
  warnings: [],
  optimizationTips: [
    '查询使用了PRIMARY索引，执行效率较高'
  ]
};

export const mockQueryPlanWithJoin: QueryPlan = {
  query: 'SELECT u.id, u.name, o.id AS order_id, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE u.status = "active"',
  estimatedRows: 500,
  estimatedCost: 120.5,
  database: 'test_db',
  planNodes: [
    {
      id: '1',
      type: 'ALL',
      table: 'users',
      partitions: null,
      rows: 1000,
      filtered: 50.0,
      key: null,
      keyLength: null,
      refValue: null,
      extra: 'Using where',
    },
    {
      id: '2',
      type: 'ref',
      table: 'orders',
      partitions: null,
      rows: 5,
      filtered: 100.0,
      key: 'idx_user_id',
      keyLength: '4',
      refValue: 'test_db.u.id',
      extra: 'Using index',
    }
  ],
  warnings: [
    '表 users 正在进行全表扫描，扫描了 1000 行'
  ],
  optimizationTips: [
    '考虑为表 users 添加包含status列的索引，避免全表扫描',
    '查询JOIN操作使用了正确的索引'
  ]
};

export const mockLargeQueryPlan: QueryPlan = {
  query: 'SELECT p.id, p.name, c.name AS category, SUM(o.total) AS revenue FROM products p LEFT JOIN categories c ON p.category_id = c.id LEFT JOIN order_items oi ON p.id = oi.product_id LEFT JOIN orders o ON oi.order_id = o.id WHERE p.status = "active" AND o.created_at > "2023-01-01" GROUP BY p.id, p.name, c.name ORDER BY revenue DESC',
  estimatedRows: 2500,
  estimatedCost: 580.75,
  database: 'test_db',
  planNodes: [
    {
      id: '1',
      type: 'ALL',
      table: 'products',
      partitions: null,
      rows: 5000,
      filtered: 50.0,
      key: null,
      keyLength: null,
      refValue: null,
      extra: 'Using where; Using temporary; Using filesort',
    },
    {
      id: '2',
      type: 'eq_ref',
      table: 'categories',
      partitions: null,
      rows: 1,
      filtered: 100.0,
      key: 'PRIMARY',
      keyLength: '4',
      refValue: 'test_db.p.category_id',
      extra: null,
    },
    {
      id: '3',
      type: 'ref',
      table: 'order_items',
      partitions: null,
      rows: 10,
      filtered: 100.0,
      key: 'idx_product_id',
      keyLength: '4',
      refValue: 'test_db.p.id',
      extra: 'Using index',
    },
    {
      id: '4',
      type: 'ref',
      table: 'orders',
      partitions: null,
      rows: 2,
      filtered: 50.0,
      key: 'PRIMARY',
      keyLength: '4',
      refValue: 'test_db.oi.order_id',
      extra: 'Using where',
    }
  ],
  warnings: [
    '表 products 正在进行全表扫描，扫描了 5000 行',
    '查询需要创建临时表来处理 products 的数据',
    '表 products 需要文件排序，这可能会影响性能'
  ],
  optimizationTips: [
    '考虑为表 products 添加包含status列的索引，避免全表扫描',
    '尝试简化GROUP BY或ORDER BY子句，或考虑添加合适的复合索引',
    '考虑为orders表的created_at字段创建索引',
    '考虑简化查询，减少复杂JOIN操作'
  ]
};

export function getRandomQueryPlan(): QueryPlan {
  const plans = [mockQueryPlan, mockQueryPlanWithJoin, mockLargeQueryPlan];
  return plans[Math.floor(Math.random() * plans.length)];
}

export function getMockQueryPlanBySql(sql: string): QueryPlan {
  // 根据SQL语句中的特征选择返回哪种模拟计划
  if (sql.toLowerCase().includes('join')) {
    return {
      ...mockQueryPlanWithJoin,
      query: sql
    };
  }
  
  if (sql.toLowerCase().includes('group by') || sql.toLowerCase().includes('order by')) {
    return {
      ...mockLargeQueryPlan,
      query: sql
    };
  }
  
  return {
    ...mockQueryPlan,
    query: sql
  };
}