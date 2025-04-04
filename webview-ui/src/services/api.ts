// Mock API 服务

import { mock } from 'mockjs';
import dayjs from 'dayjs';

// 导出API服务
export const api = {
  async get(url: string, params?: any): Promise<any> {
    // 实际应用中，这里会调用实际的HTTP请求
    console.log(`[API] GET ${url}`, params);
    // 这里处理路由并返回Mock数据
    const mockHandler = createMockHandler();
    return mockHandler[`GET ${url}`] ? 
      await simulateAsyncCall(() => {
        const response = {} as any;
        mockHandler[`GET ${url}`]({ query: params }, response);
        return response.json;
      }) : null;
  },
  async post(url: string, data?: any): Promise<any> {
    console.log(`[API] POST ${url}`, data);
    const mockHandler = createMockHandler();
    return mockHandler[`POST ${url}`] ? 
      await simulateAsyncCall(() => {
        const response = {} as any;
        mockHandler[`POST ${url}`]({ body: data }, response);
        return response.json;
      }) : null;
  },
  async put(url: string, data?: any): Promise<any> {
    console.log(`[API] PUT ${url}`, data);
    const mockHandler = createMockHandler();
    return mockHandler[`PUT ${url}`] ? 
      await simulateAsyncCall(() => {
        const response = {} as any;
        mockHandler[`PUT ${url}`]({ body: data }, response);
        return response.json;
      }) : null;
  },
  async patch(url: string, data?: any): Promise<any> {
    console.log(`[API] PATCH ${url}`, data);
    // 模拟PATCH请求处理
    // 对于集成状态更新的特殊处理
    if (url.includes('/api/low-code/apis/') && url.includes('/status')) {
      return simulateAsyncCall(() => {
        const id = url.split('/').filter(item => item)[3]; // 提取ID
        console.log(`[Mock API] 处理集成状态更新, ID: ${id}, 新状态:`, data?.status);
        return {
          success: true,
          data: {
            id,
            status: data?.status,
            updateTime: new Date().toISOString()
          }
        };
      });
    }
    
    // 常规处理
    const mockHandler = createMockHandler();
    const patchKey = `PATCH ${url}`;
    const putKey = `PUT ${url}`; // 兼容：如果没有PATCH处理器，尝试使用PUT
    
    if (mockHandler[patchKey]) {
      return simulateAsyncCall(() => {
        const response = {} as any;
        mockHandler[patchKey]({ body: data }, response);
        return response.json;
      });
    } else if (mockHandler[putKey]) {
      // 如果没有PATCH处理器，尝试使用PUT
      console.log(`[API] 未找到PATCH处理器，尝试使用PUT: ${url}`);
      return simulateAsyncCall(() => {
        const response = {} as any;
        mockHandler[putKey]({ body: data }, response);
        return response.json;
      });
    } else {
      console.log(`[API] 未找到处理器: PATCH ${url}`);
      return simulateAsyncCall(() => ({
        success: true,
        data: { ...data, id: url.split('/')[3] }
      }));
    }
  },
  async delete(url: string): Promise<any> {
    console.log(`[API] DELETE ${url}`);
    const mockHandler = createMockHandler();
    return mockHandler[`DELETE ${url}`] ? 
      await simulateAsyncCall(() => {
        const response = {} as any;
        mockHandler[`DELETE ${url}`]({}, response);
        return response.json;
      }) : null;
  }
};

// 模拟网络延迟
const simulateAsyncCall = <T>(callback: () => T): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(callback());
    }, 300);
  });
};

// 定义类型
interface Query {
  id: string;
  name: string;
  description: string;
  dataSourceId: string;
  sqlContent: string;
  status: string;
  queryType: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

interface DataSource {
  id: string;
  name: string;
  type: string;
  host: string;
  port: number;
  database: string;
  status: string;
}

interface MockData {
  queries: Query[];
  dataSources: DataSource[];
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: number;
    message: string;
  };
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

interface QueryListResponse {
  items: Query[];
  pagination: Pagination;
}

interface Column {
  field: string;
  label: string;
  type: string;
}

interface QueryExecuteResponse {
  columns: Column[];
  rows: any[];
  pagination: Pagination;
}

// 模拟数据
const mockData: MockData = {
  queries: [
    {
      id: 'query-1',
      name: '测试查询1',
      description: '这是一个用于测试的查询',
      dataSourceId: 'datasource-1',
      sqlContent: 'SELECT * FROM test_table',
      status: 'PUBLISHED',
      queryType: 'SQL',
      createdAt: dayjs().subtract(5, 'day').format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
      createdBy: 'system',
      updatedBy: 'system'
    },
    {
      id: 'query-2',
      name: '测试查询2',
      description: '另一个测试查询',
      dataSourceId: 'datasource-2',
      sqlContent: 'SELECT * FROM another_table',
      status: 'DRAFT',
      queryType: 'SQL',
      createdAt: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      createdBy: 'system',
      updatedBy: 'system'
    }
  ],
  dataSources: [
    {
      id: 'datasource-1',
      name: '测试数据源1',
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      database: 'test_db',
      status: 'ACTIVE'
    },
    {
      id: 'datasource-2',
      name: '测试数据源2',
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      database: 'another_db',
      status: 'ACTIVE'
    }
  ]
};

// 获取查询
const getQuery = (id: string): Query | undefined => {
  console.log(`[Mock API] 查找查询 ID: ${id}`);
  return mockData.queries.find(q => q.id === id);
};

// 获取数据源
const getDataSource = (id: string): DataSource | undefined => {
  return mockData.dataSources.find(ds => ds.id === id);
};

// 创建Mock处理器函数，用于模拟API行为
const createMockHandler = () => {
  // 查询列表API
  const getQueries = (params: any): ApiResponse<QueryListResponse> => {
    console.log('[Mock API] 获取查询列表:', params);
    
    const { page = 1, pageSize = 10 } = params;
    const total = mockData.queries.length;
    
    return {
      success: true,
      data: {
        items: mockData.queries,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
          hasMore: page * pageSize < total
        }
      }
    };
  };
  
  // 查询详情API
  const getQueryById = (id: string): ApiResponse<Query> => {
    console.log(`[Mock API] 获取查询详情: ${id}`);
    
    const query = getQuery(id);
    if (!query) {
      return {
        success: false,
        error: {
          code: 404,
          message: '查询不存在'
        }
      };
    }
    
    return {
      success: true,
      data: query
    };
  };
  
  // 添加执行查询
  const executeQuery = (id: string, params: any): ApiResponse<QueryExecuteResponse> => {
    console.log('[Mock API] 执行查询:', id, params);
    
    try {
      // 检查查询是否存在
      const query = getQuery(id);
      
      if (!query) {
        console.error(`[Mock API] 查询不存在: ${id}`);
        return {
          success: false,
          error: {
            code: 404,
            message: '查询不存在'
          }
        };
      }
      
      // 模拟查询执行结果
      // 这里可以根据查询ID返回不同的模拟数据
      const result: ApiResponse<QueryExecuteResponse> = {
        success: true,
        data: {
          columns: [
            { field: 'id', label: 'ID', type: 'STRING' },
            { field: 'name', label: '名称', type: 'STRING' },
            { field: 'status', label: '状态', type: 'STRING' },
            { field: 'created_at', label: '创建时间', type: 'DATETIME' }
          ],
          rows: [
            { id: 1, name: '测试数据1', status: 'active', created_at: '2025-01-01 12:00:00' },
            { id: 2, name: '测试数据2', status: 'inactive', created_at: '2025-01-02 13:00:00' },
            { id: 3, name: '测试数据3', status: 'pending', created_at: '2025-01-03 14:00:00' }
          ],
          pagination: {
            total: 3,
            page: 1,
            pageSize: 10
          }
        }
      };
      
      console.log('[Mock API] 查询执行成功:', id);
      return result;
    } catch (error: any) {
      console.error('[Mock API] 查询执行失败:', error);
      return {
        success: false,
        error: {
          code: 500,
          message: `查询执行失败: ${error.message}`
        }
      };
    }
  };

  // 获取数据源列表
  const getDataSources = (): ApiResponse<DataSource[]> => {
    return {
      success: true,
      data: mockData.dataSources
    };
  };

  // 注册API路由处理
  return {
    // 集成接口
    'GET /api/low-code/apis': (req: any, res: any) => {
      console.log('[Mock API] 处理集成列表请求');
      res.json({
        success: true,
        data: [
          {
            id: 'integration-1',
            name: '客户数据集成',
            description: '与CRM系统的客户数据集成',
            type: 'SIMPLE_TABLE',
            status: 'ACTIVE',
            queryId: 'query-1',
            dataSourceId: 'datasource-1',
            config: {
              queryParams: []
            },
            createTime: dayjs().subtract(5, 'day').format('YYYY-MM-DD HH:mm:ss'),
            updateTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss')
          },
          {
            id: 'integration-2',
            name: '订单数据集成',
            description: '与订单系统集成',
            type: 'TABLE',
            status: 'ACTIVE',
            queryId: 'query-2',
            dataSourceId: 'datasource-2',
            config: {
              queryParams: []
            },
            createTime: dayjs().subtract(3, 'day').format('YYYY-MM-DD HH:mm:ss'),
            updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
          }
        ]
      });
    },
    
    'GET /api/low-code/apis/:id': (req: any, res: any) => {
      const id = req.url.split('/').pop();
      console.log(`[Mock API] 获取集成详情: ${id}`);
      
      // 模拟不同集成类型的返回数据
      if (id === 'integration-1') {
        res.json({
          id: 'integration-1',
          name: '客户数据集成',
          description: '与CRM系统的客户数据集成',
          type: 'SIMPLE_TABLE',
          status: 'ACTIVE',
          queryId: 'query-1',
          dataSourceId: 'datasource-1',
          config: {
            queryParams: []
          },
          tableConfig: {
            columns: [
              { field: 'id', label: 'ID', type: 'string', align: 'left', visible: true, displayOrder: 0 },
              { field: 'name', label: '姓名', type: 'string', align: 'left', visible: true, displayOrder: 1 },
              { field: 'email', label: '邮箱', type: 'string', align: 'left', visible: true, displayOrder: 2 },
              { field: 'status', label: '状态', type: 'string', displayType: 'TAG', align: 'center', visible: true, displayOrder: 3 }
            ],
            actions: [],
            pagination: { enabled: true, pageSize: 10, pageSizeOptions: [10, 20, 50] },
            export: { enabled: true, formats: ['xlsx', 'csv'], maxRows: 1000 },
            batchActions: [],
            aggregation: { enabled: false, groupByFields: [], aggregationFunctions: [] },
            advancedFilters: { enabled: true, defaultFilters: [], savedFilters: [] }
          },
          createTime: dayjs().subtract(5, 'day').format('YYYY-MM-DD HH:mm:ss'),
          updateTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss')
        });
      } else if (id === 'integration-2') {
        res.json({
          id: 'integration-2',
          name: '订单数据集成',
          description: '与订单系统集成',
          type: 'TABLE',
          status: 'ACTIVE',
          queryId: 'query-2',
          dataSourceId: 'datasource-2',
          config: {
            queryParams: []
          },
          tableConfig: {
            columns: [
              { field: 'orderId', label: '订单ID', type: 'string', align: 'left', visible: true, displayOrder: 0 },
              { field: 'amount', label: '金额', type: 'number', align: 'right', visible: true, displayOrder: 1 },
              { field: 'status', label: '状态', type: 'string', displayType: 'STATUS', align: 'center', visible: true, displayOrder: 2 },
              { field: 'date', label: '日期', type: 'date', align: 'left', visible: true, displayOrder: 3 }
            ],
            actions: [],
            pagination: { enabled: true, pageSize: 10, pageSizeOptions: [10, 20, 50] },
            export: { enabled: true, formats: ['xlsx', 'csv'], maxRows: 1000 },
            batchActions: [],
            aggregation: { enabled: false, groupByFields: [], aggregationFunctions: [] },
            advancedFilters: { enabled: true, defaultFilters: [], savedFilters: [] }
          },
          createTime: dayjs().subtract(3, 'day').format('YYYY-MM-DD HH:mm:ss'),
          updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
        });
      } else if (id === 'integration-3') {
        res.json({
          id: 'integration-3',
          name: '销售数据图表',
          description: '销售数据分析图表',
          type: 'CHART',
          status: 'ACTIVE',
          queryId: 'query-3',
          dataSourceId: 'datasource-1',
          config: {
            queryParams: []
          },
          chartConfig: {
            type: 'bar',
            title: '销售数据分析',
            description: '按月销售数据分析',
            theme: 'default',
            height: 400,
            showLegend: true,
            animation: true,
            dataMapping: {
              xField: 'month',
              yField: 'sales',
              seriesField: 'product'
            },
            styleOptions: {
              colors: ['#4B7BEC', '#45AAF2', '#2ECC71', '#FFC312'],
              backgroundColor: '#ffffff',
              fontFamily: 'Arial, sans-serif',
              borderRadius: 4,
              padding: [20, 20, 30, 40]
            },
            interactions: {
              enableZoom: true,
              enablePan: true,
              enableSelect: true,
              tooltipMode: 'multiple'
            }
          },
          createTime: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm:ss'),
          updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
        });
      } else {
        res.json({
          success: false,
          error: {
            code: 404,
            message: '集成不存在'
          }
        });
      }
    },
    // 查询列表
    'GET /api/queries': (req: any, res: any) => {
      console.log('[Mock API] 处理查询列表请求，请求参数:', req.query);
      
      // 解析请求参数
      const page = parseInt(req.query.page) || 1;
      const size = parseInt(req.query.size) || 10;
      const dataSourceId = req.query.dataSourceId;
      
      // 创建模拟查询数据
      const allQueries = Array.from({ length: 20 }, (_, i) => {
        const id = `query-${(i + 1).toString().padStart(3, '0')}`;
        // 确保每个查询都关联到一个数据源，默认为ds-00x格式
        const dsId = dataSourceId || `ds-${(Math.floor(i/2) + 1).toString().padStart(3, '0')}`;
        
        return {
          id,
          name: `示例查询 ${i + 1}`,
          description: `这是示例查询描述 ${i + 1}`,
          queryType: 'SQL',
          dataSourceId: dsId,
          sql: `SELECT * FROM table_${i + 1}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      });
      
      // 如果有指定数据源ID，过滤查询列表
      let filteredQueries = allQueries;
      if (dataSourceId) {
        filteredQueries = allQueries.filter(q => q.dataSourceId === dataSourceId);
        
        // 如果过滤后没有数据，为该数据源创建一个默认查询
        if (filteredQueries.length === 0) {
          const dsNum = dataSourceId.split('-')[1] || '001';
          filteredQueries = [{
            id: `query-${dsNum}`,
            name: `${dataSourceId}的默认查询`,
            description: `为数据源${dataSourceId}自动创建的查询`,
            queryType: 'SQL',
            dataSourceId: dataSourceId,
            sql: 'SELECT * FROM example_table',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }];
        }
      }
      
      // 计算分页
      const total = filteredQueries.length;
      const start = (page - 1) * size;
      const end = Math.min(start + size, total);
      const paginatedQueries = filteredQueries.slice(start, end);
      
      // 返回分页后的数据
      res.json({
        success: true,
        data: {
          items: paginatedQueries,
          page,
          size,
          total,
          totalPages: Math.ceil(total / size),
          hasMore: end < total
        }
      });
    },
    
    // 查询详情
    'GET /api/queries/:id': (req: any, res: any) => {
      console.log('[Mock API] 处理查询详情请求:', req.params.id);
      const result = getQueryById(req.params.id);
      
      if (!result.success) {
        res.status(result.error?.code || 404).json({
          success: false,
          message: result.error?.message || '查询不存在'
        });
        return;
      }
      
      res.json(result);
    },
    
    // 查询执行API
    'POST /api/queries/:id/execute': (req: any, res: any) => {
      console.log('[Mock API] 处理查询执行请求:', req.params.id);
      const { id } = req.params;
      const result = executeQuery(id, req.body);
      
      if (!result.success) {
        // 返回错误响应
        res.status(result.error?.code || 500).json({
          success: false,
          message: result.error?.message || '查询执行失败'
        });
        return;
      }
      
      res.json(result);
    },
    
    // 数据源列表
    'GET /api/datasources': (req: any, res: any) => {
      console.log('[Mock API] 处理数据源列表请求，请求参数:', req.query);
      
      // 解析请求参数
      const page = parseInt(req.query.page) || 1;
      const size = parseInt(req.query.size) || 10;
      
      // 创建模拟数据源数据
      const allDataSources = Array.from({ length: 10 }, (_, i) => {
        const id = `ds-${(i + 1).toString().padStart(3, '0')}`;
        
        return {
          id,
          name: `示例数据源 ${i + 1}`,
          description: `这是示例数据源描述 ${i + 1}`,
          type: i % 3 === 0 ? 'MYSQL' : i % 3 === 1 ? 'POSTGRES' : 'ORACLE',
          host: 'localhost',
          port: 3306 + i,
          database: `db_${i + 1}`,
          username: 'user',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      });
      
      // 计算分页
      const total = allDataSources.length;
      const start = (page - 1) * size;
      const end = Math.min(start + size, total);
      const paginatedDataSources = allDataSources.slice(start, end);
      
      // 返回分页后的数据
      res.json({
        success: true,
        data: {
          items: paginatedDataSources,
          page,
          size,
          total,
          totalPages: Math.ceil(total / size),
          hasMore: end < total
        }
      });
    },

    // 集成查询API
    'POST /api/low-code/apis/:id/query': (req: any, res: any) => {
      const id = req.url.split('/').filter(Boolean).pop().replace(/\?.*/, '');
      console.log(`[Mock API] 处理集成查询请求, 集成ID: ${id}`);
      
      // 解析请求体
      const params = req.body || {};
      console.log(`[Mock API] 查询参数:`, params);

      try {
        // 获取集成配置
        let integrationType = 'SIMPLE_TABLE'; // 默认类型
        
        // 根据集成ID确定类型
        // 原代码: 只处理指定集成ID
        if (id === 'integration-1') {
          integrationType = 'SIMPLE_TABLE';
        } else if (id === 'integration-2') {
          integrationType = 'TABLE';
        } else if (id === 'integration-3') {
          integrationType = 'CHART';
        } else {
          // 新增: 处理任何其他ID，使用URL中的type参数判断
          // 从id中获取类型提示，例如 int-002?type=TABLE 中的TABLE
          const urlParts = id.split('?');
          if (urlParts.length > 1) {
            const typeParam = urlParts[1].match(/type=([^&]*)/);
            if (typeParam && typeParam[1]) {
              const type = typeParam[1].toUpperCase();
              if (['TABLE', 'SIMPLE_TABLE', 'CHART'].includes(type)) {
                integrationType = type as 'TABLE' | 'SIMPLE_TABLE' | 'CHART';
              }
            }
          }
          
          // 如果没有类型提示，则根据ID的命名模式确定
          // 例如 int-001, chart-001 等
          else if (id.startsWith('chart-')) {
            integrationType = 'CHART';
          } else if (id.startsWith('table-')) {
            integrationType = 'TABLE';
          }
          // 否则使用默认的SIMPLE_TABLE类型
        }
        
        console.log(`[Mock API] 集成类型: ${integrationType}, 集成ID: ${id}`);
        
        // 根据集成类型返回不同的数据
        if (integrationType === 'CHART') {
          // 图表数据
          const chartData = Array.from({ length: 12 }, (_, i) => {
            const month = `${i + 1}月`;
            return [
              { month, product: '产品A', sales: Math.floor(Math.random() * 500) + 100 },
              { month, product: '产品B', sales: Math.floor(Math.random() * 400) + 150 },
              { month, product: '产品C', sales: Math.floor(Math.random() * 300) + 200 }
            ];
          }).flat();
          
          res.json({
            success: true,
            data: chartData
          });
        } else {
          // 表格数据
          const page = params.page || 1;
          const pageSize = params.pageSize || 10;
          
          // 生成表格数据
          const allRows = Array.from({ length: 35 }, (_, i) => ({
            id: i + 1,
            name: `测试数据 ${i + 1}`,
            email: `test${i + 1}@example.com`,
            status: i % 3 === 0 ? 'active' : i % 3 === 1 ? 'pending' : 'inactive',
            orderId: `ORD-${1000 + i}`,
            amount: (Math.random() * 1000).toFixed(2),
            date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
          }));
          
          // 计算分页
          const start = (page - 1) * pageSize;
          const end = Math.min(start + pageSize, allRows.length);
          const rows = allRows.slice(start, end);
          
          // 确定要显示的列
          let columns;
          if (integrationType === 'SIMPLE_TABLE') {
            columns = [
              { field: 'id', label: 'ID', type: 'string' },
              { field: 'name', label: '名称', type: 'string' },
              { field: 'email', label: '邮箱', type: 'string' },
              { field: 'status', label: '状态', type: 'string' }
            ];
          } else {
            columns = [
              { field: 'orderId', label: '订单ID', type: 'string' },
              { field: 'amount', label: '金额', type: 'number' },
              { field: 'status', label: '状态', type: 'string' },
              { field: 'date', label: '日期', type: 'date' }
            ];
          }
          
          res.json({
            success: true,
            data: {
              rows,
              columns,
              total: allRows.length,
              page,
              pageSize,
              totalPages: Math.ceil(allRows.length / pageSize),
              hasMore: end < allRows.length
            }
          });
        }
      } catch (error: any) {
        console.error(`[Mock API] 处理集成查询请求失败:`, error);
        res.json({
          success: false,
          error: {
            code: 'INTEGRATION_QUERY_ERROR',
            message: error.message || '处理集成查询请求失败'
          }
        });
      }
    }
  };
};

// 配置Mock服务
const setupMock = (): void => {
  const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
  
  if (!USE_MOCK) {
    console.log('Mock API服务未启用');
    return;
  }
  
  console.log('启动Mock API服务...');
  
  // 注册Mock API路由
  const mockHandler = createMockHandler();
  
  // 添加查询和数据源的Mock处理
  Object.assign(mockHandler, {
    'GET /api/queries': (req: any, res: any) => {
      console.log('[Mock API] 处理查询列表请求，请求参数:', req.query);
      
      // 解析请求参数
      const page = parseInt(req.query.page) || 1;
      const size = parseInt(req.query.size) || 10;
      const dataSourceId = req.query.dataSourceId;
      
      // 创建模拟查询数据
      const allQueries = Array.from({ length: 20 }, (_, i) => {
        const id = `query-${(i + 1).toString().padStart(3, '0')}`;
        // 确保每个查询都关联到一个数据源，默认为ds-00x格式
        const dsId = dataSourceId || `ds-${(Math.floor(i/2) + 1).toString().padStart(3, '0')}`;
        
        return {
          id,
          name: `示例查询 ${i + 1}`,
          description: `这是示例查询描述 ${i + 1}`,
          queryType: 'SQL',
          dataSourceId: dsId,
          sql: `SELECT * FROM table_${i + 1}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      });
      
      // 如果有指定数据源ID，过滤查询列表
      let filteredQueries = allQueries;
      if (dataSourceId) {
        filteredQueries = allQueries.filter(q => q.dataSourceId === dataSourceId);
        
        // 如果过滤后没有数据，为该数据源创建一个默认查询
        if (filteredQueries.length === 0) {
          const dsNum = dataSourceId.split('-')[1] || '001';
          filteredQueries = [{
            id: `query-${dsNum}`,
            name: `${dataSourceId}的默认查询`,
            description: `为数据源${dataSourceId}自动创建的查询`,
            queryType: 'SQL',
            dataSourceId: dataSourceId,
            sql: 'SELECT * FROM example_table',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }];
        }
      }
      
      // 计算分页
      const total = filteredQueries.length;
      const start = (page - 1) * size;
      const end = Math.min(start + size, total);
      const paginatedQueries = filteredQueries.slice(start, end);
      
      // 返回分页后的数据
      res.json({
        success: true,
        data: {
          items: paginatedQueries,
          page,
          size,
          total,
          totalPages: Math.ceil(total / size),
          hasMore: end < total
        }
      });
    },
    
    'GET /api/datasources': (req: any, res: any) => {
      console.log('[Mock API] 处理数据源列表请求，请求参数:', req.query);
      
      // 解析请求参数
      const page = parseInt(req.query.page) || 1;
      const size = parseInt(req.query.size) || 10;
      
      // 创建模拟数据源数据
      const allDataSources = Array.from({ length: 10 }, (_, i) => {
        const id = `ds-${(i + 1).toString().padStart(3, '0')}`;
        
        return {
          id,
          name: `示例数据源 ${i + 1}`,
          description: `这是示例数据源描述 ${i + 1}`,
          type: i % 3 === 0 ? 'MYSQL' : i % 3 === 1 ? 'POSTGRES' : 'ORACLE',
          host: 'localhost',
          port: 3306 + i,
          database: `db_${i + 1}`,
          username: 'user',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      });
      
      // 计算分页
      const total = allDataSources.length;
      const start = (page - 1) * size;
      const end = Math.min(start + size, total);
      const paginatedDataSources = allDataSources.slice(start, end);
      
      // 返回分页后的数据
      res.json({
        success: true,
        data: {
          items: paginatedDataSources,
          page,
          size,
          total,
          totalPages: Math.ceil(total / size),
          hasMore: end < total
        }
      });
    }
  });
  
  // 遍历注册所有路由
  Object.keys(mockHandler).forEach(key => {
    const [method, url] = key.split(' ');
    
    // 使用mockjs注册路由
    mock(url, method, mockHandler[key]);
    
    console.log(`[Mock API] 注册路由: ${method} ${url}`);
  });
  
  console.log('Mock API服务启动完成');
};

export default setupMock; 