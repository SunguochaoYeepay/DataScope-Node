var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

// 尝试读取模拟数据
let mockQueries = [];
let mockDataSources = [];
let mockIntegrations = []; // 添加集成数据数组

// 从项目主目录中读取mockData.ts文件
try {
  const mockDataPath = path.join(__dirname, '../../src/plugins/mockData.ts');
  const mockDataContent = fs.readFileSync(mockDataPath, 'utf8');
  
  // 使用简单的正则提取数据
  const queriesMatch = mockDataContent.match(/export\s+const\s+mockQueries\s*=\s*(\[[\s\S]*?\];)/);
  if (queriesMatch && queriesMatch[1]) {
    try {
      // 这种方法并不完美，但足够应对简单的mock数据结构
      const dataStr = queriesMatch[1].replace(/export\s+/g, '')
        .replace(/\bconst\b/g, '')
        .replace(/\blet\b/g, '')
        .replace(/\bvar\b/g, '')
        .replace(/:\s*QueryType/g, '')
        .replace(/:\s*string/g, '')
        .replace(/:\s*number/g, '')
        .replace(/:\s*boolean/g, '')
        .replace(/:\s*any/g, '')
        .replace(/:\s*\w+\[\]/g, '')
        .replace(/:\s*Date/g, '');
      
      mockQueries = eval(dataStr);
      console.log(`[Mock] 成功加载${mockQueries.length}个模拟查询`);
    } catch (error) {
      console.error('[Mock] 解析mockQueries数据失败:', error);
      // 使用空数组作为回退
      mockQueries = [];
    }
  }
  
  // 提取数据源数据
  const datasourcesMatch = mockDataContent.match(/export\s+const\s+mockDataSources\s*=\s*(\[[\s\S]*?\];)/);
  if (datasourcesMatch && datasourcesMatch[1]) {
    try {
      const dataStr = datasourcesMatch[1].replace(/export\s+/g, '')
        .replace(/\bconst\b/g, '')
        .replace(/\blet\b/g, '')
        .replace(/\bvar\b/g, '')
        .replace(/:\s*\w+/g, '')
        .replace(/:\s*\w+\[\]/g, '')
        .replace(/:\s*Date/g, '');
      
      mockDataSources = eval(dataStr);
      console.log(`[Mock] 成功加载${mockDataSources.length}个模拟数据源`);
    } catch (error) {
      console.error('[Mock] 解析mockDataSources数据失败:', error);
      // 使用空数组作为回退
      mockDataSources = [];
    }
  }
} catch (error) {
  console.error('[Mock] 读取mockData.ts文件失败:', error);
}

// 如果无法读取原始mock数据，使用简单的示例数据
if (mockQueries.length === 0) {
  mockQueries = [
    {
      id: 'query-1',
      name: '示例查询 1',
      description: '这是一个示例查询',
      sqlContent: 'SELECT * FROM users LIMIT 10',
      dataSourceId: 'ds-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin',
      tags: ['示例', '用户']
    },
    {
      id: 'query-2',
      name: '示例查询 2',
      description: '这是另一个示例查询',
      sqlContent: 'SELECT * FROM products LIMIT 20',
      dataSourceId: 'ds-2',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      createdBy: 'admin',
      tags: ['示例', '产品']
    }
  ];
}

if (mockDataSources.length === 0) {
  mockDataSources = [
    {
      id: 'ds-1',
      name: '示例数据源 1',
      type: 'MYSQL',
      host: 'localhost',
      port: 3306,
      username: 'root',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'ds-2',
      name: '示例数据源 2',
      type: 'POSTGRESQL',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];
}

// 初始化模拟集成数据
mockIntegrations = [
  {
    id: 'integration-1',
    name: '用户列表',
    description: '系统用户数据列表',
    type: 'TABLE',
    status: 'ACTIVE',
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    createdBy: 'admin',
    dataSourceId: 'ds-1',
    queryId: 'query-1',
    config: {
      dataSourceId: 'ds-1',
      query: 'SELECT * FROM users',
      queryParams: []
    }
  },
  {
    id: 'integration-2',
    name: '销售统计',
    description: '月度销售统计图表',
    type: 'CHART',
    status: 'ACTIVE',
    createTime: new Date(Date.now() - 86400000).toISOString(),
    updateTime: new Date(Date.now() - 86400000).toISOString(),
    createdBy: 'admin',
    dataSourceId: 'ds-1',
    queryId: 'query-2',
    config: {
      dataSourceId: 'ds-1',
      query: 'SELECT month, sum(amount) as total FROM sales GROUP BY month',
      queryParams: []
    }
  },
  {
    id: 'integration-3',
    name: '产品库存',
    description: '产品当前库存情况',
    type: 'SIMPLE_TABLE',
    status: 'DRAFT',
    createTime: new Date(Date.now() - 2 * 86400000).toISOString(),
    updateTime: new Date(Date.now() - 2 * 86400000).toISOString(),
    createdBy: 'admin',
    dataSourceId: 'ds-2',
    queryId: 'query-3',
    config: {
      dataSourceId: 'ds-2',
      query: 'SELECT product_name, category, stock FROM inventory',
      queryParams: []
    }
  }
];

// 打印路由路径信息
console.log('[路由调试] Mock服务器启动，正在注册路由...');
console.log('[路由调试] 集成列表API路径: /low-code/apis');
console.log('[路由调试] 当前集成数据数量:', mockIntegrations.length);

// 添加延迟函数，模拟网络延迟
function addDelay(callback) {
  const delay = Math.random() * 400 + 200; // 随机延迟200-600ms
  setTimeout(callback, delay);
}

// 输出所有请求的调试信息
router.use(function(req, res, next) {
  console.log(`[路由调试] 收到请求: ${req.method} ${req.originalUrl}`);
  
  // 为所有响应添加禁用缓存的头信息
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store',
    'ETag': Math.random().toString(), // 每次生成不同的ETag
    'X-Random-Value': Date.now().toString() // 添加时间戳确保每次响应不同
  });
  
  next();
});

// 注意：Express中的路由匹配会按照定义顺序进行
// 所以更具体的路由应该放在前面，通用处理放在最后

// 集成API - 这是最关键的路由
// GET 获取集成列表
router.get('/low-code/apis', function(req, res) {
  console.log('[Mock] 匹配到集成列表路由: GET /low-code/apis');
  
  addDelay(() => {
    console.log(`[Mock] 返回${mockIntegrations.length}个集成对象`);
    // 直接返回数组，不要包装在对象中
    res.json(mockIntegrations);
  });
});

// GET 获取单个集成
router.get('/low-code/apis/:id', function(req, res) {
  addDelay(() => {
    const id = req.params.id;
    console.log('[Mock] 匹配到单个集成路由: GET /low-code/apis/' + id);
    
    const integration = mockIntegrations.find(i => i.id === id);
    if (!integration) {
      return res.status(404).json({
        success: false,
        message: `未找到ID为${id}的集成`,
        error: {
          code: 'NOT_FOUND',
          message: `未找到ID为${id}的集成`
        }
      });
    }
    
    // 确保返回的集成数据包含必要字段
    const enhancedIntegration = {
      ...integration,
      // 如果没有dataSourceId或queryId，从config中提取
      dataSourceId: integration.dataSourceId || integration.config?.dataSourceId || 'ds-1',
      queryId: integration.queryId || integration.config?.queryId || 'query-1'
    };
    
    console.log('[Mock] 返回增强的集成数据:', {
      id: enhancedIntegration.id,
      name: enhancedIntegration.name,
      dataSourceId: enhancedIntegration.dataSourceId,
      queryId: enhancedIntegration.queryId
    });
    
    res.json(enhancedIntegration);
  });
});

// 查询列表API 
router.get('/queries', function(req, res) {
  console.log('[Mock] GET /queries');
  
  addDelay(() => {
    // 解析分页参数
    const page = parseInt(req.query.page || '1', 10);
    const size = parseInt(req.query.size || '10', 10);
    
    // 应用分页
    const start = (page - 1) * size;
    const end = start + size;
    const paginatedQueries = mockQueries.slice(start, Math.min(end, mockQueries.length));
    
    res.json({
      success: true,
      data: {
        items: paginatedQueries,
        total: mockQueries.length,
        page,
        size,
        totalPages: Math.ceil(mockQueries.length / size)
      }
    });
  });
});

// 获取数据源列表
router.get('/datasources', function(req, res) {
  addDelay(() => {
    console.log('[Mock] GET /api/datasources');
    
    // 解析分页参数
    const page = parseInt(req.query.page || '1', 10);
    const size = parseInt(req.query.size || '10', 10);
    
    // 应用分页
    const start = (page - 1) * size;
    const end = start + size;
    const paginatedSources = mockDataSources.slice(start, Math.min(end, mockDataSources.length));
    
    res.json({
      success: true,
      data: {
        items: paginatedSources,
        pagination: {
          total: mockDataSources.length,
          totalPages: Math.ceil(mockDataSources.length / size),
          page,
          size
        }
      }
    });
  });
});

// 获取查询执行计划
router.get('/queries/:id/execution-plan', function(req, res) {
  addDelay(() => {
    const queryId = req.params.id;
    console.log('[Mock] GET /api/queries/' + queryId + '/execution-plan');
    
    const query = mockQueries.find(q => q.id === queryId);
    
    if (!query) {
      return res.status(404).json({
        success: false,
        message: `未找到ID为${queryId}的查询`,
        error: {
          code: 'NOT_FOUND',
          message: `未找到ID为${queryId}的查询`
        }
      });
    }
    
    // 创建模拟执行计划
    const executionPlan = {
      plan: [
        {
          type: 'Scan',
          description: '全表扫描',
          table: 'users',
          cost: 100,
          rows: 1000
        },
        {
          type: 'Filter',
          description: 'WHERE name LIKE "%user%"',
          cost: 20,
          rows: 500
        },
        {
          type: 'Sort',
          description: 'ORDER BY created_at DESC',
          cost: 50,
          rows: 500
        }
      ],
      estimatedCost: 170,
      estimatedRows: 500,
      planningTime: 0.012,
      executionTime: 0.253
    };
    
    res.json({
      success: true,
      data: executionPlan
    });
  });
});

// 执行查询
router.post('/queries/:id/execute', function(req, res) {
  addDelay(() => {
    const queryId = req.params.id;
    console.log('[Mock] POST /api/queries/' + queryId + '/execute');
    
    const query = mockQueries.find(q => q.id === queryId);
    
    if (!query) {
      return res.status(404).json({
        success: false,
        message: `未找到ID为${queryId}的查询`,
        error: {
          code: 'NOT_FOUND',
          message: `未找到ID为${queryId}的查询`
        }
      });
    }
    
    // 模拟查询结果
    const mockResult = {
      id: `result-${Date.now()}`,
      queryId: queryId,
      status: 'COMPLETED',
      executionTime: 253,
      createdAt: new Date().toISOString(),
      rowCount: 20,
      columns: ['id', 'name', 'email', 'age', 'status', 'created_at'],
      fields: [
        { name: 'id', type: 'integer', displayName: 'ID' },
        { name: 'name', type: 'string', displayName: '名称' },
        { name: 'email', type: 'string', displayName: '邮箱' },
        { name: 'age', type: 'integer', displayName: '年龄' },
        { name: 'status', type: 'string', displayName: '状态' },
        { name: 'created_at', type: 'timestamp', displayName: '创建时间' }
      ],
      rows: Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `测试用户 ${i + 1}`,
        email: `user${i + 1}@example.com`,
        age: Math.floor(Math.random() * 50) + 18,
        status: i % 3 === 0 ? 'active' : (i % 3 === 1 ? 'pending' : 'inactive'),
        created_at: new Date(Date.now() - i * 86400000).toISOString()
      }))
    };
    
    res.json({
      success: true,
      data: mockResult
    });
  });
});

// 处理即席查询
router.post('/queries/execute', function(req, res) {
  addDelay(() => {
    console.log('[Mock] POST /api/queries/execute');
    
    // 模拟查询结果
    const mockResult = {
      id: `result-${Date.now()}`,
      queryId: null,
      status: 'COMPLETED',
      executionTime: 253,
      createdAt: new Date().toISOString(),
      rowCount: 15,
      columns: ['id', 'name', 'email', 'age', 'status', 'created_at'],
      fields: [
        { name: 'id', type: 'integer', displayName: 'ID' },
        { name: 'name', type: 'string', displayName: '名称' },
        { name: 'email', type: 'string', displayName: '邮箱' },
        { name: 'age', type: 'integer', displayName: '年龄' },
        { name: 'status', type: 'string', displayName: '状态' },
        { name: 'created_at', type: 'timestamp', displayName: '创建时间' }
      ],
      rows: Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        name: `临时查询结果 ${i + 1}`,
        email: `temp${i + 1}@example.com`,
        age: Math.floor(Math.random() * 50) + 18,
        status: i % 3 === 0 ? 'active' : (i % 3 === 1 ? 'pending' : 'inactive'),
        created_at: new Date(Date.now() - i * 86400000).toISOString()
      }))
    };
    
    res.json({
      success: true,
      data: mockResult
    });
  });
});

// 获取单个查询
router.get('/queries/:id', function(req, res) {
  addDelay(() => {
    const queryId = req.params.id;
    console.log('[Mock] GET /api/queries/' + queryId);
    
    const query = mockQueries.find(q => q.id === queryId);
    
    if (!query) {
      return res.status(404).json({
        success: false,
        message: `未找到ID为${queryId}的查询`,
        error: {
          code: 'NOT_FOUND',
          message: `未找到ID为${queryId}的查询`
        }
      });
    }
    
    // 确保查询数据包含dataSourceId字段
    const enhancedQuery = {
      ...query,
      // 如果没有dataSourceId，则添加一个默认值
      dataSourceId: query.dataSourceId || 'ds-1'
    };
    
    console.log('[Mock] 返回查询数据:', enhancedQuery);
    
    res.json({
      success: true,
      data: enhancedQuery
    });
  });
});

// 创建集成
router.post('/low-code/apis', function(req, res) {
  addDelay(() => {
    console.log('[Mock] POST /api/low-code/apis');
    const newIntegration = {
      id: `integration-${Date.now()}`,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
      ...req.body
    };
    
    mockIntegrations.push(newIntegration);
    res.status(201).json(newIntegration);
  });
});

// 更新集成
router.put('/low-code/apis/:id', function(req, res) {
  addDelay(() => {
    const id = req.params.id;
    console.log('[Mock] PUT /api/low-code/apis/' + id);
    
    const index = mockIntegrations.findIndex(i => i.id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `未找到ID为${id}的集成`,
        error: {
          code: 'NOT_FOUND',
          message: `未找到ID为${id}的集成`
        }
      });
    }
    
    const updatedIntegration = {
      ...mockIntegrations[index],
      ...req.body,
      updateTime: new Date().toISOString()
    };
    
    mockIntegrations[index] = updatedIntegration;
    res.json(updatedIntegration);
  });
});

// 更新集成状态
router.patch('/low-code/apis/:id/status', function(req, res) {
  addDelay(() => {
    const id = req.params.id;
    const { status } = req.body;
    console.log('[Mock] PATCH /api/low-code/apis/' + id + '/status', status);
    
    const index = mockIntegrations.findIndex(i => i.id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `未找到ID为${id}的集成`,
        error: {
          code: 'NOT_FOUND',
          message: `未找到ID为${id}的集成`
        }
      });
    }
    
    mockIntegrations[index].status = status;
    mockIntegrations[index].updateTime = new Date().toISOString();
    
    res.json(mockIntegrations[index]);
  });
});

// 删除集成
router.delete('/low-code/apis/:id', function(req, res) {
  addDelay(() => {
    const id = req.params.id;
    console.log('[Mock] DELETE /api/low-code/apis/' + id);
    
    const index = mockIntegrations.findIndex(i => i.id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `未找到ID为${id}的集成`,
        error: {
          code: 'NOT_FOUND',
          message: `未找到ID为${id}的集成`
        }
      });
    }
    
    mockIntegrations.splice(index, 1);
    res.status(204).end();
  });
});

// 测试集成
router.post('/low-code/apis/:id/test', function(req, res) {
  addDelay(() => {
    const id = req.params.id;
    console.log('[Mock] POST /api/low-code/apis/' + id + '/test');
    
    const integration = mockIntegrations.find(i => i.id === id);
    if (!integration) {
      return res.status(404).json({
        success: false,
        message: `未找到ID为${id}的集成`,
        error: {
          code: 'NOT_FOUND',
          message: `未找到ID为${id}的集成`
        }
      });
    }
    
    // 模拟测试结果数据
    const testResult = {
      success: true,
      data: {
        totalRows: 25,
        executionTime: 128,
        previewData: Array.from({ length: 5 }, (_, i) => ({
          id: i + 1,
          name: `测试数据 ${i + 1}`,
          value: Math.floor(Math.random() * 1000)
        }))
      }
    };
    
    res.json(testResult);
  });
});

// 处理集成查询API
router.post('/low-code/apis/:id/query', function(req, res) {
  addDelay(() => {
    const id = req.params.id;
    console.log('[Mock] POST /api/low-code/apis/' + id + '/query', req.body);
    
    // 查找集成
    const integration = mockIntegrations.find(i => i.id === id);
    if (!integration) {
      return res.status(404).json({
        success: false,
        message: `未找到ID为${id}的集成`,
        error: {
          code: 'NOT_FOUND',
          message: `未找到ID为${id}的集成`
        }
      });
    }
    
    // 处理查询参数
    const page = parseInt(req.body.page) || 1;
    const pageSize = parseInt(req.body.pageSize) || 20;
    const params = req.body.params || {};
    
    console.log(`[Mock] 集成查询参数: page=${page}, pageSize=${pageSize}, params=`, params);
    
    // 根据集成类型返回不同的数据
    let result;
    
    if (integration.type === 'TABLE' || integration.type === 'SIMPLE_TABLE') {
      // 表格类型集成
      // 创建模拟表格数据
      const totalItems = 50; // 总数据量
      const data = [];
      
      // 获取列配置，如果没有则创建默认列
      const columns = integration.tableConfig?.columns || [
        { field: 'id', label: 'ID', type: 'number', visible: true },
        { field: 'name', label: '名称', type: 'string', visible: true },
        { field: 'date', label: '日期', type: 'date', visible: true },
        { field: 'amount', label: '金额', type: 'number', visible: true },
        { field: 'status', label: '状态', type: 'string', visible: true }
      ];
      
      // 生成表格数据
      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, totalItems);
      
      for (let i = startIndex; i < endIndex; i++) {
        const row = {};
        columns.forEach(column => {
          if (column.type === 'number' || column.field === 'id' || column.field === 'amount') {
            row[column.field] = i + Math.floor(Math.random() * 100);
          } else if (column.type === 'date' || column.field === 'date') {
            const date = new Date();
            date.setDate(date.getDate() - i % 30);
            row[column.field] = date.toISOString().split('T')[0];
          } else if (column.field === 'status') {
            const statuses = ['active', 'inactive', 'pending', 'completed'];
            row[column.field] = statuses[i % statuses.length];
          } else {
            row[column.field] = `${column.field}-${i + 1}`;
          }
        });
        data.push(row);
      }
      
      // 返回表格数据
      result = {
        data: data,
        columns: columns,
        total: totalItems,
        page: page,
        pageSize: pageSize
      };
    } else if (integration.type === 'CHART') {
      // 图表类型集成
      // 创建模拟图表数据
      const chartTypes = ['bar', 'line', 'pie', 'scatter'];
      const chartType = integration.chartConfig?.type || chartTypes[Math.floor(Math.random() * chartTypes.length)];
      
      const data = [];
      const categories = ['类别A', '类别B', '类别C', '类别D', '类别E'];
      const series = ['系列1', '系列2', '系列3'];
      
      // 根据图表类型生成不同的数据结构
      if (chartType === 'pie') {
        // 饼图数据
        categories.forEach((category, index) => {
          data.push({
            name: category,
            value: Math.floor(Math.random() * 1000) + 100
          });
        });
      } else {
        // 条形图、折线图等
        categories.forEach((category, categoryIndex) => {
          series.forEach((serie, serieIndex) => {
            data.push({
              category: category,
              series: serie,
              value: Math.floor(Math.random() * 1000) + 100,
              date: new Date(2023, categoryIndex, 1).toISOString().split('T')[0]
            });
          });
        });
      }
      
      // 返回图表数据
      result = {
        chartType: chartType,
        data: data,
        config: {
          title: integration.chartConfig?.title || '数据图表',
          description: integration.chartConfig?.description || '这是一个模拟的数据图表',
          xField: 'category',
          yField: 'value',
          seriesField: 'series'
        }
      };
    } else {
      // 未知类型集成，返回错误
      return res.status(400).json({
        success: false,
        message: `不支持的集成类型: ${integration.type}`,
        error: {
          code: 'UNSUPPORTED_TYPE',
          message: `不支持的集成类型: ${integration.type}`
        }
      });
    }
    
    // 添加一点随机延迟来模拟网络变化
    setTimeout(() => {
      res.json({
        success: true,
        data: result
      });
    }, Math.random() * 200);
  });
});

// 专门为集成列表请求添加一个通配路由（用于捕获任何格式的集成列表请求）
router.get('*/low-code/apis', function(req, res) {
  console.log(`[Mock] 通配路由捕获到集成列表请求: ${req.originalUrl}`);
  
  addDelay(() => {
    console.log(`[Mock] 通配路由返回${mockIntegrations.length}个集成对象`);
    res.json(mockIntegrations);
  });
});

// 放在最后，通用处理，如果前面的路由没有匹配到
router.all('*', function(req, res) {
  console.log(`[Mock] ${req.method} ${req.originalUrl} - 通用处理`);
  
  addDelay(() => {
    if (req.originalUrl.includes('/low-code/apis') && req.method === 'GET') {
      // 再次尝试处理集成API
      console.log('[Mock] 通用处理中捕获到集成API请求，返回集成列表');
      return res.json(mockIntegrations);
    }
    
    res.json({
      success: true,
      data: {
        message: `API请求处理成功: ${req.originalUrl}`
      }
    });
  });
});

module.exports = router;