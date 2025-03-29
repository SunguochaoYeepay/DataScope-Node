# 查询结果分页功能设计文档

## 概述

查询结果分页功能允许系统对大型查询结果集进行分批处理和返回，避免一次性加载大量数据导致内存压力和性能问题。本文档详细描述结果分页功能的设计和实现方案。

## 系统设计

### 1. 架构图

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   API层      │      │   服务层      │      │  连接器层     │
│  Controller  │──────▶  Service     │──────▶  Connector   │
└──────────────┘      └──────────────┘      └──────────────┘
       │                     │                     │
       │                     │                     │
       ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ /api/queries │      │QueryService  │      │MySQLConnector│
│  /execute    │      │executeQuery()│      │executeQuery()│
└──────────────┘      └──────────────┘      └──────────────┘
```

### 2. 分页参数模型

前端请求的分页参数：

```typescript
interface PaginationParams {
  page?: number;       // 当前页码，从1开始
  pageSize?: number;   // 每页记录数
  offset?: number;     // 偏移量（可替代page）
  limit?: number;      // 限制数量（可替代pageSize）
  sort?: string;       // 排序字段
  order?: 'asc'|'desc'; // 排序方向
}
```

后端响应的分页数据结构：

```typescript
interface PaginatedQueryResult {
  data: any[];         // 当前页数据
  page: number;        // 当前页码
  pageSize: number;    // 每页记录数
  total: number;       // 总记录数
  totalPages: number;  // 总页数
  hasNext: boolean;    // 是否有下一页
  hasPrev: boolean;    // 是否有上一页
}
```

## 接口定义

### 1. API接口扩展

修改现有的查询执行API端点，支持分页参数：

```
POST /api/queries/execute
```

请求体：

```json
{
  "dataSourceId": "uuid-string",
  "sql": "SELECT * FROM users",
  "params": [],
  "page": 1,
  "pageSize": 50,
  "sort": "id",
  "order": "asc"
}
```

### 2. 查询服务扩展

```typescript
interface ExecuteQueryOptions {
  dataSourceId: string;
  sql: string;
  params?: any[];
  page?: number;
  pageSize?: number;
  offset?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

async executeQuery(options: ExecuteQueryOptions): Promise<PaginatedQueryResult>
```

### 3. 数据库连接器扩展

```typescript
interface QueryOptions {
  page?: number;
  pageSize?: number;
  offset?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

async executeQuery(sql: string, params?: any[], queryId?: string, options?: QueryOptions): Promise<QueryResult>
```

## 实现方案

### 1. SQL分页转换

将用户SQL转换为分页SQL的策略：

#### MySQL分页实现：

```sql
SELECT * FROM (
  原始SQL
) AS subquery
ORDER BY {sortField} {sortOrder}
LIMIT {offset}, {limit}
```

计算总记录数：

```sql
SELECT COUNT(*) AS total FROM (
  原始SQL
) AS count_query
```

### 2. 查询服务实现

```typescript
async executeQuery(options: ExecuteQueryOptions): Promise<PaginatedQueryResult> {
  const { dataSourceId, sql, params = [], page = 1, pageSize = 50, sort, order } = options;
  
  try {
    // 获取数据源连接器
    const connector = await this.dataSourceService.getConnector(dataSourceId);
    
    // 记录查询开始
    const startTime = new Date();
    let queryHistoryId: string | null = null;
    
    try {
      // 创建查询历史记录
      const queryHistory = await this.prisma.queryHistory.create({
        data: {
          dataSourceId,
          sqlContent: sql,
          status: 'RUNNING',
          startTime,
        }
      });
      queryHistoryId = queryHistory.id;
      
      // 计算总记录数
      const countSql = `SELECT COUNT(*) AS total FROM (${sql}) AS count_query`;
      const countResult = await connector.executeQuery(countSql, params, `${queryHistoryId}_count`);
      const total = parseInt(countResult.rows[0].total, 10);
      
      // 计算分页参数
      const offset = (page - 1) * pageSize;
      const totalPages = Math.ceil(total / pageSize);
      
      // 构建分页SQL
      let paginatedSql = sql;
      
      // 添加排序
      if (sort) {
        const sortOrder = order === 'desc' ? 'DESC' : 'ASC';
        paginatedSql = `SELECT * FROM (${sql}) AS subquery ORDER BY ${sort} ${sortOrder}`;
      }
      
      // 添加分页
      paginatedSql = `${paginatedSql} LIMIT ${offset}, ${pageSize}`;
      
      // 执行分页查询
      const result = await connector.executeQuery(paginatedSql, params, queryHistoryId);
      
      // 更新查询历史为成功
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      
      await this.prisma.queryHistory.update({
        where: { id: queryHistoryId },
        data: {
          status: 'COMPLETED',
          endTime,
          duration,
          rowCount: total,
        }
      });
      
      // 返回分页结果
      return {
        data: result.rows,
        fields: result.fields,
        page,
        pageSize,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      };
    } catch (error) {
      // 错误处理...
    }
  } catch (error) {
    // 错误处理...
  }
}
```

### 3. 分页优化

为避免复杂SQL带来的问题，实现两种分页方式：

1. **简单分页**：直接在原SQL后添加LIMIT/OFFSET
2. **复杂分页**：使用子查询方式

基于SQL复杂度和性能考虑自动选择分页方式：

```typescript
function isSimpleSql(sql: string): boolean {
  // 检测SQL是否包含GROUP BY, HAVING, UNION等复杂操作
  const complexPatterns = [
    /\bGROUP\s+BY\b/i,
    /\bHAVING\b/i,
    /\bUNION\b/i,
    /\bINTERSECT\b/i,
    /\bEXCEPT\b/i,
    /\bDISTINCT\b/i
  ];
  
  return !complexPatterns.some(pattern => pattern.test(sql));
}
```

## 前端集成

### 1. 分页组件

```html
<Pagination
  currentPage={page}
  pageSize={pageSize}
  total={total}
  onPageChange={handlePageChange}
  onPageSizeChange={handlePageSizeChange}
/>
```

### 2. 查询请求集成

```typescript
async function executeQuery(queryOptions: ExecuteQueryOptions) {
  try {
    const response = await apiClient.post('/api/queries/execute', queryOptions);
    
    if (response.success) {
      // 更新查询结果状态
      setQueryResult(response.data);
      
      // 更新分页状态
      setPagination({
        page: response.data.page,
        pageSize: response.data.pageSize,
        total: response.data.total,
        totalPages: response.data.totalPages,
        hasNext: response.data.hasNext,
        hasPrev: response.data.hasPrev
      });
    }
    
    return response;
  } catch (error) {
    // 错误处理...
  }
}
```

## 实现步骤

1. 更新`DatabaseConnector`接口，扩展`executeQuery`方法以支持分页参数
2. 修改`MySQLConnector`实现，支持SQL分页转换
3. 修改`QueryService`中的`executeQuery`方法，添加分页参数和总记录数计算
4. 更新API控制器，处理分页参数
5. 更新API文档，说明分页参数
6. 添加单元测试和集成测试

## 性能优化

1. **索引优化**：确保排序字段建立了索引
2. **延迟计数**：对于超大结果集，可选择不计算总记录数
3. **结果缓存**：缓存分页查询结果，减少重复计算
4. **SQL优化**：分析和优化生成的分页SQL

## 测试计划

### 单元测试

1. 测试分页参数处理
2. 测试SQL转换逻辑
3. 测试结果格式化

### 集成测试

1. 测试不同大小结果集的分页查询
2. 测试各种复杂SQL的分页转换
3. 测试各种排序组合
4. 测试边界条件（第一页、最后一页、空结果）

## 注意事项与限制

1. 分页可能对某些复杂SQL（如包含GROUP BY或嵌套查询）的性能有影响
2. 排序字段需要是有效的列名或表达式
3. 对于非常大的结果集，计算总记录数可能会有性能影响
4. 分页参数需要进行有效性验证，防止恶意查询