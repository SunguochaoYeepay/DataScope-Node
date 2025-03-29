/**
 * 查询相关的模拟数据
 */

import { Query, QueryHistory } from '@prisma/client';

// 模拟查询结果
export const mockQueryResult = {
  columns: ['id', 'name', 'email', 'created_at'],
  rows: [
    { id: 1, name: '张三', email: 'zhangsan@example.com', created_at: '2023-01-15T08:30:45Z' },
    { id: 2, name: '李四', email: 'lisi@example.com', created_at: '2023-02-20T14:22:10Z' },
    { id: 3, name: '王五', email: 'wangwu@example.com', created_at: '2023-03-05T11:15:33Z' },
    { id: 4, name: '赵六', email: 'zhaoliu@example.com', created_at: '2023-04-12T09:45:18Z' },
    { id: 5, name: '钱七', email: 'qianqi@example.com', created_at: '2023-05-08T16:37:29Z' }
  ],
  rowCount: 5,
  executionTime: 15 // 毫秒
};

// 更复杂的查询结果
export const mockComplexQueryResult = {
  columns: ['user_id', 'username', 'order_count', 'total_amount', 'latest_order'],
  rows: [
    { user_id: 1, username: '张三', order_count: 12, total_amount: 3680.50, latest_order: '2023-11-28T10:15:22Z' },
    { user_id: 2, username: '李四', order_count: 8, total_amount: 2450.75, latest_order: '2023-12-05T14:30:45Z' },
    { user_id: 3, username: '王五', order_count: 5, total_amount: 1280.25, latest_order: '2023-12-10T09:45:12Z' },
    { user_id: 4, username: '赵六', order_count: 15, total_amount: 4560.80, latest_order: '2023-12-12T16:22:33Z' },
    { user_id: 5, username: '钱七', order_count: 3, total_amount: 950.30, latest_order: '2023-12-01T11:08:19Z' }
  ],
  rowCount: 5,
  executionTime: 75 // 毫秒
};

// 大数据集查询结果
export const mockLargeQueryResult = {
  columns: ['id', 'region', 'product', 'sales', 'date'],
  rows: Array(100).fill(0).map((_, index) => {
    const regions = ['华东', '华南', '华北', '华中', '西南', '西北', '东北'];
    const products = ['手机', '电脑', '平板', '耳机', '手表', '充电器', '保护壳'];
    
    return {
      id: index + 1,
      region: regions[Math.floor(Math.random() * regions.length)],
      product: products[Math.floor(Math.random() * products.length)],
      sales: Math.floor(Math.random() * 10000) / 100,
      date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString()
    };
  }),
  rowCount: 100,
  executionTime: 250 // 毫秒
};

// 模拟的查询历史记录
export const mockQueryHistory: QueryHistory[] = [
  {
    id: '1',
    dataSourceId: '1',
    sqlContent: 'SELECT * FROM users LIMIT 5',
    status: 'COMPLETED',
    startTime: new Date('2023-12-15T09:30:00Z'),
    endTime: new Date('2023-12-15T09:30:01Z'),
    duration: 1000,
    rowCount: 5,
    errorMessage: null,
    createdAt: new Date('2023-12-15T09:30:00Z'),
    updatedAt: new Date('2023-12-15T09:30:01Z')
  },
  {
    id: '2',
    dataSourceId: '1',
    sqlContent: 'SELECT u.id, u.name, COUNT(o.id) AS order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id GROUP BY u.id, u.name ORDER BY order_count DESC LIMIT 5',
    status: 'COMPLETED',
    startTime: new Date('2023-12-14T14:22:10Z'),
    endTime: new Date('2023-12-14T14:22:12Z'),
    duration: 2000,
    rowCount: 5,
    errorMessage: null,
    createdAt: new Date('2023-12-14T14:22:10Z'),
    updatedAt: new Date('2023-12-14T14:22:12Z')
  },
  {
    id: '3',
    dataSourceId: '1',
    sqlContent: 'DELETE FROM products WHERE id = 10',
    status: 'FAILED',
    startTime: new Date('2023-12-13T11:15:33Z'),
    endTime: new Date('2023-12-13T11:15:34Z'),
    duration: 1000,
    rowCount: 0,
    errorMessage: '没有权限执行DELETE操作',
    createdAt: new Date('2023-12-13T11:15:33Z'),
    updatedAt: new Date('2023-12-13T11:15:34Z')
  },
  {
    id: '4',
    dataSourceId: '2',
    sqlContent: 'SELECT region, SUM(sales) as total_sales FROM sales GROUP BY region ORDER BY total_sales DESC',
    status: 'COMPLETED',
    startTime: new Date('2023-12-12T16:37:29Z'),
    endTime: new Date('2023-12-12T16:37:32Z'),
    duration: 3000,
    rowCount: 7,
    errorMessage: null,
    createdAt: new Date('2023-12-12T16:37:29Z'),
    updatedAt: new Date('2023-12-12T16:37:32Z')
  },
  {
    id: '5',
    dataSourceId: '1',
    sqlContent: 'SELECT * FROM very_large_table',
    status: 'CANCELLED',
    startTime: new Date('2023-12-11T10:45:18Z'),
    endTime: new Date('2023-12-11T10:46:18Z'),
    duration: 60000,
    rowCount: 0,
    errorMessage: '查询已取消',
    createdAt: new Date('2023-12-11T10:45:18Z'),
    updatedAt: new Date('2023-12-11T10:46:18Z')
  }
];

// 模拟的保存查询
export const mockSavedQueries: Query[] = [
  {
    id: '1',
    name: '活跃用户查询',
    dataSourceId: '1',
    sqlContent: 'SELECT * FROM users WHERE status = "active" AND last_login_at > DATEADD(day, -30, GETDATE())',
    description: '查询近30天有登录的活跃用户',
    tags: 'users,active,report',
    status: 'PUBLISHED',
    createdAt: new Date('2023-12-01T10:00:00Z'),
    updatedAt: new Date('2023-12-01T10:00:00Z')
  },
  {
    id: '2',
    name: '销售报表',
    dataSourceId: '1',
    sqlContent: 'SELECT p.name, c.name as category, SUM(oi.quantity) as total_sold, SUM(oi.quantity * oi.price) as revenue FROM products p JOIN categories c ON p.category_id = c.id JOIN order_items oi ON p.id = oi.product_id GROUP BY p.name, c.name ORDER BY revenue DESC',
    description: '产品销售汇总报表，按收入降序排列',
    tags: 'sales,report,product',
    status: 'PUBLISHED',
    createdAt: new Date('2023-11-28T14:30:00Z'),
    updatedAt: new Date('2023-12-05T09:15:00Z')
  },
  {
    id: '3',
    name: '订单状态分析',
    dataSourceId: '2',
    sqlContent: 'SELECT status, COUNT(*) as count, AVG(total_amount) as avg_amount FROM orders WHERE created_at BETWEEN :start_date AND :end_date GROUP BY status',
    description: '分析特定时间段内各种订单状态的数量和平均金额',
    tags: 'orders,status,analysis',
    status: 'DRAFT',
    createdAt: new Date('2023-11-15T11:20:00Z'),
    updatedAt: new Date('2023-11-15T11:20:00Z')
  },
  {
    id: '4',
    name: '用户留存率',
    dataSourceId: '1',
    sqlContent: 'WITH first_activity AS (\n  SELECT user_id, MIN(DATE(created_at)) as first_date\n  FROM user_activities\n  GROUP BY user_id\n),\nretention AS (\n  SELECT\n    f.first_date,\n    COUNT(DISTINCT f.user_id) as new_users,\n    COUNT(DISTINCT CASE WHEN DATE(a.created_at) = DATE_ADD(f.first_date, INTERVAL 7 DAY) THEN a.user_id END) as retained_users_7d\n  FROM first_activity f\n  LEFT JOIN user_activities a ON f.user_id = a.user_id\n  GROUP BY f.first_date\n)\nSELECT\n  first_date,\n  new_users,\n  retained_users_7d,\n  ROUND(retained_users_7d / new_users * 100, 2) as retention_rate_7d\nFROM retention\nWHERE first_date >= :start_date\nORDER BY first_date DESC',
    description: '计算用户7天留存率',
    tags: 'users,retention,analysis,cohort',
    status: 'PUBLISHED',
    createdAt: new Date('2023-10-22T16:45:00Z'),
    updatedAt: new Date('2023-12-03T13:10:00Z')
  },
  {
    id: '5',
    name: '库存预警',
    dataSourceId: '2',
    sqlContent: 'SELECT\n  p.id,\n  p.name,\n  p.sku,\n  i.quantity as current_stock,\n  p.reorder_level,\n  DATEDIFF(NOW(), MAX(o.created_at)) as days_since_last_order,\n  ROUND(SUM(oi.quantity) / COUNT(DISTINCT DATE(o.created_at)), 2) as daily_avg_demand\nFROM products p\nJOIN inventory i ON p.id = i.product_id\nLEFT JOIN order_items oi ON p.id = oi.product_id\nLEFT JOIN orders o ON oi.order_id = o.id AND o.created_at > DATE_SUB(NOW(), INTERVAL 30 DAY)\nWHERE i.quantity <= p.reorder_level\nGROUP BY p.id, p.name, p.sku, i.quantity, p.reorder_level\nORDER BY (i.quantity / daily_avg_demand) ASC',
    description: '显示低于再订购水平的产品库存，并计算基于近30天销售的库存消耗天数',
    tags: 'inventory,alert,stock',
    status: 'PUBLISHED',
    createdAt: new Date('2023-09-18T09:30:00Z'),
    updatedAt: new Date('2023-11-20T11:25:00Z')
  }
];

// 根据SQL返回适当的模拟查询结果
export function getMockQueryResult(sql: string, options?: any): any {
  // 简单的启发式方法来确定返回哪种结果
  sql = sql.toLowerCase();
  
  // 检查SQL中的关键字，根据复杂性返回不同的结果
  if (sql.includes('join') && (sql.includes('group by') || sql.includes('order by'))) {
    return {
      ...mockComplexQueryResult,
      executionTime: Math.floor(Math.random() * 100) + 50  // 50-150ms随机执行时间
    };
  }
  
  if (sql.includes('large') || sql.includes('big') || sql.includes('all') || options?.limit > 50) {
    return {
      ...mockLargeQueryResult,
      executionTime: Math.floor(Math.random() * 200) + 150  // 150-350ms随机执行时间
    };
  }
  
  // 默认返回简单结果
  return {
    ...mockQueryResult,
    executionTime: Math.floor(Math.random() * 20) + 5  // 5-25ms随机执行时间
  };
}

// 获取模拟查询历史
export function getMockQueryHistory(dataSourceId?: string): QueryHistory[] {
  if (dataSourceId) {
    return mockQueryHistory.filter(h => h.dataSourceId === dataSourceId);
  }
  return mockQueryHistory;
}

// 获取模拟保存的查询
export function getMockSavedQueries(filter?: any): Query[] {
  let result = [...mockSavedQueries];
  
  if (filter?.dataSourceId) {
    result = result.filter(q => q.dataSourceId === filter.dataSourceId);
  }
  
  if (filter?.status) {
    result = result.filter(q => q.status === filter.status);
  }
  
  if (filter?.tags) {
    result = result.filter(q => q.tags.includes(filter.tags));
  }
  
  if (filter?.search) {
    const search = filter.search.toLowerCase();
    result = result.filter(q => 
      q.name.toLowerCase().includes(search) || 
      q.description.toLowerCase().includes(search) || 
      q.sqlContent.toLowerCase().includes(search)
    );
  }
  
  return result;
}