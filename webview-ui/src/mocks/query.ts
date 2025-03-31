import type {
  Query,
  QueryResult,
  ExecuteQueryParams,
  NaturalLanguageQueryParams,
  SaveQueryParams,
  QueryHistoryParams,
  QueryDisplayConfig,
  QueryFavorite,
  PageResponse,
  ColumnDefinition,
  QueryExecutionPlan,
  QuerySuggestion,
  QueryVisualization,
  QueryNode,
  ColumnType,
  QueryStatus,
  ChartConfig
} from '@/types/query'
import { mockDataSourceApi } from './datasource'

// 生成随机ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// 获取随机日期（最近30天内）
const getRandomDate = (days = 30) => {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * days))
  return date.toISOString()
}

// 随机执行时间 (100ms - 5000ms)
const getRandomExecutionTime = () => {
  return Math.floor(Math.random() * 4900) + 100
}

// 确保每个查询都有name属性
const ensureQueryName = (query: any) => {
  if (!query.name) {
    query.name = `查询 ${query.id.substring(0, 8)}`;
  }
  return query;
};

// 模拟查询历史数据
const mockQueries: Query[] = [
  {
    id: "query-001",
    name: '产品销售查询',
    dataSourceId: "ds-001", // 使用固定字符串ID而不是Promise
    queryType: 'DATA', // 将类型改为DATA以便下拉列表能够选择
    queryText: 'SELECT product_name, SUM(quantity) as total_sold, SUM(price * quantity) as revenue FROM sales GROUP BY product_name ORDER BY revenue DESC LIMIT 10',
    status: 'COMPLETED',
    createdAt: getRandomDate(5),
    updatedAt: getRandomDate(5),
    executionTime: getRandomExecutionTime(),
    resultCount: 10,
    isFavorite: true
  },
  {
    id: "query-002",
    name: '月度用户增长',
    dataSourceId: "ds-001",
    queryType: 'DATA', // 将类型改为DATA
    queryText: 'SELECT DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as new_users FROM users GROUP BY month ORDER BY month',
    status: 'COMPLETED',
    createdAt: getRandomDate(10),
    updatedAt: getRandomDate(10),
    executionTime: getRandomExecutionTime(),
    resultCount: 12,
    isFavorite: false
  },
  {
    id: "query-003",
    name: '客户数据分析',
    dataSourceId: "ds-001",
    queryType: 'DATA', // 将类型改为DATA
    queryText: 'Show me the top 5 customers by total purchase amount',
    status: 'COMPLETED',
    createdAt: getRandomDate(3),
    updatedAt: getRandomDate(3),
    executionTime: getRandomExecutionTime(),
    resultCount: 5,
    isFavorite: false
  },
  {
    id: "query-004",
    name: '出错的查询',
    dataSourceId: "ds-001",
    queryType: 'SQL',
    queryText: 'SELECT * FROM non_existent_table',
    status: 'FAILED',
    createdAt: getRandomDate(1),
    updatedAt: getRandomDate(1),
    executionTime: 50,
    error: 'Table "non_existent_table" does not exist',
    isFavorite: false
  },
  {
    id: generateId(),
    name: '月度销售报表',
    dataSourceId: "ds-001", // 修复为字符串
    queryType: 'SQL',
    queryText: 'SELECT DATE_FORMAT(transaction_date, "%Y-%m") as month, SUM(amount) as total_sales FROM transactions GROUP BY month ORDER BY month DESC',
    status: 'COMPLETED',
    createdAt: getRandomDate(7),
    updatedAt: getRandomDate(2),
    executionTime: getRandomExecutionTime(),
    resultCount: 12,
    isFavorite: true
  },
  {
    id: generateId(),
    name: '客户分析报告',
    dataSourceId: "ds-001", // 修复为字符串
    queryType: 'SQL',
    queryText: 'SELECT region, COUNT(*) as customer_count, AVG(lifetime_value) as avg_lifetime_value FROM customers GROUP BY region ORDER BY customer_count DESC',
    status: 'COMPLETED',
    createdAt: getRandomDate(8),
    updatedAt: getRandomDate(1),
    executionTime: getRandomExecutionTime(),
    resultCount: 10,
    isFavorite: true
  },
  {
    id: generateId(),
    name: '库存状态查询',
    dataSourceId: "ds-001", // 修复为字符串
    queryType: 'SQL',
    queryText: 'SELECT product_name, category, quantity_in_stock, CASE WHEN quantity_in_stock < reorder_level THEN "Low" ELSE "OK" END as stock_status FROM inventory ORDER BY quantity_in_stock',
    status: 'COMPLETED',
    createdAt: getRandomDate(4),
    updatedAt: getRandomDate(1),
    executionTime: getRandomExecutionTime(),
    resultCount: 22,
    isFavorite: false
  },
  {
    id: generateId(),
    name: '用户活跃度分析',
    dataSourceId: "ds-001", // 修复为字符串
    queryType: 'SQL',
    queryText: 'SELECT user_id, COUNT(*) as login_count, MAX(login_time) as last_login FROM user_activity WHERE activity_type = "login" GROUP BY user_id ORDER BY login_count DESC LIMIT 20',
    status: 'COMPLETED',
    createdAt: getRandomDate(6),
    updatedAt: getRandomDate(4),
    executionTime: getRandomExecutionTime(),
    resultCount: 20,
    isFavorite: false
  },
  {
    id: generateId(),
    name: '商品类别销售分析',
    dataSourceId: "ds-001", // 修复为字符串
    queryType: 'SQL',
    queryText: 'SELECT c.category_name, SUM(oi.quantity) as items_sold, SUM(oi.quantity * p.price) as revenue FROM order_items oi JOIN products p ON oi.product_id = p.id JOIN categories c ON p.category_id = c.id GROUP BY c.category_name ORDER BY revenue DESC',
    status: 'COMPLETED',
    createdAt: getRandomDate(12),
    updatedAt: getRandomDate(3),
    executionTime: getRandomExecutionTime(),
    resultCount: 8,
    isFavorite: false
  },
  {
    id: generateId(),
    name: '最新注册用户',
    dataSourceId: "ds-001", // 修复为字符串
    queryType: 'SQL',
    queryText: 'SELECT id, username, email, created_at FROM users ORDER BY created_at DESC LIMIT 15',
    status: 'COMPLETED',
    createdAt: getRandomDate(3),
    updatedAt: getRandomDate(1),
    executionTime: getRandomExecutionTime(),
    resultCount: 15,
    isFavorite: false
  },
  {
    id: generateId(),
    name: '订单配送时间分析',
    dataSourceId: "ds-001", // 修复为字符串
    queryType: 'SQL',
    queryText: 'SELECT AVG(DATEDIFF(delivery_date, order_date)) as avg_delivery_days, region FROM orders WHERE status = "delivered" GROUP BY region ORDER BY avg_delivery_days',
    status: 'COMPLETED',
    createdAt: getRandomDate(9),
    updatedAt: getRandomDate(2),
    executionTime: getRandomExecutionTime(),
    resultCount: 7,
    isFavorite: false
  },
  {
    id: generateId(),
    name: '销售代表业绩',
    dataSourceId: mockDataSourceApi.getDataSources({ page: 1, size: 1 }).then(res => res.items[0].id),
    queryType: 'SQL',
    queryText: 'SELECT sales_rep_id, CONCAT(first_name, " ", last_name) as rep_name, COUNT(order_id) as order_count, SUM(order_total) as total_sales FROM orders o JOIN sales_reps sr ON o.sales_rep_id = sr.id WHERE order_date BETWEEN "2023-01-01" AND "2023-12-31" GROUP BY sales_rep_id ORDER BY total_sales DESC',
    status: 'COMPLETED',
    createdAt: getRandomDate(11),
    updatedAt: getRandomDate(5),
    executionTime: getRandomExecutionTime(),
    resultCount: 14,
    isFavorite: true
  },
  {
    id: generateId(),
    name: '产品评价分析',
    dataSourceId: mockDataSourceApi.getDataSources({ page: 1, size: 1 }).then(res => res.items[0].id),
    queryType: 'SQL',
    queryText: 'SELECT p.product_name, AVG(r.rating) as avg_rating, COUNT(r.id) as review_count FROM products p LEFT JOIN reviews r ON p.id = r.product_id GROUP BY p.id ORDER BY avg_rating DESC',
    status: 'COMPLETED',
    createdAt: getRandomDate(14),
    updatedAt: getRandomDate(7),
    executionTime: getRandomExecutionTime(),
    resultCount: 25,
    isFavorite: false
  },
  {
    id: generateId(),
    name: '退款率分析',
    dataSourceId: mockDataSourceApi.getDataSources({ page: 1, size: 1 }).then(res => res.items[0].id),
    queryType: 'SQL',
    queryText: 'SELECT c.category_name, COUNT(DISTINCT o.id) as order_count, COUNT(DISTINCT r.id) as refund_count, (COUNT(DISTINCT r.id) / COUNT(DISTINCT o.id) * 100) as refund_rate FROM orders o JOIN order_items oi ON o.id = oi.order_id JOIN products p ON oi.product_id = p.id JOIN categories c ON p.category_id = c.id LEFT JOIN refunds r ON o.id = r.order_id GROUP BY c.category_name ORDER BY refund_rate DESC',
    status: 'COMPLETED',
    createdAt: getRandomDate(17),
    updatedAt: getRandomDate(9),
    executionTime: getRandomExecutionTime(),
    resultCount: 8,
    isFavorite: false
  },
  {
    id: generateId(),
    name: '自然语言用户行为',
    dataSourceId: mockDataSourceApi.getDataSources({ page: 1, size: 1 }).then(res => res.items[0].id),
    queryType: 'NATURAL_LANGUAGE',
    queryText: '分析最近三个月购买了超过5次的用户',
    status: 'COMPLETED',
    createdAt: getRandomDate(5),
    updatedAt: getRandomDate(2),
    executionTime: getRandomExecutionTime(),
    resultCount: 12,
    isFavorite: false
  },
  {
    id: generateId(),
    name: '自然语言销售趋势',
    dataSourceId: mockDataSourceApi.getDataSources({ page: 1, size: 1 }).then(res => res.items[0].id),
    queryType: 'NATURAL_LANGUAGE',
    queryText: '请分析每个季度的销售趋势',
    status: 'COMPLETED',
    createdAt: getRandomDate(8),
    updatedAt: getRandomDate(1),
    executionTime: getRandomExecutionTime(),
    resultCount: 4,
    isFavorite: true
  },
  {
    id: generateId(),
    name: '自然语言地区对比',
    dataSourceId: mockDataSourceApi.getDataSources({ page: 1, size: 1 }).then(res => res.items[0].id),
    queryType: 'NATURAL_LANGUAGE',
    queryText: '比较不同地区的客户满意度评分',
    status: 'COMPLETED',
    createdAt: getRandomDate(6),
    updatedAt: getRandomDate(3),
    executionTime: getRandomExecutionTime(),
    resultCount: 5,
    isFavorite: false
  },
  {
    id: generateId(),
    name: '进行中的查询',
    dataSourceId: mockDataSourceApi.getDataSources({ page: 1, size: 1 }).then(res => res.items[0].id),
    queryType: 'SQL',
    queryText: 'SELECT * FROM huge_table WHERE complex_condition IN (SELECT id FROM other_table WHERE nested_condition = TRUE)',
    status: 'RUNNING',
    createdAt: getRandomDate(0),
    updatedAt: getRandomDate(0),
    executionTime: null,
    resultCount: null,
    isFavorite: false
  },
  {
    id: generateId(),
    name: '出错的复杂查询',
    dataSourceId: mockDataSourceApi.getDataSources({ page: 1, size: 1 }).then(res => res.items[0].id),
    queryType: 'SQL',
    queryText: 'SELECT a.id, a.name, b.value FROM table_a a JOIN table_b b ON a.id = b.a_id WHERE a.status = "active" GROUP BY a.name HAVING COUNT(*) > 10 ORDER BY b.value DESC',
    status: 'FAILED',
    createdAt: getRandomDate(2),
    updatedAt: getRandomDate(2),
    executionTime: 1200,
    error: 'Syntax error: Unexpected token HAVING',
    isFavorite: false
  }
]

// 确保所有查询都有name属性
mockQueries.forEach(query => ensureQueryName(query));

// 模拟收藏夹查询
const mockFavorites: QueryFavorite[] = [
  {
    id: generateId(),
    queryId: mockQueries[0].id,
    name: '产品销售查询',
    description: '查询产品销售数据，按收入降序排列',
    createdAt: getRandomDate(20),
    updatedAt: getRandomDate(5)
  },
  {
    id: generateId(),
    queryId: mockQueries[5].id,
    name: '月度销售报表',
    description: '按月统计销售总额，用于月度报告',
    createdAt: getRandomDate(15),
    updatedAt: getRandomDate(3)
  },
  {
    id: generateId(),
    queryId: mockQueries[6].id,
    name: '客户分析报告',
    description: '按地区统计客户数量和平均生命周期价值',
    createdAt: getRandomDate(12),
    updatedAt: getRandomDate(2)
  },
  {
    id: generateId(),
    queryId: mockQueries[12].id,
    name: '销售代表业绩',
    description: '分析销售代表的年度业绩指标',
    createdAt: getRandomDate(10),
    updatedAt: getRandomDate(4)
  },
  {
    id: generateId(),
    queryId: mockQueries[16].id,
    name: '自然语言销售趋势',
    description: '使用自然语言查询分析季度销售趋势',
    createdAt: getRandomDate(7),
    updatedAt: getRandomDate(1)
  }
]

// 模拟展示配置
const mockDisplayConfigs: QueryDisplayConfig[] = [
  {
    id: generateId(),
    queryId: mockQueries[0].id,
    displayType: 'CHART',
    chartType: 'BAR',
    title: '产品销售额',
    description: '按产品名称显示销售总额',
    config: {
      xField: 'product_name',
      yField: 'revenue',
      seriesField: 'product_name',
      legend: { position: 'top-right' }
    },
    createdAt: getRandomDate(5),
    updatedAt: getRandomDate(2)
  }
]

// 模拟可视化配置
const mockVisualizations: Record<string, QueryVisualization> = {}

// 模拟执行计划
const mockExecutionPlans: Record<string, QueryExecutionPlan> = {}

// 模拟查询建议
const mockSuggestions: Record<string, QuerySuggestion[]> = {}

// 生成随机的SQL结果
const generateSqlResult = (query: string): QueryResult => {
  // 默认列和数据类型
  let columns: string[] = ['id', 'name', 'value']
  let columnTypes: ColumnType[] = ['INTEGER', 'STRING', 'DECIMAL']
  let rows: any[] = []
  
  if (query.toLowerCase().trim().startsWith('select')) {
    // 检查查询中是否包含特定关键字来自定义结果
    if (query.toLowerCase().includes('product')) {
      columns = [
        'product_id', 'product_name', 'category', 'price', 'total_sold', 'revenue'
      ]
      columnTypes = ['INTEGER', 'STRING', 'STRING', 'DECIMAL', 'INTEGER', 'DECIMAL']
      
      // 生成示例产品数据
      const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Home']
      for (let i = 0; i < 25; i++) {
        const price = Math.random() * 1000 + 10
        const totalSold = Math.floor(Math.random() * 500) + 1
        rows.push({
          product_id: i + 1,
          product_name: `Product ${i + 1}`,
          category: categories[Math.floor(Math.random() * categories.length)],
          price: price.toFixed(2),
          total_sold: totalSold,
          revenue: (price * totalSold).toFixed(2)
        })
      }
    } else if (query.toLowerCase().includes('user')) {
      columns = [
        'user_id', 'username', 'email', 'month', 'new_users'
      ]
      columnTypes = ['INTEGER', 'STRING', 'STRING', 'STRING', 'INTEGER']
      
      // 生成示例用户数据
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      for (let i = 0; i < 12; i++) {
        rows.push({
          user_id: i + 1,
          username: `user${i + 1}`,
          email: `user${i + 1}@example.com`,
          month: months[i],
          new_users: Math.floor(Math.random() * 500) + 100
        })
      }
    } else if (query.toLowerCase().includes('customer')) {
      columns = [
        'customer_id', 'customer_name', 'country', 'total_purchases', 'total_amount'
      ]
      columnTypes = ['INTEGER', 'STRING', 'STRING', 'INTEGER', 'DECIMAL']
      
      // 生成示例客户数据
      const countries = ['USA', 'Canada', 'UK', 'Germany', 'France', 'China', 'Japan', 'Australia']
      for (let i = 0; i < 20; i++) {
        const purchases = Math.floor(Math.random() * 50) + 1
        const avgAmount = Math.random() * 200 + 20
        rows.push({
          customer_id: i + 1,
          customer_name: `Customer ${i + 1}`,
          country: countries[Math.floor(Math.random() * countries.length)],
          total_purchases: purchases,
          total_amount: (purchases * avgAmount).toFixed(2)
        })
      }
    } else if (query.toLowerCase().includes('employee')) {
      columns = [
        'employee_id', 'name', 'department', 'salary', 'hire_date', 'avg_salary'
      ]
      columnTypes = ['INTEGER', 'STRING', 'STRING', 'DECIMAL', 'DATE', 'DECIMAL']
      
      // 生成示例员工数据
      const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations']
      for (let i = 0; i < 15; i++) {
        const salary = Math.floor(Math.random() * 50000) + 30000
        const hireYear = 2010 + Math.floor(Math.random() * 12)
        const hireMonth = Math.floor(Math.random() * 12) + 1
        const hireDay = Math.floor(Math.random() * 28) + 1
        rows.push({
          employee_id: i + 1,
          name: `Employee ${i + 1}`,
          department: departments[Math.floor(Math.random() * departments.length)],
          salary: salary,
          hire_date: `${hireYear}-${String(hireMonth).padStart(2, '0')}-${String(hireDay).padStart(2, '0')}`,
          avg_salary: Math.floor(Math.random() * 60000) + 20000
        })
      }
    } else {
      // 默认数据
      for (let i = 0; i < 30; i++) {
        rows.push({
          id: i + 1,
          name: `Item ${i + 1}`,
          value: (Math.random() * 1000).toFixed(2)
        })
      }
    }
  }
  
  return {
    id: generateId(),
    columns,
    columnTypes,
    rows,
    rowCount: rows.length,
    executionTime: getRandomExecutionTime(),
    status: 'COMPLETED',
    createdAt: new Date().toISOString()
  }
}

// 查询API实现
const queryApiImpl = {
  // 执行SQL查询
  async executeQuery({ queryText, limit = 100, offset = 0 }: ExecuteQueryParams): Promise<QueryResult> {
    console.log("Mock executeQuery called with:", queryText);
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 生成结果
    const result = generateSqlResult(queryText);
    console.log("Generated mock result:", result);
    
    // 确保生成的行数据不为空
    if (!result.rows || result.rows.length === 0) {
      // 生成一些默认数据
      result.columns = ['id', 'name', 'value'];
      result.columnTypes = ['INTEGER', 'STRING', 'DECIMAL'];
      result.rows = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        name: `Sample ${i + 1}`,
        value: (Math.random() * 1000).toFixed(2)
      }));
      result.rowCount = result.rows.length;
    }
    
    // 应用分页
    const paginatedRows = result.rows.slice(offset, offset + limit);
    result.rows = paginatedRows;
    result.hasMore = offset + limit < result.rowCount;
    
    return result;
  },
  
  // 执行自然语言查询
  async executeNaturalLanguageQuery({ question }: NaturalLanguageQueryParams): Promise<{
    query: Query;
    result: QueryResult;
  }> {
    console.log("Mock executeNaturalLanguageQuery called with:", question);
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 根据问题内容生成不同的SQL和结果
    let columns = ['id', 'name', 'value'];
    let columnTypes: ColumnType[] = ['INTEGER', 'STRING', 'DECIMAL'];
    let rows: any[] = [];
    
    if (question.toLowerCase().includes('销售') || question.toLowerCase().includes('产品')) {
      columns = ['product_id', 'product_name', 'category', 'sales_amount', 'quantity'];
      columnTypes = ['INTEGER', 'STRING', 'STRING', 'DECIMAL', 'INTEGER'];
      
      rows = Array.from({ length: 5 }, (_, i) => ({
        product_id: i + 1,
        product_name: `产品 ${i + 1}`,
        category: ['电子产品', '服装', '食品', '家具', '书籍'][i],
        sales_amount: (Math.random() * 10000 + 1000).toFixed(2),
        quantity: Math.floor(Math.random() * 100) + 50
      }));
    } else if (question.toLowerCase().includes('部门') || question.toLowerCase().includes('工资')) {
      columns = ['department', 'employee_count', 'avg_salary'];
      columnTypes = ['STRING', 'INTEGER', 'DECIMAL'];
      
      rows = [
        { department: '研发部', employee_count: 45, avg_salary: 12500 },
        { department: '市场部', employee_count: 30, avg_salary: 11200 },
        { department: '销售部', employee_count: 50, avg_salary: 10800 },
        { department: '人力资源', employee_count: 15, avg_salary: 9500 },
        { department: '财务部', employee_count: 12, avg_salary: 11000 }
      ];
    } else if (question.toLowerCase().includes('用户') || question.toLowerCase().includes('新用户')) {
      columns = ['date', 'new_users', 'total_users', 'growth_rate'];
      columnTypes = ['DATE', 'INTEGER', 'INTEGER', 'DECIMAL'];
      
      const today = new Date();
      rows = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - 29 + i);
        const newUsers = Math.floor(Math.random() * 100) + 10;
        const totalUsers = 5000 + Math.floor(Math.random() * 100) * i;
        return {
          date: date.toISOString().split('T')[0],
          new_users: newUsers,
          total_users: totalUsers,
          growth_rate: (newUsers / totalUsers * 100).toFixed(2)
        };
      });
    } else {
      // 默认数据
      rows = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `示例 ${i + 1}`,
        value: (Math.random() * 1000).toFixed(2)
      }));
    }
    
    // 创建结果对象
    const result: QueryResult = {
      id: generateId(),
      columns,
      columnTypes,
      rows,
      rowCount: rows.length,
      executionTime: Math.floor(Math.random() * 1000) + 500,
      status: 'COMPLETED',
      createdAt: new Date().toISOString()
    };
    
    console.log("Generated NL query result:", result);
    
    // 创建查询对象
    const query: Query = {
      id: generateId(),
      dataSourceId: 'mock-datasource',
      queryType: 'NATURAL_LANGUAGE',
      queryText: question,
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      executionTime: result.executionTime,
      resultCount: result.rowCount
    };
    
    return { query, result };
  },
  
  // 取消查询
  async cancelQuery(queryId: string): Promise<boolean> {
    // 模拟网络延迟 - 使延迟更长一些，模拟取消操作
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))
    
    // 从运行中的查询列表中查找此查询
    const index = mockQueries.findIndex(q => q.id === queryId);
    if (index >= 0) {
      // 更新查询状态为已取消
      mockQueries[index].status = 'CANCELLED';
      mockQueries[index].updatedAt = new Date().toISOString();
      
      // 添加取消信息
      mockQueries[index].error = '查询已被用户取消';
      
      console.log('模拟取消查询:', queryId, '状态已更新为 CANCELLED');
    } else {
      console.log('模拟取消查询:', queryId, '未找到查询');
    }
    
    // 假设总是成功
    return true
  },
  
  // 获取查询状态
  async getQueryStatus(queryId: string): Promise<{ status: QueryStatus; result?: QueryResult }> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // 假设查询总是完成
    return {
      status: 'COMPLETED',
      result: {
        id: queryId,
        columns: ['id', 'name', 'value'],
        columnTypes: ['INTEGER', 'STRING', 'DECIMAL'],
        rows: Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          name: `Result ${i + 1}`,
          value: (Math.random() * 1000).toFixed(2)
        })),
        rowCount: 10,
        executionTime: getRandomExecutionTime(),
        status: 'COMPLETED',
        createdAt: new Date().toISOString()
      }
    }
  },
  
  // 获取查询历史
  async getQueryHistory(params: QueryHistoryParams): Promise<PageResponse<Query>> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 过滤查询
    let filtered = [...mockQueries]
    
    if (params.dataSourceId) {
      filtered = filtered.filter(q => q.dataSourceId === params.dataSourceId)
    }
    
    if (params.queryType) {
      filtered = filtered.filter(q => q.queryType === params.queryType)
    }
    
    if (params.status) {
      filtered = filtered.filter(q => q.status === params.status)
    }
    
    // 分页
    const page = params.page || 0
    const size = params.size || 10
    const start = page * size
    const end = start + size
    const items = filtered.slice(start, end)
    const total = filtered.length
    
    return {
      items,
      total,
      page,
      size,
      totalPages: Math.ceil(total / size)
    }
  },
  
  // 获取单个查询
  async getQuery(id: string): Promise<Query | null> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const query = mockQueries.find(q => q.id === id)
    return query || null
  },
  
  // 保存查询
  async saveQuery(params: SaveQueryParams): Promise<Query> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    let query: Query
    
    if (params.id) {
      // 更新现有查询
      const existingIndex = mockQueries.findIndex(q => q.id === params.id)
      if (existingIndex >= 0) {
        const existing = mockQueries[existingIndex]
        query = {
          ...existing,
          name: params.name,
          queryText: params.queryText,
          description: params.description || existing.description,
          tags: params.tags || existing.tags,
          updatedAt: new Date().toISOString()
        }
        mockQueries[existingIndex] = query
      } else {
        // 如果找不到，创建一个新的
        query = {
          id: params.id,
          dataSourceId: params.dataSourceId,
          queryType: params.queryType,
          queryText: params.queryText,
          status: 'COMPLETED',
          name: params.name,
          description: params.description,
          tags: params.tags,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        mockQueries.push(query)
      }
    } else {
      // 创建新查询
      query = {
        id: generateId(),
        dataSourceId: params.dataSourceId,
        queryType: params.queryType,
        queryText: params.queryText,
        status: 'COMPLETED',
        name: params.name,
        description: params.description,
        tags: params.tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      mockQueries.push(query)
    }
    
    return query
  },
  
  // 删除查询
  async deleteQuery(id: string): Promise<boolean> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = mockQueries.findIndex(q => q.id === id)
    if (index >= 0) {
      mockQueries.splice(index, 1)
      return true
    }
    return false
  },
  
  // 添加到收藏夹
  async favoriteQuery(queryId: string): Promise<QueryFavorite> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // 查找查询
    const query = mockQueries.find(q => q.id === queryId)
    if (!query) {
      throw new Error(`Query with ID ${queryId} not found`)
    }
    
    // 如果已经收藏，返回现有的
    const existing = mockFavorites.find(f => f.queryId === queryId)
    if (existing) {
      return existing
    }
    
    // 创建新收藏
    const favorite: QueryFavorite = {
      id: generateId(),
      queryId,
      name: query.name || `Favorite ${mockFavorites.length + 1}`,
      description: query.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    mockFavorites.push(favorite)
    
    // 更新查询的收藏状态
    query.isFavorite = true
    
    return favorite
  },
  
  // 从收藏夹中移除
  async unfavoriteQuery(queryId: string): Promise<boolean> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // 查找并移除收藏
    const index = mockFavorites.findIndex(f => f.queryId === queryId)
    if (index >= 0) {
      mockFavorites.splice(index, 1)
      
      // 更新查询的收藏状态
      const query = mockQueries.find(q => q.id === queryId)
      if (query) {
        query.isFavorite = false
      }
      
      return true
    }
    
    return false
  },
  
  // 获取收藏的查询
  async getFavorites(): Promise<QueryFavorite[]> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return [...mockFavorites]
  },
  
  // 保存展示配置
  async saveDisplayConfig(queryId: string, config: Partial<QueryDisplayConfig>): Promise<QueryDisplayConfig> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    let displayConfig: QueryDisplayConfig
    
    // 查找现有配置
    const existingIndex = mockDisplayConfigs.findIndex(c => c.queryId === queryId)
    
    if (existingIndex >= 0) {
      // 更新现有配置
      const existing = mockDisplayConfigs[existingIndex]
      displayConfig = {
        ...existing,
        ...config,
        queryId,
        updatedAt: new Date().toISOString()
      } as QueryDisplayConfig
      mockDisplayConfigs[existingIndex] = displayConfig
    } else {
      // 创建新配置
      displayConfig = {
        id: generateId(),
        queryId: queryId,
        displayType: config.displayType || 'TABLE',
        chartType: config.chartType,
        title: config.title,
        description: config.description,
        config: config.config || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as QueryDisplayConfig
      mockDisplayConfigs.push(displayConfig)
    }
    
    return displayConfig
  },
  
  // 获取展示配置
  async getDisplayConfig(queryId: string): Promise<QueryDisplayConfig | null> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const config = mockDisplayConfigs.find(c => c.queryId === queryId)
    return config || null
  },
  
  // 获取查询执行计划
  async getQueryExecutionPlan(queryId: string): Promise<QueryExecutionPlan> {
    // 检查是否已存在计划
    if (mockExecutionPlans[queryId]) {
      return mockExecutionPlans[queryId]
    }
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 创建新的执行计划
    const plan: QueryExecutionPlan = {
      id: generateId(),
      queryId,
      planDetails: {
        steps: [
          {
            type: 'TableScan',
            table: 'customers',
            cost: 10.5,
            rows: 1000
          },
          {
            type: 'Filter',
            condition: 'region = "North"',
            cost: 5.2,
            rows: 250
          },
          {
            type: 'Sort',
            columns: ['total_amount DESC'],
            cost: 8.3,
            rows: 250
          }
        ],
        totalCost: 24.0,
        estimatedRows: 250
      },
      estimatedCost: 24.0,
      estimatedRows: 250,
      createdAt: new Date().toISOString()
    }
    
    // 保存计划
    mockExecutionPlans[queryId] = plan
    
    return plan
  },
  
  // 模拟分析查询计划的方法
  async analyzeQueryPlan(dataSourceId: string, queryText: string): Promise<{
    plan: QueryExecutionPlan,
    suggestions: QuerySuggestion[]
  }> {
    console.log('模拟分析查询计划:', { dataSourceId, queryText })
    
    // 模拟执行计划
    const planNodes: QueryNode[] = [
      {
        id: 'node-1',
        type: 'TableScan',
        details: {
          table: 'users',
          rows: 10000,
          cost: 1000
        },
        children: []
      },
      {
        id: 'node-2',
        type: 'Filter',
        details: {
          condition: 'age > 30',
          rows: 5000,
          cost: 500
        },
        children: ['node-1']
      },
      {
        id: 'node-3',
        type: 'Sort',
        details: {
          sortKey: 'last_name',
          sortOrder: 'ASC',
          rows: 5000,
          cost: 2500
        },
        children: ['node-2']
      }
    ]
    
    // 生成模拟的查询计划
    const plan: QueryExecutionPlan = {
      id: generateId(),
      queryId: generateId(),
      nodes: planNodes,
      totalCost: 4000,
      estimatedRows: 5000
    }
    
    // 生成模拟的查询建议
    const suggestions: QuerySuggestion[] = [
      {
        id: generateId(),
        queryId: plan.queryId,
        type: 'INDEX',
        description: '在users表的age列上添加索引可以提高查询性能',
        impact: 'HIGH',
        sqlSuggestion: 'CREATE INDEX idx_users_age ON users(age)'
      },
      {
        id: generateId(),
        queryId: plan.queryId,
        type: 'QUERY',
        description: '考虑使用LIMIT子句限制返回的数据量',
        impact: 'MEDIUM',
        sqlSuggestion: queryText + ' LIMIT 100'
      }
    ]
    
    return {
      plan,
      suggestions
    }
  },
  
  // 获取查询优化建议
  async getQuerySuggestions(queryId: string): Promise<QuerySuggestion[]> {
    // 检查是否已存在建议
    if (mockSuggestions[queryId]) {
      return mockSuggestions[queryId]
    }
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // 创建新的建议
    const suggestions: QuerySuggestion[] = [
      {
        id: generateId(),
        queryId,
        type: 'OPTIMIZATION',
        title: '添加索引以提高性能',
        description: '在customers表的region列上添加索引可能会提高此查询的性能',
        suggestedQuery: 'CREATE INDEX idx_customers_region ON customers(region)',
        impact: 'MEDIUM',
        createdAt: new Date().toISOString()
      },
      {
        id: generateId(),
        queryId,
        type: 'READABILITY',
        title: '使用表别名提高可读性',
        description: '使用表别名可以使查询更加清晰，特别是在涉及多表时',
        suggestedQuery: 'SELECT c.* FROM customers c WHERE c.region = "North"',
        impact: 'LOW',
        createdAt: new Date().toISOString()
      },
      {
        id: generateId(),
        queryId,
        type: 'SECURITY',
        title: '避免SELECT *',
        description: '明确指定需要的列而不是使用SELECT *可以提高性能并减少不必要的数据暴露',
        suggestedQuery: 'SELECT id, name, email FROM customers WHERE region = "North"',
        impact: 'LOW',
        createdAt: new Date().toISOString()
      }
    ]
    
    // 保存建议
    mockSuggestions[queryId] = suggestions
    
    return suggestions
  },
  
  // 获取查询可视化
  async getQueryVisualization(queryId: string): Promise<QueryVisualization | null> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // 返回已存在的可视化配置或null
    return mockVisualizations[queryId] || null
  },
  
  // 保存查询可视化
  async saveQueryVisualization(queryId: string, config: ChartConfig): Promise<QueryVisualization> {
    // 必须有查询ID
    if (!queryId) {
      throw new Error('Missing queryId in visualization data')
    }
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const defaultNode: QueryNode = {
      id: generateId(),
      type: 'TABLE',
      label: '查询结果表',
      details: { tableName: 'result' }
    }
    
    // 查找现有可视化配置
    const existingVisualization = mockVisualizations[queryId]
    
    // 创建或更新可视化配置
    const visualization: QueryVisualization = {
      id: existingVisualization?.id || generateId(),
      queryId: queryId,
      nodes: existingVisualization?.nodes || [defaultNode],
      displayType: 'CHART',
      chartType: config.chartType,
      title: config.title || '查询可视化',
      description: '',
      config: config,
      createdAt: existingVisualization?.createdAt || new Date().toISOString()
    }
    
    // 保存可视化配置
    mockVisualizations[queryId] = visualization
    
    return visualization
  },
  
  // 导出查询结果
  async exportQueryResults(queryId: string, format: 'csv' | 'excel' | 'json'): Promise<void> {
    // 模拟网络延迟和下载准备
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟下载操作 - 在实际应用中不需要实现，因为真实API会返回文件内容
    console.log(`Mock exporting query ${queryId} results as ${format}`)
    
    // 模拟成功
    return
  },
  
  // 专门获取查询列表的方法(用于下拉选择框)
  async getQueries(params?: { queryType?: string }): Promise<Query[]> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // 过滤查询列表
    let filteredQueries = [...mockQueries];
    
    if (params?.queryType) {
      filteredQueries = filteredQueries.filter(q => q.queryType === params.queryType);
    }
    
    // 确保所有查询都有name属性
    const result = filteredQueries.map(query => {
      if (!query.name) {
        return { ...query, name: `查询 ${query.id}` };
      }
      return query;
    });
    
    console.log('Mock API: getQueries返回数据:', result);
    
    return result;
  },
}

// 导出API
export const mockQueryApi = queryApiImpl
export default mockQueryApi