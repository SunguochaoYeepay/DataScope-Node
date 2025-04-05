import type { Query, QueryParameter as TypeQueryParameter, QueryResult, QueryStatus, QueryType } from '@/types/query';

// 查询参数类型定义
export interface QueryParameter {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: any;
  description?: string;
}

// 模拟查询参数
export function getMockQueryParameters(queryId: string): QueryParameter[] {
  // 根据queryId生成不同的参数配置
  const paramSets: Record<string, QueryParameter[]> = {
    'query-001': [
      { name: 'userId', type: 'number', required: true, defaultValue: 1, description: '用户ID' },
      { name: 'status', type: 'string', required: false, defaultValue: 'active', description: '状态' }
    ],
    'query-002': [
      { name: 'startDate', type: 'date', required: true, description: '开始日期' },
      { name: 'endDate', type: 'date', required: true, description: '结束日期' },
      { name: 'department', type: 'string', required: false, description: '部门' }
    ],
    'query-003': [
      { name: 'productId', type: 'number', required: true, description: '产品ID' },
      { name: 'includeInactive', type: 'boolean', required: false, defaultValue: false, description: '包含未激活产品' }
    ]
  };
  
  // 如果没有查询id对应的参数，为每个查询ID生成随机参数
  if (!paramSets[queryId]) {
    const randomParamCount = Math.floor(Math.random() * 3) + 1;
    const params: QueryParameter[] = [];
    
    for (let i = 0; i < randomParamCount; i++) {
      const paramTypes = ['string', 'number', 'boolean', 'date'];
      const type = paramTypes[Math.floor(Math.random() * paramTypes.length)];
      
      const param: QueryParameter = {
        name: `param${i + 1}`,
        type,
        required: Math.random() > 0.5,
        description: `参数 ${i + 1} 描述`
      };
      
      // 根据类型添加默认值
      if (Math.random() > 0.5) {
        switch (type) {
          case 'string':
            param.defaultValue = `默认值${i + 1}`;
            break;
          case 'number':
            param.defaultValue = Math.floor(Math.random() * 100);
            break;
          case 'boolean':
            param.defaultValue = Math.random() > 0.5;
            break;
          case 'date':
            param.defaultValue = new Date().toISOString().split('T')[0];
            break;
        }
      }
      
      params.push(param);
    }
    
    return params;
  }
  
  return paramSets[queryId] || [];
}

// 模拟查询结果
export function getMockQueryResult(
  queryId: string, 
  options: { 
    params?: Record<string, any>, 
    page?: number, 
    pageSize?: number 
  }
): { 
  data: any[]; 
  page: number; 
  pageSize: number; 
  totalPages: number; 
  totalRecords: number; 
  executionTime: number;
} {
  const page = options.page || 1;
  const pageSize = options.pageSize || 10;
  
  // 生成足够多的行以支持分页
  const totalRows = 100;
  const totalPages = Math.ceil(totalRows / pageSize);
  
  // 创建随机结果数据
  const rows = [];
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRows);
  
  for (let i = startIndex; i < endIndex; i++) {
    // 针对不同queryId生成不同结构的数据
    if (queryId === 'query-001') {
      rows.push({
        userId: i + 1,
        userName: `用户${i + 1}`,
        email: `user${i + 1}@example.com`,
        status: i % 3 === 0 ? 'active' : (i % 3 === 1 ? 'inactive' : 'pending'),
        createdAt: new Date(Date.now() - i * 86400000).toISOString()
      });
    } else if (queryId === 'query-002') {
      rows.push({
        orderId: `ORD-${1000 + i}`,
        customer: `客户${i % 10 + 1}`,
        amount: Math.round(Math.random() * 10000) / 100,
        department: `部门${i % 5 + 1}`,
        orderDate: new Date(Date.now() - i * 86400000).toISOString()
      });
    } else if (queryId === 'query-003') {
      rows.push({
        productId: 1000 + i,
        productName: `产品${i + 1}`,
        category: `类别${i % 4 + 1}`,
        price: Math.round(Math.random() * 100000) / 100,
        stock: Math.floor(Math.random() * 1000),
        isActive: i % 5 !== 0
      });
    } else {
      // 默认结构
      rows.push({
        id: i + 1,
        name: `项目${i + 1}`,
        value: Math.round(Math.random() * 1000),
        date: new Date(Date.now() - i * 86400000).toISOString()
      });
    }
  }
  
  return {
    data: rows,
    page,
    pageSize,
    totalPages,
    totalRecords: totalRows,
    executionTime: Math.floor(Math.random() * 100) + 50
  };
}

// 将内部QueryParameter转换为TypeQueryParameter
function convertToTypeQueryParameter(param: QueryParameter): TypeQueryParameter {
  return {
    id: `param-${Math.random().toString(36).substring(2, 9)}`,
    name: param.name,
    type: param.type,
    required: param.required,
    defaultValue: param.defaultValue,
    label: param.description
  };
}

// 获取模拟查询详情
export function getMockQueryDetail(queryId: string): Query {
  const timestamp = new Date().toISOString();
  const parameters = getMockQueryParameters(queryId);
  
  return {
    id: queryId,
    name: `查询 ${queryId}`,
    description: `这是查询 ${queryId} 的详细描述`,
    dataSourceId: 'ds-001',
    dataSourceName: '模拟数据源',
    queryType: 'SQL' as QueryType,
    queryText: 'SELECT * FROM example_table',
    status: 'COMPLETED' as QueryStatus,
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy: { id: 'user1', name: '测试用户' },
    updatedBy: { id: 'user1', name: '测试用户' },
    executionCount: Math.floor(Math.random() * 50),
    isFavorite: Math.random() > 0.5,
    isActive: true,
    lastExecutedAt: timestamp,
    resultCount: 100,
    executionTime: Math.floor(Math.random() * 100) + 10,
    serviceStatus: 'ENABLED',
    tags: ['模拟', '测试'],
    currentVersion: {
      id: `ver-${queryId}-1`,
      queryId: queryId,
      versionNumber: 1,
      name: '当前版本',
      sql: 'SELECT * FROM example_table',
      dataSourceId: 'ds-001',
      status: 'PUBLISHED',
      isLatest: true,
      createdAt: timestamp,
      parameters: parameters.map(convertToTypeQueryParameter)
    },
    versions: [{
      id: `ver-${queryId}-1`,
      queryId: queryId,
      versionNumber: 1,
      name: '当前版本',
      sql: 'SELECT * FROM example_table',
      dataSourceId: 'ds-001',
      status: 'PUBLISHED',
      isLatest: true,
      createdAt: timestamp,
      parameters: parameters.map(convertToTypeQueryParameter)
    }]
  };
}

// 导出模拟服务
export const mockQueryService = {
  getQueryParameters: (queryId: string) => getMockQueryParameters(queryId),
  executeQuery: (queryId: string, options: any) => getMockQueryResult(queryId, options),
  getQueryById: (queryId: string) => getMockQueryDetail(queryId)
};