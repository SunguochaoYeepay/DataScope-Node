# DataScope 前端开发对接指南

## 快速开始

以下是前端开发常见场景的快速指南，包含示例代码：

### 1. 创建并测试数据源

```javascript
// 创建数据源
const createDataSource = async () => {
  const response = await fetch('http://localhost:5000/api/datasources', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Docker测试环境',
      type: 'mysql',
      host: 'datascope-mysql', // 会自动映射到localhost
      port: 3306,
      database: 'datascope',
      username: 'root',
      password: 'datascope'
    })
  });
  
  const data = await response.json();
  
  if (response.ok) {
    // 数据源创建成功，返回的data包含新创建的数据源信息，包括系统分配的ID
    console.log('数据源ID:', data.id);
    return data.id;
  } else {
    // 处理错误
    console.error(`错误 ${data.code}: ${data.message}`);
    return null;
  }
};

// 测试数据源连接
const testConnection = async (dataSourceId) => {
  const response = await fetch(`http://localhost:5000/api/datasources/${dataSourceId}/test-connection`, {
    method: 'POST'
  });
  
  const data = await response.json();
  
  if (response.ok) {
    console.log('连接成功!');
    return true;
  } else {
    console.error(`连接失败: ${data.message}`);
    if (data.details) {
      console.error('详细信息:', data.details);
    }
    return false;
  }
};
```

### 2. 执行SQL查询

```javascript
// 执行查询
const executeQuery = async (dataSourceId, sqlQuery) => {
  const response = await fetch('http://localhost:5000/api/queries/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dataSourceId,
      sql: sqlQuery
    })
  });
  
  const data = await response.json();
  
  if (response.ok) {
    console.log('查询结果:', data.results);
    console.log('执行时间:', data.executionTime, 'ms');
    return data;
  } else {
    console.error(`查询失败: ${data.message}`);
    return null;
  }
};

// 示例: 获取所有用户
executeQuery('your-datasource-id', 'SELECT * FROM users LIMIT 100');

// 示例: 获取数据库表列表
executeQuery('your-datasource-id', 'SHOW TABLES');
```

### 3. 获取表结构和元数据

```javascript
// 获取数据库表列表
const getTables = async (dataSourceId) => {
  const response = await fetch(`http://localhost:5000/api/metadata/${dataSourceId}/tables`);
  const data = await response.json();
  
  if (response.ok) {
    console.log('表列表:', data);
    return data;
  } else {
    console.error(`获取表失败: ${data.message}`);
    return [];
  }
};

// 获取特定表的结构
const getTableStructure = async (dataSourceId, tableName) => {
  const response = await fetch(`http://localhost:5000/api/metadata/${dataSourceId}/tables/${tableName}`);
  const data = await response.json();
  
  if (response.ok) {
    console.log('表结构:', data);
    return data;
  } else {
    console.error(`获取表结构失败: ${data.message}`);
    return null;
  }
};
```

### 4. 分析查询计划

```javascript
// 分析查询计划
const analyzeQueryPlan = async (dataSourceId, sqlQuery) => {
  const response = await fetch('http://localhost:5000/api/query-plans/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dataSourceId,
      sql: sqlQuery
    })
  });
  
  const data = await response.json();
  
  if (response.ok) {
    console.log('查询计划:', data.plan);
    console.log('优化建议:', data.suggestions);
    return data;
  } else {
    console.error(`分析失败: ${data.message}`);
    return null;
  }
};
```

## 环境信息

- **API基础URL**: http://localhost:5000/api
- **API文档**: http://localhost:5000/api-docs
- **测试数据**: 已创建4个示例数据源和7个示例查询
- **服务状态检查**: http://localhost:5000/status

## 数据源连接规则

为提升系统在各种环境下的适应性，我们实现了智能数据源连接规则：

### 主机名解析机制

1. **容器名自动转换**：
   - 系统会自动识别以下容器名并将其转换为正确的主机地址：
     - `datascope-mysql` → 在非容器环境中会自动映射为 `localhost`
     - `mysql` → 在非容器环境中会自动映射为 `localhost`
     - `mariadb` → 在非容器环境中会自动映射为 `localhost`
     - `database` → 在非容器环境中会自动映射为 `localhost`
     - `db` → 在非容器环境中会自动映射为 `localhost`
     - `datascope-postgres` → 在非容器环境中会自动映射为 `localhost`
     - `postgres` → 在非容器环境中会自动映射为 `localhost`
   - 这意味着前端可以使用`datascope-mysql`作为主机名，而无需关心应用是运行在Docker环境还是本地环境

2. **IP地址验证**：
   - 支持IPv4和IPv6格式
   - 系统会自动验证IP地址格式的正确性

3. **主机名验证**：
   - 空主机名会自动转换为`localhost`
   - 不允许使用特殊字符（除了常见的连字符和点）

### 连接重试机制

1. **自动重试**：
   - 默认情况下，连接失败会自动重试3次
   - 使用指数退避策略，初始延迟500ms

2. **超时处理**：
   - 默认连接超时时间为10秒
   - 每次重试都会记录详细日志供问题诊断

3. **高可用支持**：
   - 在测试连接时可捕获"暂时不可用"的数据库状态

### 实际案例

前端开发时，可使用以下任何形式创建数据源（它们在后端都能正确工作）：

```json
// 在本地开发环境中使用Docker容器名
{
  "name": "MySQL开发环境",
  "type": "mysql",
  "host": "datascope-mysql",
  "port": 3306,
  "database": "datascope",
  "username": "root",
  "password": "datascope"
}

// 等效的localhost配置
{
  "name": "MySQL开发环境",
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "database": "datascope",
  "username": "root",
  "password": "datascope"
}
```

**注意**：无论使用哪种格式，系统都会自动处理主机名解析，确保连接成功。

### 数据源ID规则

为保证API接口的灵活性，数据源ID使用以下规则：

1. **创建数据源时**：
   - 如果前端不提供ID，系统自动生成UUID格式的ID
   - 如果前端提供ID，系统会保留该ID（只要不为空）

2. **查询/更新/删除数据源时**：
   - 支持任何非空字符串格式的ID
   - ID大小写敏感，确保精确匹配

3. **最佳实践**：
   - 推荐前端使用UUID格式作为ID
   - 如需使用自定义ID，建议使用有业务意义的简短字符串
   - 避免使用特殊字符（如空格、引号等）

## 错误处理指南

系统使用统一的错误响应格式，便于前端处理：

```json
{
  "status": 400,
  "code": "INVALID_DATASOURCE",
  "message": "数据源配置无效",
  "details": {
    "field": "host",
    "reason": "主机名不能为空"
  }
}
```

### 常见错误码

1. **数据源相关**：
   - `DATASOURCE_NOT_FOUND`: 数据源不存在
   - `INVALID_DATASOURCE`: 数据源配置无效
   - `CONNECTION_FAILED`: 连接失败
   - `AUTH_FAILED`: 认证失败

2. **查询相关**：
   - `QUERY_NOT_FOUND`: 查询不存在
   - `INVALID_QUERY`: 查询语句无效
   - `QUERY_EXECUTION_ERROR`: 查询执行失败

3. **元数据相关**：
   - `METADATA_SYNC_FAILED`: 元数据同步失败
   - `TABLE_NOT_FOUND`: 表不存在

### 前端处理建议

1. **根据错误码处理**：
   - 对特定错误码实现定制处理逻辑
   - 例如：`CONNECTION_FAILED` 可提示用户检查网络设置

2. **友好错误展示**：
   - 直接展示API返回的`message`字段
   - 高级错误信息可展示`details`

3. **重试策略**：
   - 对于连接超时等临时性错误，可实现前端重试逻辑
   - 建议使用指数退避策略，避免频繁请求

## 查询模块API详解

查询模块提供完整的SQL查询管理、执行和历史记录功能。

### 1. 查询对象结构

```json
{
  "id": "query-123",              // 查询ID，创建时可选
  "name": "用户增长分析",         // 查询名称
  "description": "按月统计注册用户", // 查询描述，可选
  "dataSourceId": "mysql-1",      // 关联的数据源ID
  "sql": "SELECT COUNT(*) AS user_count, DATE_FORMAT(created_at, '%Y-%m') AS month FROM users GROUP BY month", // SQL语句
  "createdAt": "2024-05-01T12:00:00Z", // 创建时间，自动生成
  "updatedAt": "2024-05-01T12:00:00Z", // 更新时间，自动生成
  "tags": ["用户分析", "月度报表"]    // 标签，可选
}
```

### 2. 创建和保存查询

**请求**:
```
POST /api/queries
```

**请求体**:
```json
{
  "name": "产品销量统计",
  "description": "按类别统计产品销量",
  "dataSourceId": "mysql-1",
  "sql": "SELECT c.name AS category, SUM(oi.quantity) AS total_sold FROM products p JOIN categories c ON p.category_id = c.id JOIN order_items oi ON oi.product_id = p.id GROUP BY c.name ORDER BY total_sold DESC",
  "tags": ["销售分析", "产品"]
}
```

**响应** (成功 - 200):
```json
{
  "id": "query-456",
  "name": "产品销量统计",
  "description": "按类别统计产品销量",
  "dataSourceId": "mysql-1",
  "sql": "SELECT c.name AS category, SUM(oi.quantity) AS total_sold FROM products p JOIN categories c ON p.category_id = c.id JOIN order_items oi ON oi.product_id = p.id GROUP BY c.name ORDER BY total_sold DESC",
  "createdAt": "2024-05-01T14:30:00Z",
  "updatedAt": "2024-05-01T14:30:00Z",
  "tags": ["销售分析", "产品"]
}
```

**JavaScript 示例**:
```javascript
const saveQuery = async (query) => {
  const response = await fetch('http://localhost:5000/api/queries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query)
  });
  
  const data = await response.json();
  
  if (response.ok) {
    console.log('查询已保存:', data);
    return data;
  } else {
    console.error(`保存失败: ${data.message}`);
    return null;
  }
};
```

### 3. 执行查询

有两种执行查询的方式:

#### 3.1 直接执行SQL (无需保存)

**请求**:
```
POST /api/queries/execute
```

**请求体**:
```json
{
  "dataSourceId": "mysql-1",
  "sql": "SELECT * FROM users WHERE created_at > '2024-01-01' LIMIT 100"
}
```

**响应** (成功 - 200):
```json
{
  "results": [
    // 查询结果数组，每个对象代表一行数据
    { "id": 1, "username": "user1", "email": "user1@example.com", "created_at": "2024-01-15" },
    { "id": 2, "username": "user2", "email": "user2@example.com", "created_at": "2024-02-20" }
    // ...更多行
  ],
  "fields": [
    { "name": "id", "type": "int" },
    { "name": "username", "type": "varchar" },
    { "name": "email", "type": "varchar" },
    { "name": "created_at", "type": "date" }
  ],
  "rowCount": 2,
  "executionTime": 25, // 毫秒
  "executedAt": "2024-05-01T15:45:30Z"
}
```

#### 3.2 执行已保存的查询

**请求**:
```
POST /api/queries/{queryId}/execute
```

**响应格式与直接执行相同**

**JavaScript 示例**:
```javascript
// 方式1: 直接执行SQL
const executeDirectSQL = async (dataSourceId, sql) => {
  const response = await fetch('http://localhost:5000/api/queries/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dataSourceId, sql })
  });
  
  const data = await response.json();
  return handleQueryResponse(response, data);
};

// 方式2: 执行已保存查询
const executeSavedQuery = async (queryId) => {
  const response = await fetch(`http://localhost:5000/api/queries/${queryId}/execute`, {
    method: 'POST'
  });
  
  const data = await response.json();
  return handleQueryResponse(response, data);
};

// 处理查询响应
const handleQueryResponse = (response, data) => {
  if (response.ok) {
    console.log('查询结果行数:', data.rowCount);
    console.log('执行时间:', data.executionTime, 'ms');
    console.log('字段:', data.fields);
    
    // 处理结果数据
    if (data.results.length > 0) {
      console.log('第一行数据:', data.results[0]);
    }
    
    return data;
  } else {
    console.error(`查询执行失败: ${data.message}`);
    if (data.details) {
      console.error('错误详情:', data.details);
    }
    return null;
  }
};
```

### 4. 获取查询历史

**请求**:
```
GET /api/queries/history?limit=10&offset=0&dataSourceId=mysql-1
```

**查询参数**:
- `limit`: 每页记录数 (可选，默认10)
- `offset`: 偏移量 (可选，默认0)
- `dataSourceId`: 按数据源筛选 (可选)
- `startDate`: 开始日期 (可选，格式: YYYY-MM-DD)
- `endDate`: 结束日期 (可选，格式: YYYY-MM-DD)

**响应** (成功 - 200):
```json
{
  "history": [
    {
      "id": "history-123",
      "queryId": "query-456",      // 关联的查询ID，可能为null（对于未保存的查询）
      "queryName": "产品销量统计", // 查询名称，未保存的查询为null
      "dataSourceId": "mysql-1",
      "dataSourceName": "开发MySQL",
      "sql": "SELECT c.name AS category, SUM(oi.quantity) AS total_sold FROM products p JOIN categories c ON p.category_id = c.id JOIN order_items oi ON oi.product_id = p.id GROUP BY c.name ORDER BY total_sold DESC",
      "executionTime": 45,         // 毫秒
      "rowCount": 10,
      "status": "success",         // success, error
      "errorMessage": null,        // 失败时的错误信息
      "executedAt": "2024-05-01T16:20:00Z",
      "executedBy": "user@example.com" // 可选，如果有用户系统
    },
    // ...更多历史记录
  ],
  "total": 42,  // 总记录数
  "limit": 10,
  "offset": 0
}
```

**JavaScript 示例**:
```javascript
const getQueryHistory = async (params = {}) => {
  // 构建查询参数
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.append('limit', params.limit);
  if (params.offset) queryParams.append('offset', params.offset);
  if (params.dataSourceId) queryParams.append('dataSourceId', params.dataSourceId);
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);
  
  const url = `http://localhost:5000/api/queries/history?${queryParams.toString()}`;
  const response = await fetch(url);
  const data = await response.json();
  
  if (response.ok) {
    console.log('查询历史:', data.history);
    console.log('总记录数:', data.total);
    return data;
  } else {
    console.error(`获取历史失败: ${data.message}`);
    return null;
  }
};

// 使用示例
getQueryHistory({ 
  limit: 5, 
  dataSourceId: 'mysql-1',
  startDate: '2024-04-01',
  endDate: '2024-05-01'
});
```

### 5. 获取所有已保存查询

**请求**:
```
GET /api/queries?limit=10&offset=0&dataSourceId=mysql-1
```

**查询参数**:
- `limit`: 每页记录数 (可选，默认10)
- `offset`: 偏移量 (可选，默认0)
- `dataSourceId`: 按数据源筛选 (可选)
- `tag`: 按标签筛选 (可选)
- `search`: 搜索关键词 (可选，搜索名称和描述)

**响应** (成功 - 200):
```json
{
  "queries": [
    {
      "id": "query-456",
      "name": "产品销量统计",
      "description": "按类别统计产品销量",
      "dataSourceId": "mysql-1",
      "dataSourceName": "开发MySQL",
      "sql": "SELECT c.name AS category...",
      "createdAt": "2024-05-01T14:30:00Z",
      "updatedAt": "2024-05-01T14:30:00Z",
      "lastExecutedAt": "2024-05-01T16:20:00Z", // 最后执行时间，可能为null
      "tags": ["销售分析", "产品"]
    },
    // ...更多查询
  ],
  "total": 15,  // 总记录数
  "limit": 10,
  "offset": 0
}
```

**JavaScript 示例**:
```javascript
const getSavedQueries = async (params = {}) => {
  // 构建查询参数
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.append('limit', params.limit);
  if (params.offset) queryParams.append('offset', params.offset);
  if (params.dataSourceId) queryParams.append('dataSourceId', params.dataSourceId);
  if (params.tag) queryParams.append('tag', params.tag);
  if (params.search) queryParams.append('search', params.search);
  
  const url = `http://localhost:5000/api/queries?${queryParams.toString()}`;
  const response = await fetch(url);
  const data = await response.json();
  
  if (response.ok) {
    console.log('已保存查询:', data.queries);
    console.log('总记录数:', data.total);
    return data;
  } else {
    console.error(`获取查询失败: ${data.message}`);
    return null;
  }
};
```

## 已创建的测试数据

### 数据源

已创建以下示例数据源:

1. **开发MySQL** - 本地开发环境 (`localhost:3306/dev_db`)
2. **测试PostgreSQL** - 测试环境 (`test-db:5432/test_db`)
3. **生产MySQL只读** - 生产环境只读副本 (`prod-readonly.example.com:3306/prod_db`)
4. **Docker MySQL** - Docker容器环境 (`datascope-mysql:3306/datascope`)

### 查询示例

已创建以下示例查询:

1. **用户增长分析** - 按日期统计新注册用户数
2. **产品销售情况** - 按产品类别统计销售数据
3. **访问量统计** - 按小时统计网站访问量
4. **系统性能监控** - 查询服务器CPU和内存使用情况
5. **订单状态分布** - 统计各状态的订单数量
6. **SHOW TABLES** - 显示所有表
7. **SHOW DATABASES** - 显示所有数据库

## 测试数据

### 模拟数据
使用以下命令生成前端开发用模拟数据：

```bash
npm run init:frontend
```

此命令会生成虚拟的数据源和查询，但这些数据源不能真实连接数据库。

### 真实测试数据库
为提供更真实的开发体验，我们提供了完整的Docker测试环境：

```bash
# 启动所有测试数据库并初始化连接
npm run docker:start
```

这将启动包含MySQL、PostgreSQL和MariaDB的Docker容器，并自动创建能够连接到这些数据库的数据源。测试环境附带以下功能：

1. **预配置数据库连接**：
   - Docker MySQL（端口3306）
   - Docker PostgreSQL（端口5432）
   - Docker MariaDB（端口3307）

2. **包含测试数据的表**：
   - users - 用户表
   - products - 产品表
   - categories - 产品类别
   - orders - 订单表
   - order_items - 订单明细
   - page_visits - 页面访问记录
   - system_metrics - 系统性能指标

3. **预置示例查询**：
   - 用户查询
   - 销售分析
   - 系统性能监控
   - 用户行为分析

这些真实数据库连接可用于所有API操作，包括连接测试、查询执行、查询计划分析等。

## 主要API端点

### 数据源管理

- **获取所有数据源**: `GET /api/datasources`
- **获取单个数据源**: `GET /api/datasources/{id}`
- **创建数据源**: `POST /api/datasources`
- **更新数据源**: `PUT /api/datasources/{id}`
- **删除数据源**: `DELETE /api/datasources/{id}`
- **测试数据源连接**: `POST /api/datasources/{id}/test-connection`

### 查询管理

- **获取所有查询**: `GET /api/queries`
- **获取单个查询**: `GET /api/queries/{id}`
- **创建查询**: `POST /api/queries`
- **更新查询**: `PUT /api/queries/{id}`
- **删除查询**: `DELETE /api/queries/{id}`
- **执行查询**: `POST /api/queries/execute`
- **获取查询历史**: `GET /api/queries/history`

### 元数据管理

- **同步元数据**: `POST /api/metadata/sync/{dataSourceId}`
- **获取数据库列表**: `GET /api/metadata/{dataSourceId}/databases`
- **获取表列表**: `GET /api/metadata/{dataSourceId}/tables`
- **获取表结构**: `GET /api/metadata/{dataSourceId}/tables/{tableName}`
- **获取表关系**: `GET /api/metadata/{dataSourceId}/relationships`

### 查询计划分析

- **获取查询计划**: `POST /api/query-plans/analyze`
- **获取查询计划历史**: `GET /api/query-plans/history`
- **比较查询计划**: `POST /api/query-plans/compare`

## 前端开发建议

1. **使用API文档**：访问 `/api-docs` 了解所有API的详细信息，包括参数和响应格式。

2. **错误处理**：所有API都使用统一的错误格式，确保处理以下错误情况：
   - 400 - 请求参数错误
   - 401 - 未授权
   - 404 - 资源不存在
   - 500 - 服务器内部错误

3. **数据源连接特性**：
   - 系统有智能主机名解析功能，自动将容器名转为正确主机地址
   - 有连接重试机制，对不稳定的网络环境有很好的容错性
   - 数据源ID支持任意非空字符串格式

4. **特殊SQL命令支持**：
   - SHOW类命令（如SHOW DATABASES, SHOW TABLES）
   - DESCRIBE/DESC命令
   - SET类命令
   - USE命令

## 测试账号

所有测试数据源的连接信息：

- 开发MySQL: `mysql://root:root@localhost:3306/dev_db`
- 测试PostgreSQL: `postgresql://postgres:postgres@test-db:5432/test_db`
- 生产MySQL只读: `mysql://readonly:readonly@prod-readonly.example.com:3306/prod_db`
- Docker MySQL: `mysql://root:datascope@datascope-mysql:3306/datascope`

## 技术支持

如有问题，请联系后端开发团队。
