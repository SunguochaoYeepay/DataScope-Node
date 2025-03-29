# DataScope API Design

## API Standards

### General Principles

- RESTful API design
- JSON request/response format
- Versioning in URL path (/api/v1/...)
- Consistent error handling
- Authentication via JWT
- Rate limiting headers
- HTTPS only

### Response Format

```json
{
    "code": 0,           // 0 for success, other for error
    "message": "string", // Success or error message
    "data": {},          // Response data
    "timestamp": "string" // ISO-8601 format
}
```

### Error Codes

- 1000-1999: Authentication/Authorization errors
- 2000-2999: Input validation errors
- 3000-3999: Business logic errors
- 4000-4999: System errors
- 5000-5999: External service errors

## API Endpoints

### Data Source Management

#### List Data Sources

```
GET /api/v1/datasources
Query Parameters:
- page: int (default: 1)
- size: int (default: 10)
- status: string (optional)
- type: string (optional)
```

#### Create Data Source

```
POST /api/v1/datasources
Request Body:
{
    "name": "string",
    "type": "string",
    "host": "string",
    "port": int,
    "databaseName": "string",
    "username": "string",
    "password": "string",
    "description": "string"
}
```

#### Update Data Source

```
PUT /api/v1/datasources/{id}
Request Body:
{
    "name": "string",
    "host": "string",
    "port": int,
    "username": "string",
    "password": "string",
    "description": "string"
}
```

#### Test Connection

```
POST /api/v1/datasources/{id}/test
Response:
{
    "success": boolean,
    "message": "string"
}
```

### Metadata Management

#### Get Schema List

```
GET /api/v1/datasources/{id}/schemas
Query Parameters:
- page: int
- size: int
```

#### Get Tables

```
GET /api/v1/schemas/{id}/tables
Query Parameters:
- page: int
- size: int
- search: string
```

#### Get Columns

```
GET /api/v1/tables/{id}/columns
Query Parameters:
- page: int
- size: int
```

#### Sync Metadata

```
POST /api/v1/datasources/{id}/sync
Query Parameters:
- type: string (FULL/INCREMENTAL)
```

### Query Management

#### Execute Query

```
POST /api/v1/queries/execute
Request Body:
{
    "dataSourceId": "string",
    "sql": "string",
    "parameters": {},
    "timeout": int,
    "maxRows": int
}
```

#### Natural Language Query

```
POST /api/v1/queries/nl
Request Body:
{
    "dataSourceId": "string",
    "question": "string",
    "context": {}
}
```

#### Save Query

```
POST /api/v1/queries
Request Body:
{
    "name": "string",
    "description": "string",
    "dataSourceId": "string",
    "sql": "string",
    "displayConfig": {}
}
```

#### Get Query History

```
GET /api/v1/queries/history
Query Parameters:
- page: int
- size: int
- userId: string
- status: string
```

### Display Configuration

#### Save Display Config

```
POST /api/v1/display-configs
Request Body:
{
    "queryId": "string",
    "displayType": "string",
    "config": {
        "conditions": [{
            "field": "string",
            "label": "string",
            "type": "string",
            "required": boolean,
            "defaultValue": "string"
        }],
        "columns": [{
            "field": "string",
            "label": "string",
            "type": "string",
            "mask": "string",
            "format": "string"
        }],
        "operations": [{
            "type": "string",
            "label": "string",
            "action": "string"
        }]
    }
}
```

#### Get Display Config

```
GET /api/v1/display-configs/{id}
```

### User Preferences

#### Save Preferences

```
POST /api/v1/preferences
Request Body:
{
    "type": "string",
    "key": "string",
    "value": "string"
}
```

#### Get Preferences

```
GET /api/v1/preferences
Query Parameters:
- type: string
```

## Low Code Integration

### Generate Query API

```
POST /api/v1/low-code/apis
Request Body:
{
    "queryId": "string",
    "apiPath": "string",
    "method": "string",
    "parameters": [{
        "name": "string",
        "type": "string",
        "required": boolean,
        "defaultValue": "string"
    }]
}
```

### Get API Configuration

```
GET /api/v1/low-code/apis/{id}/config
Response:
{
    "apiConfig": {
        "path": "string",
        "method": "string",
        "parameters": []
    },
    "displayConfig": {
        "conditions": [],
        "columns": [],
        "operations": []
    }
}
```

## Rate Limiting

### Headers

```
X-RateLimit-Limit: Maximum requests per window
X-RateLimit-Remaining: Remaining requests in current window
X-RateLimit-Reset: Time when the rate limit resets
```

### Limits

- API calls: 1000 requests per minute per user
- Query execution: 10 concurrent queries per user
- Data download: 50000 rows per request

## 通用规范

### 请求格式

- 使用RESTful风格API
- 请求头需包含：
  - Content-Type: application/json
  - X-User-ID: 用户ID
  - Authorization: Bearer {token}
- 分页参数：
  - page: 页码，从1开始
  - size: 每页大小
  - sort: 排序字段
  - order: 排序方向(asc/desc)

### 响应格式
```json
{
  "code": "string",     // 响应码
  "message": "string",  // 响应消息
  "data": object,       // 响应数据
  "timestamp": "string" // 响应时间
}
```

### 分页响应格式
```json
{
  "code": "string",
  "message": "string",
  "data": {
    "total": number,    // 总记录数
    "pages": number,    // 总页数
    "current": number,  // 当前页
    "size": number,    // 每页大小
    "records": []      // 记录列表
  },
  "timestamp": "string"
}
```

## 数据源管理API

### 创建数据源

POST /api/v1/datasources
```json
{
  "name": "string",
  "type": "MYSQL",
  "host": "string",
  "port": number,
  "database": "string",
  "username": "string",
  "password": "string",
  "remark": "string"
}
```

### 更新数据源

PUT /api/v1/datasources/{id}
```json
{
  "name": "string",
  "host": "string",
  "port": number,
  "database": "string",
  "username": "string",
  "password": "string",
  "remark": "string"
}
```

### 删除数据源

DELETE /api/v1/datasources/{id}

### 获取数据源详情

GET /api/v1/datasources/{id}

### 获取数据源列表

GET /api/v1/datasources?page=1&size=10

### 测试数据源连接

POST /api/v1/datasources/{id}/test

### 同步数据源元数据

POST /api/v1/datasources/{id}/sync

### 获取数据源同步状态

GET /api/v1/datasources/{id}/sync/status

## 元数据管理API

### 获取数据源的表列表

GET /api/v1/datasources/{id}/tables?page=1&size=10

### 获取表的列信息

GET /api/v1/datasources/{id}/tables/{tableName}/columns

### 获取表关系

GET /api/v1/datasources/{id}/tables/{tableName}/relations

## 查询管理API

### 执行SQL查询

POST /api/v1/queries/sql
```json
{
  "dataSourceId": "string",
  "sql": "string",
  "params": {},
  "timeout": number
}
```

### 执行自然语言查询

POST /api/v1/queries/nl
```json
{
  "dataSourceId": "string",
  "text": "string",
  "timeout": number
}
```

### 获取查询历史

GET /api/v1/queries/history?page=1&size=10

### 获取收藏的查询

GET /api/v1/queries/favorites?page=1&size=10

### 收藏/取消收藏查询

PUT /api/v1/queries/{id}/favorite
```json
{
  "favorite": boolean
}
```

## 显示配置API

### 保存显示配置

POST /api/v1/display/configs
```json
{
  "dataSourceId": "string",
  "tableName": "string",
  "columnName": "string",
  "displayName": "string",
  "width": number,
  "align": "LEFT",
  "fixed": "NONE",
  "visible": boolean,
  "orderNum": number,
  "sortable": boolean,
  "searchable": boolean,
  "required": boolean,
  "maskType": "NONE",
  "maskConfig": {}
}
```

### 获取显示配置

GET /api/v1/display/configs?dataSourceId=string&tableName=string

### 复制显示配置

POST /api/v1/display/configs/copy
```json
{
  "fromUserId": "string",
  "toUserId": "string"
}
```

## 数据导出API

### 导出查询结果

POST /api/v1/export/query
```json
{
  "queryId": "string",
  "format": "CSV",
  "columns": ["string"],
  "maxRows": number
}
```

### 获取导出状态

GET /api/v1/export/{taskId}/status

### 下载导出文件

GET /api/v1/export/{taskId}/download

## 错误码

- 200: 成功
- 400: 请求参数错误
- 401: 未授权
- 403: 禁止访问
- 404: 资源不存在
- 429: 请求过于频繁
- 500: 服务器内部错误

### 业务错误码

- DS_001: 数据源名称已存在
- DS_002: 数据源连接失败
- DS_003: 数据源同步失败
- QY_001: SQL语法错误
- QY_002: 查询超时
- QY_003: 查询结果过大
- EX_001: 导出任务创建失败
- EX_002: 导出超过最大限制
