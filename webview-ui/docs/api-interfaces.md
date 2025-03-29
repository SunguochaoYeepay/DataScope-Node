# DataScope API 接口文档

本文档详细说明了DataScope前端与后端之间的API接口定义，包括数据源管理、查询执行、元数据管理和集成功能等相关接口。

## 目录

- [通用数据结构](#通用数据结构)
- [数据源管理](#数据源管理)
- [查询管理](#查询管理)
- [元数据管理](#元数据管理)
- [集成功能](#集成功能)

## 通用数据结构

### 分页响应 (PageResponse)

用于返回分页数据的通用结构。

```typescript
interface PageResponse<T> {
  items: T[];       // 当前页的数据项
  total: number;    // 总记录数
  page: number;     // 当前页码
  size: number;     // 每页大小
  totalPages: number; // 总页数
}
```

## 数据源管理

### 数据源相关类型

```typescript
// 数据源类型
type DataSourceType = 'MYSQL' | 'POSTGRESQL' | 'ORACLE' | 'SQLSERVER' | 'MONGODB' | 'ELASTICSEARCH';

// 数据源状态
type DataSourceStatus = 'ACTIVE' | 'INACTIVE' | 'ERROR' | 'SYNCING';

// 同步频率类型
type SyncFrequency = 'MANUAL' | 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';

// 数据库连接加密方式
type EncryptionType = 'NONE' | 'SSL' | 'TLS';
```

### 数据源对象 (DataSource)

```typescript
interface DataSource {
  id: string;
  name: string;
  description: string;
  type: DataSourceType;
  host: string;
  port: number;
  databaseName: string;
  username: string;
  password?: string;
  status: DataSourceStatus;
  syncFrequency: SyncFrequency;
  lastSyncTime?: string;
  createdAt: string;
  updatedAt: string;
  errorMessage?: string;
  connectionOptions?: Record<string, string>;
  encryptionType?: EncryptionType;
  encryptionOptions?: Record<string, string>;
  metadata?: Metadata;
}
```

### 获取数据源列表

**请求路径:** `/api/datasources`

**请求方法:** `GET`

**请求参数:**

```typescript
interface DataSourceQueryParams {
  name?: string;              // 按名称过滤
  type?: DataSourceType;      // 按类型过滤
  status?: DataSourceStatus;  // 按状态过滤
  page?: number;              // 页码
  size?: number;              // 每页大小
}
```

**响应:**

```typescript
PageResponse<DataSource>
```

### 获取数据源详情

**请求路径:** `/api/datasources/{id}`

**请求方法:** `GET`

**请求参数:** 路径参数 `id`

**响应:** `DataSource`

### 创建数据源

**请求路径:** `/api/datasources`

**请求方法:** `POST`

**请求体:**

```typescript
interface CreateDataSourceParams {
  name: string;
  description: string;
  type: DataSourceType;
  host: string;
  port: number;
  databaseName: string;
  username: string;
  password: string;
  syncFrequency: SyncFrequency;
  connectionOptions?: Record<string, string>;
  encryptionType?: EncryptionType;
  encryptionOptions?: Record<string, string>;
}
```

**响应:** `DataSource`

### 更新数据源

**请求路径:** `/api/datasources/{id}`

**请求方法:** `PUT`

**请求体:**

```typescript
interface UpdateDataSourceParams {
  id: string;
  name?: string;
  description?: string;
  host?: string;
  port?: number;
  databaseName?: string;
  username?: string;
  password?: string;
  syncFrequency?: SyncFrequency;
  connectionOptions?: Record<string, string>;
  encryptionType?: EncryptionType;
  encryptionOptions?: Record<string, string>;
}
```

**响应:** `DataSource`

### 删除数据源

**请求路径:** `/api/datasources/{id}`

**请求方法:** `DELETE`

**请求参数:** 路径参数 `id`

**响应:** 无

### 测试数据源连接

**请求路径:** `/api/datasources/test-connection`

**请求方法:** `POST`

**请求体:**

```typescript
interface TestConnectionParams {
  type: DataSourceType;
  host: string;
  port: number;
  databaseName: string;
  username: string;
  password: string;
  connectionOptions?: Record<string, string>;
  encryptionType?: EncryptionType;
  encryptionOptions?: Record<string, string>;
}
```

**响应:**

```typescript
interface ConnectionTestResult {
  success: boolean;
  message?: string;
  connectionInfo?: {
    databaseType: string;
    databaseVersion: string;
    driverVersion: string;
    pingTime: number;
  }
}
```

### 同步数据源元数据

**请求路径:** `/api/datasources/{id}/sync`

**请求方法:** `POST`

**请求体:**

```typescript
interface SyncMetadataParams {
  id: string;
  filters?: {
    includeSchemas?: string[];
    excludeSchemas?: string[];
    includeTables?: string[];
    excludeTables?: string[];
  }
}
```

**响应:**

```typescript
interface MetadataSyncResult {
  success: boolean;
  message?: string;
  tablesCount?: number;
  viewsCount?: number;
  syncDuration?: number;
  lastSyncTime?: string;
}
```

## 查询管理

### 查询相关类型

```typescript
// 查询类型
type QueryType = 'SQL' | 'NATURAL_LANGUAGE';

// 查询状态
type QueryStatus = 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

// 列数据类型
type ColumnType = 
  'STRING' | 
  'INTEGER' | 
  'DECIMAL' | 
  'BOOLEAN' | 
  'DATE' | 
  'DATETIME' | 
  'TIMESTAMP' | 
  'JSON' | 
  'ARRAY' | 
  'BINARY' | 
  'UNKNOWN';
```

### 查询对象 (Query)

```typescript
interface Query {
  id: string;
  name?: string;
  dataSourceId: string;
  queryType: QueryType;
  queryText: string;
  status: QueryStatus;
  createdAt: string;
  updatedAt: string;
  executionTime?: number;  // 毫秒
  resultCount?: number;
  error?: string;
  isFavorite?: boolean;
  description?: string;
  tags?: string[];
}
```

### 查询结果 (QueryResult)

```typescript
interface QueryResult {
  id: string;
  columns: string[];
  columnTypes?: ColumnType[];
  rows: Record<string, any>[];
  rowCount: number;
  executionTime?: number;
  hasMore?: boolean;
  status?: QueryStatus;
  error?: string;
  createdAt?: string;
}
```

### 执行SQL查询

**请求路径:** `/api/queries/execute`

**请求方法:** `POST`

**请求体:**

```typescript
interface ExecuteQueryParams {
  dataSourceId: string;
  queryType: QueryType;
  queryText: string;
  limit?: number;
  offset?: number;
  parameters?: Record<string, any>;
}
```

**响应:** `QueryResult`

### 执行自然语言查询

**请求路径:** `/api/queries/natural-language`

**请求方法:** `POST`

**请求体:**

```typescript
interface NaturalLanguageQueryParams {
  dataSourceId: string;
  question: string;
  context?: string;
}
```

**响应:**

```typescript
{
  query: Query;
  result: QueryResult;
}
```

### 取消查询

**请求路径:** `/api/queries/{id}/cancel`

**请求方法:** `POST`

**请求参数:** 路径参数 `id`

**响应:** `boolean`

### 获取查询状态

**请求路径:** `/api/queries/{id}/status`

**请求方法:** `GET`

**请求参数:** 路径参数 `id`

**响应:**

```typescript
{
  status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  result?: QueryResult;
}
```

### 获取查询历史

**请求路径:** `/api/queries/history`

**请求方法:** `GET`

**请求参数:**

```typescript
interface QueryHistoryParams {
  dataSourceId?: string;
  queryType?: QueryType;
  startDate?: string;
  endDate?: string;
  status?: QueryStatus;
  page?: number;
  size?: number;
}
```

**响应:** `PageResponse<Query>`

### 获取查询详情

**请求路径:** `/api/queries/{id}`

**请求方法:** `GET`

**请求参数:** 路径参数 `id`

**响应:** `Query`

### 保存查询

**请求路径:** `/api/queries` 或 `/api/queries/{id}`

**请求方法:** `POST`（新建）或 `PUT`（更新）

**请求体:**

```typescript
interface SaveQueryParams {
  id?: string;
  name: string;
  dataSourceId: string;
  queryType: QueryType;
  queryText: string;
  description?: string;
  tags?: string[];
}
```

**响应:** `Query`

### 获取查询执行计划

**请求路径:** `/api/queries/{id}/execution-plan`

**请求方法:** `GET`

**请求参数:** 路径参数 `id`

**响应:**

```typescript
interface QueryExecutionPlan {
  id: string;
  queryId: string;
  planDetails: {
    steps: Array<{
      type: string;
      table?: string;
      condition?: string;
      columns?: string[];
      cost: number;
      rows: number;
    }>;
    totalCost: number;
    estimatedRows: number;
  };
  estimatedCost?: number;
  estimatedRows?: number;
  createdAt: string;
}
```

### 创建查询可视化

**请求路径:** `/api/queries/{id}/visualizations`

**请求方法:** `POST`

**请求体:**

```typescript
interface ChartConfig {
  chartType: 'bar' | 'line' | 'pie' | 'scatter';
  title?: string;
  xAxis: string;
  yAxis: string;
  groupBy?: string;
  aggregateFunction?: 'sum' | 'avg' | 'count' | 'max' | 'min';
  colorField?: string;
  enableDataZoom?: boolean;
  showLegend?: boolean;
}

{
  displayType: 'TABLE' | 'CHART';
  chartType?: 'bar' | 'line' | 'pie' | 'scatter';
  title?: string;
  description?: string;
  config?: ChartConfig;
}
```

**响应:**

```typescript
interface QueryVisualization {
  id: string;
  queryId: string;
  nodes?: QueryNode[];
  displayType?: 'TABLE' | 'CHART';
  chartType?: 'bar' | 'line' | 'pie' | 'scatter';
  title?: string;
  description?: string;
  config?: ChartConfig;
  createdAt: string;
}
```

## 元数据管理

### 元数据相关类型

```typescript
interface Metadata {
  tables: TableMetadata[];
  views?: TableMetadata[];
  databaseVersion?: string;
  databaseProductName?: string;
  lastSyncTime?: string;
}

interface TableMetadata {
  name: string;
  type: 'TABLE' | 'VIEW' | 'MATERIALIZED_VIEW' | 'SYSTEM_TABLE' | 'SYSTEM_VIEW' | 'OTHER';
  comment?: string;
  schema?: string;
  catalog?: string;
  columns: ColumnMetadata[];
  primaryKey?: string[];
  indices?: IndexMetadata[];
}

interface ColumnMetadata {
  name: string;
  type: string;
  size?: number;
  scale?: number;
  nullable: boolean;
  defaultValue?: string;
  primaryKey: boolean;
  foreignKey: boolean;
  referencedTable?: string;
  referencedColumn?: string;
  unique: boolean;
  autoIncrement: boolean;
  comment?: string;
}

interface IndexMetadata {
  name: string;
  type: 'BTREE' | 'HASH' | 'FULLTEXT' | 'OTHER';
  columns: string[];
  unique: boolean;
}
```

### 获取数据源的表元数据

**请求路径:** `/api/datasources/{dataSourceId}/tables/{tableName}`

**请求方法:** `GET`

**请求参数:** 
- 路径参数 `dataSourceId`
- 路径参数 `tableName`

**响应:** `TableMetadata`

### 获取数据源的所有表

**请求路径:** `/api/datasources/{dataSourceId}/tables`

**请求方法:** `GET`

**请求参数:** 
- 路径参数 `dataSourceId`
- 查询参数 `schema`（可选）
- 查询参数 `type`（可选，如'TABLE'/'VIEW'）

**响应:** `TableMetadata[]`

### 定义表关系

**请求路径:** `/api/datasources/{dataSourceId}/relationships`

**请求方法:** `POST`

**请求体:**

```typescript
interface TableRelationship {
  id?: string;
  sourceTable: string;
  sourceColumn: string;
  targetTable: string;
  targetColumn: string;
  relationType: 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_ONE' | 'MANY_TO_MANY';
  isForeignKey: boolean;
  name?: string;
  description?: string;
}
```

**响应:** `TableRelationship`

### 获取表关系

**请求路径:** `/api/datasources/{dataSourceId}/relationships`

**请求方法:** `GET`

**请求参数:** 
- 路径参数 `dataSourceId`
- 查询参数 `table`（可选，指定表名）

**响应:** `TableRelationship[]`

## 集成功能

### 集成相关类型

```typescript
interface Integration {
  id: string;
  name: string;
  description?: string;
  type: 'FORM' | 'TABLE';
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
  queryId: string;
  formConfig?: FormConfig;
  tableConfig?: TableConfig;
  integrationPoint: IntegrationPoint;
  createTime: string;
  updateTime: string;
}

interface IntegrationPoint {
  id: string;
  name: string;
  type: 'URL' | 'FORM_SUBMIT';
  urlConfig?: UrlConfig;
  formSubmitConfig?: FormSubmitConfig;
}
```

### 获取集成列表

**请求路径:** `/api/integrations`

**请求方法:** `GET`

**请求参数:**
- 查询参数 `type`（可选，如'FORM'/'TABLE'）
- 查询参数 `status`（可选）
- 查询参数 `page`（可选）
- 查询参数 `size`（可选）

**响应:** `PageResponse<Integration>`

### 获取集成详情

**请求路径:** `/api/integrations/{id}`

**请求方法:** `GET`

**请求参数:** 路径参数 `id`

**响应:** `Integration`

### 创建集成

**请求路径:** `/api/integrations`

**请求方法:** `POST`

**请求体:** `Integration`（不含id、createTime和updateTime）

**响应:** `Integration`

### 更新集成

**请求路径:** `/api/integrations/{id}`

**请求方法:** `PUT`

**请求体:** `Integration`（不含createTime和updateTime）

**响应:** `Integration`

### 删除集成

**请求路径:** `/api/integrations/{id}`

**请求方法:** `DELETE`

**请求参数:** 路径参数 `id`

**响应:** 无

### 预览集成

**请求路径:** `/api/integrations/{id}/preview`

**请求方法:** `GET`

**请求参数:** 路径参数 `id`

**响应:** 根据集成类型返回预览数据