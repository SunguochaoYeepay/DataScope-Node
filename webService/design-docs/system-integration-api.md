# 系统集成接口文档

本文档详细描述了DataScope系统集成功能的API接口规范，供前端和第三方系统开发人员参考。

## 一、基础信息

### 1.1 接口基础URL

- 开发环境：`http://localhost:3000/api`
- 测试环境：`https://test-api.datascope.com/api`
- 生产环境：`https://api.datascope.com/api`

### 1.2 通用响应格式

所有API响应均遵循以下格式：

**成功响应：**
```json
{
  "success": true,
  "data": { /* 响应数据对象 */ }
}
```

**错误响应：**
```json
{
  "success": false,
  "error": {
    "code": 400,
    "type": "BAD_REQUEST",
    "message": "错误消息",
    "timestamp": "2023-01-01T00:00:00.000Z",
    "path": "/api/path",
    "requestId": "req-uuid-123",
    "details": { /* 可选的详细错误信息 */ }
  }
}
```

### 1.3 认证方式

除特别说明外，所有接口均需要认证。认证方式如下：

**Bearer Token认证（内部用户）:**
```
Authorization: Bearer {token}
```

**API Key认证（外部系统）:**
```
X-API-Key: {apiKey}
```

## 二、集成管理接口

### 2.1 获取集成列表

获取系统中所有的集成配置列表。

**请求方法：** GET

**路径：** `/v1/low-code/apis`

**请求头：**
```
Authorization: Bearer {token}
```

**查询参数：**
- `page`：页码，默认为1
- `pageSize`：每页记录数，默认为20
- `status`：可选，按状态筛选 (DRAFT, ACTIVE, INACTIVE)
- `type`：可选，按类型筛选 (FORM, TABLE, CHART)
- `search`：可选，按名称或描述搜索

**响应格式：**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid-example-1",
        "name": "用户查询接口",
        "description": "查询系统用户信息",
        "queryId": "uuid-query-1",
        "type": "TABLE",
        "status": "ACTIVE",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z",
        "createdBy": "admin-uuid"
      },
      /* 更多集成 */
    ],
    "total": 42,
    "page": 1,
    "pageSize": 20,
    "totalPages": 3
  }
}
```

### 2.2 获取单个集成

获取指定ID的集成详细信息。

**请求方法：** GET

**路径：** `/v1/low-code/apis/:id`

**请求头：**
```
Authorization: Bearer {token}
```

**路径参数：**
- `id`: 集成ID (UUID格式)

**响应格式：**
```json
{
  "success": true,
  "data": {
    "id": "uuid-example-1",
    "name": "用户查询接口",
    "description": "查询系统用户信息",
    "queryId": "uuid-query-1",
    "type": "TABLE",
    "config": {
      "params": [
        {
          "name": "username",
          "label": "用户名",
          "type": "string",
          "required": true,
          "defaultValue": "",
          "placeholder": "请输入用户名"
        }
      ],
      "tableConfig": {
        "columns": [
          {
            "key": "id",
            "dataIndex": "id",
            "title": "ID",
            "width": 80
          },
          {
            "key": "username",
            "dataIndex": "username",
            "title": "用户名",
            "width": 150
          }
        ],
        "rowKey": "id",
        "pagination": true
      }
    },
    "status": "ACTIVE",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z",
    "createdBy": "admin-uuid",
    "updatedBy": "admin-uuid"
  }
}
```

### 2.3 创建集成

创建新的系统集成配置。

**请求方法：** POST

**路径：** `/v1/low-code/apis`

**请求头：**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**请求体：**
```json
{
  "name": "用户查询接口",
  "description": "查询系统用户信息",
  "queryId": "uuid-query-1",
  "type": "TABLE",
  "config": {
    "params": [
      {
        "name": "username",
        "label": "用户名",
        "type": "string",
        "required": true,
        "defaultValue": "",
        "placeholder": "请输入用户名"
      }
    ],
    "tableConfig": {
      "columns": [
        {
          "key": "id",
          "dataIndex": "id",
          "title": "ID",
          "width": 80
        },
        {
          "key": "username",
          "dataIndex": "username",
          "title": "用户名",
          "width": 150
        }
      ],
      "rowKey": "id",
      "pagination": true
    }
  },
  "status": "DRAFT"
}
```

**响应格式：**
```json
{
  "success": true,
  "data": {
    "id": "uuid-example-1",
    "name": "用户查询接口",
    "description": "查询系统用户信息",
    "queryId": "uuid-query-1",
    "type": "TABLE",
    "config": { /* 配置对象，同请求体 */ },
    "status": "DRAFT",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z",
    "createdBy": "admin-uuid"
  }
}
```

### 2.4 更新集成

更新现有的系统集成配置。

**请求方法：** PUT

**路径：** `/v1/low-code/apis/:id`

**请求头：**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**路径参数：**
- `id`: 集成ID (UUID格式)

**请求体：**
```json
{
  "name": "更新后的用户查询接口",
  "description": "查询系统用户信息（已更新）",
  "config": {
    "params": [
      {
        "name": "username",
        "label": "用户名",
        "type": "string",
        "required": true
      },
      {
        "name": "status",
        "label": "状态",
        "type": "string",
        "required": false,
        "defaultValue": "active",
        "options": [
          {"label": "活跃", "value": "active"},
          {"label": "禁用", "value": "disabled"}
        ]
      }
    ],
    "tableConfig": { /* 表格配置 */ }
  },
  "status": "ACTIVE"
}
```

**响应格式：**
```json
{
  "success": true,
  "data": {
    "id": "uuid-example-1",
    "name": "更新后的用户查询接口",
    "description": "查询系统用户信息（已更新）",
    "queryId": "uuid-query-1",
    "type": "TABLE",
    "config": { /* 更新后的配置对象 */ },
    "status": "ACTIVE",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T01:00:00.000Z",
    "createdBy": "admin-uuid",
    "updatedBy": "admin-uuid"
  }
}
```

### 2.5 更新集成状态

快速更新集成的状态。

**请求方法：** PATCH

**路径：** `/v1/low-code/apis/:id/status`

**请求头：**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**路径参数：**
- `id`: 集成ID (UUID格式)

**请求体：**
```json
{
  "status": "ACTIVE"
}
```

**响应格式：**
```json
{
  "success": true,
  "data": {
    "id": "uuid-example-1",
    "status": "ACTIVE",
    "updatedAt": "2023-01-01T01:00:00.000Z"
  }
}
```

### 2.6 删除集成

删除指定的系统集成配置。

**请求方法：** DELETE

**路径：** `/v1/low-code/apis/:id`

**请求头：**
```
Authorization: Bearer {token}
```

**路径参数：**
- `id`: 集成ID (UUID格式)

**响应格式：**
```
HTTP/1.1 204 No Content
```

### 2.7 获取API配置

获取集成的API使用配置和文档，用于外部系统集成。

**请求方法：** GET

**路径：** `/v1/low-code/apis/:id/config`

**请求头：**
```
Authorization: Bearer {token}
```

**路径参数：**
- `id`: 集成ID (UUID格式)

**响应格式：**
```json
{
  "success": true,
  "data": {
    "apiEndpoint": "/api/data-service/query",
    "method": "POST",
    "requestFormat": {
      "integrationId": "uuid-example-1",
      "params": {
        "username": "示例值"
      },
      "pagination": {
        "page": 1,
        "pageSize": 10
      },
      "sorting": [
        {
          "field": "createdAt",
          "order": "desc"
        }
      ]
    },
    "responseFormat": {
      "success": true,
      "data": {
        "records": [
          {
            "id": 1,
            "username": "user1"
          }
        ],
        "total": 100,
        "page": 1,
        "pageSize": 10,
        "totalPages": 10
      }
    },
    "parameterDocs": [
      {
        "name": "username",
        "description": "用户名",
        "type": "string",
        "required": true,
        "example": "john_doe"
      }
    ],
    "authRequirements": {
      "requireAuth": true,
      "authMethods": ["api_key", "bearer_token"]
    }
  }
}
```

### 2.8 测试集成

测试系统集成配置，返回实际查询结果。

**请求方法：** POST

**路径：** `/v1/low-code/apis/:id/test`

**请求头：**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**路径参数：**
- `id`: 集成ID (UUID格式)

**请求体：**
```json
{
  "params": {
    "username": "testuser"
  },
  "pagination": {
    "page": 1,
    "pageSize": 10
  },
  "sorting": [
    {
      "field": "createdAt",
      "order": "desc"
    }
  ]
}
```

**响应格式：**
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "id": 1,
        "username": "testuser",
        "email": "testuser@example.com",
        "status": "active",
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1,
    "executionTime": "120ms",
    "query": {
      "sql": "SELECT * FROM users WHERE username = ?",
      "params": ["testuser"]
    }
  }
}
```

### 2.9 导出集成配置

导出集成配置为JSON文件。

**请求方法：** GET

**路径：** `/v1/low-code/apis/:id/export`

**请求头：**
```
Authorization: Bearer {token}
```

**路径参数：**
- `id`: 集成ID (UUID格式)

**查询参数：**
- `format`: 导出格式，可选值为 `json`（默认）或 `standard`

**响应格式：**
响应为下载的文件，文件类型为 `application/json`，文件名为 `{integration-name}.json`。

## 三、数据查询接口

### 3.1 执行集成查询

执行集成查询，获取数据结果。此接口主要供外部系统调用，用于获取数据。

**请求方法：** POST

**路径：** `/data-service/query`

**请求头：**
```
Content-Type: application/json
X-API-Key: {apiKey}  // 如果启用了API密钥认证
```

**请求体：**
```json
{
  "integrationId": "uuid-example-1",
  "params": {
    "username": "searchuser",
    "status": "active"
  },
  "pagination": {
    "page": 1,
    "pageSize": 20
  },
  "sorting": [
    {
      "field": "createdAt",
      "order": "desc"
    }
  ]
}
```

**响应格式：**
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "id": 1,
        "username": "searchuser",
        "email": "user@example.com",
        "status": "active",
        "lastLogin": "2023-01-01T00:00:00.000Z"
      },
      // ...更多记录
    ],
    "total": 42,
    "page": 1,
    "pageSize": 20,
    "totalPages": 3
  }
}
```

**错误响应示例：**
```json
{
  "success": false,
  "error": {
    "code": 400,
    "type": "BAD_REQUEST",
    "message": "参数username为必填项",
    "timestamp": "2023-01-01T00:00:00.000Z",
    "path": "/api/data-service/query",
    "requestId": "req-uuid-123"
  }
}
```

## 四、API密钥管理接口（可选）

### 4.1 创建API密钥

创建用于外部系统访问的API密钥。

**请求方法：** POST

**路径：** `/keys`

**请求头：**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**请求体：**
```json
{
  "name": "外部系统集成密钥",
  "description": "用于ERP系统集成",
  "expiresAt": "2024-12-31T23:59:59.999Z",
  "permissions": ["integration:read", "data:query"],
  "integrationIds": ["uuid-example-1", "uuid-example-2"]
}
```

**响应格式：**
```json
{
  "success": true,
  "data": {
    "id": "key-id-1",
    "name": "外部系统集成密钥",
    "description": "用于ERP系统集成",
    "key": "sk_test_abcdefghijklmnopqrstuvwxyz123456",
    "enabled": true,
    "permissions": ["integration:read", "data:query"],
    "integrationIds": ["uuid-example-1", "uuid-example-2"],
    "expiresAt": "2024-12-31T23:59:59.999Z",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "createdBy": "admin-uuid"
  },
  "message": "API密钥已创建，请保存密钥值，它不会再次显示"
}
```

### 4.2 获取API密钥列表

获取所有API密钥列表。

**请求方法：** GET

**路径：** `/keys`

**请求头：**
```
Authorization: Bearer {token}
```

**查询参数：**
- `page`：页码，默认为1
- `pageSize`：每页记录数，默认为20
- `status`：可选，按状态筛选 (enabled, disabled)

**响应格式：**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "key-id-1",
        "name": "外部系统集成密钥",
        "description": "用于ERP系统集成",
        "enabled": true,
        "permissions": ["integration:read", "data:query"],
        "integrationIds": ["uuid-example-1", "uuid-example-2"],
        "expiresAt": "2024-12-31T23:59:59.999Z",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "lastUsed": "2023-01-02T00:00:00.000Z",
        "createdBy": "admin-uuid"
      },
      // ...更多API密钥
    ],
    "total": 5,
    "page": 1,
    "pageSize": 20,
    "totalPages": 1
  }
}
```

### 4.3 更新API密钥状态

启用或禁用API密钥。

**请求方法：** PUT

**路径：** `/keys/:id/status`

**请求头：**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**路径参数：**
- `id`: API密钥ID

**请求体：**
```json
{
  "enabled": false
}
```

**响应格式：**
```json
{
  "success": true,
  "data": {
    "id": "key-id-1",
    "enabled": false,
    "updatedAt": "2023-01-03T00:00:00.000Z",
    "updatedBy": "admin-uuid"
  }
}
```

### 4.4 删除API密钥

删除指定的API密钥。

**请求方法：** DELETE

**路径：** `/keys/:id`

**请求头：**
```
Authorization: Bearer {token}
```

**路径参数：**
- `id`: API密钥ID

**响应格式：**
```
HTTP/1.1 204 No Content
```

## 五、集成访问权限控制接口（可选）

### 5.1 设置集成访问权限

设置集成的访问权限控制规则。

**请求方法：** PUT

**路径：** `/v1/low-code/apis/:id/access`

**请求头：**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**路径参数：**
- `id`: 集成ID (UUID格式)

**请求体：**
```json
{
  "publicAccess": false,
  "allowedApiKeys": ["key-id-1", "key-id-2"],
  "requireAuthentication": true,
  "ipWhitelist": ["192.168.1.0/24", "10.0.0.1"],
  "rateLimit": {
    "maxRequests": 1000,
    "timeWindow": "1h"
  }
}
```

**响应格式：**
```json
{
  "success": true,
  "data": {
    "id": "uuid-example-1",
    "publicAccess": false,
    "allowedApiKeys": ["key-id-1", "key-id-2"],
    "requireAuthentication": true,
    "ipWhitelist": ["192.168.1.0/24", "10.0.0.1"],
    "rateLimit": {
      "maxRequests": 1000,
      "timeWindow": "1h"
    },
    "updatedAt": "2023-01-01T00:00:00.000Z",
    "updatedBy": "admin-uuid"
  }
}
```

## 六、统计与监控接口（可选）

### 6.1 获取集成使用统计

获取集成使用的统计数据。

**请求方法：** GET

**路径：** `/v1/low-code/apis/stats`

**请求头：**
```
Authorization: Bearer {token}
```

**查询参数：**
- `startDate`: 开始日期（ISO格式）
- `endDate`: 结束日期（ISO格式）
- `integrationId`: 集成ID（可选）
- `interval`: 聚合间隔，可选值为 `day`（默认）, `hour`, `week`, `month`

**响应格式：**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalCalls": 1245,
      "uniqueUsers": 42,
      "averageResponseTime": 150,
      "errorRate": 0.02,
      "successRate": 0.98
    },
    "topIntegrations": [
      {
        "id": "uuid-example-1",
        "name": "用户查询接口",
        "calls": 523,
        "averageResponseTime": 120
      },
      {
        "id": "uuid-example-2",
        "name": "订单查询接口",
        "calls": 412,
        "averageResponseTime": 180
      }
    ],
    "timeSeriesData": [
      {
        "date": "2023-01-01",
        "calls": 120,
        "errors": 2,
        "averageResponseTime": 145
      },
      {
        "date": "2023-01-02",
        "calls": 145,
        "errors": 3,
        "averageResponseTime": 152
      }
    ]
  }
}
```

### 6.2 获取集成访问日志

获取指定集成的访问日志。

**请求方法：** GET

**路径：** `/v1/low-code/apis/:id/logs`

**请求头：**
```
Authorization: Bearer {token}
```

**路径参数：**
- `id`: 集成ID (UUID格式)

**查询参数：**
- `page`: 页码（默认1）
- `pageSize`: 每页记录数（默认20）
- `startDate`: 开始日期（ISO格式）
- `endDate`: 结束日期（ISO格式）
- `status`: 按状态筛选，可选值为 `success`, `error`
- `sort`: 排序字段，默认为 `timestamp`
- `order`: 排序方向，可选值为 `desc`（默认）或 `asc`

**响应格式：**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "log-id-1",
        "timestamp": "2023-01-01T12:34:56.789Z",
        "ip": "192.168.1.1",
        "method": "POST",
        "path": "/api/data-service/query",
        "status": 200,
        "responseTime": 120,
        "user": "user@example.com",
        "apiKey": "key-id-1",
        "requestData": {
          "params": {
            "username": "searchuser"
          }
        },
        "responseSize": 2450
      },
      // ...更多日志
    ],
    "total": 156,
    "page": 1,
    "pageSize": 20,
    "totalPages": 8
  }
}
```

## 七、错误码说明

| 错误码 | 错误类型         | 说明                           |
|-------|----------------|--------------------------------|
| 400   | BAD_REQUEST    | 请求参数错误或格式不正确           |
| 401   | UNAUTHORIZED   | 未认证或认证失败                  |
| 403   | FORBIDDEN      | 权限不足，禁止访问                |
| 404   | NOT_FOUND      | 资源不存在                       |
| 409   | CONFLICT       | 资源冲突                         |
| 429   | TOO_MANY_REQUESTS | 请求频率超限                   |
| 500   | INTERNAL_ERROR | 服务器内部错误                    |
| 503   | SERVICE_UNAVAILABLE | 服务不可用                   |

## 八、配置字段说明

### 集成配置字段

#### 参数配置

```typescript
interface ParamConfig {
  name: string;         // 参数名称，必须是有效的标识符
  label: string;        // 参数显示标签
  type: string;         // 参数类型：string, number, boolean, date, select
  required: boolean;    // 是否必填
  defaultValue?: any;   // 默认值
  placeholder?: string; // 占位符文本
  description?: string; // 参数描述
  options?: Array<{     // 选项列表（用于select类型）
    label: string;      // 选项标签
    value: any;         // 选项值
  }>;
  min?: number;         // 最小值（用于number类型）
  max?: number;         // 最大值（用于number类型）
  regex?: string;       // 验证正则表达式（用于string类型）
  format?: string;      // 日期格式（用于date类型）
}
```

#### 表格配置

```typescript
interface TableConfig {
  columns: Array<{
    key: string;        // 列唯一标识
    dataIndex: string;  // 数据字段名
    title: string;      // 列标题
    width?: number;     // 列宽度
    fixed?: 'left' | 'right'; // 固定列
    align?: 'left' | 'center' | 'right'; // 对齐方式
    sortable?: boolean; // 是否可排序
    formatter?: string; // 格式化函数
  }>;
  rowKey: string;       // 行唯一标识字段
  pagination: boolean;  // 是否启用分页
  defaultPageSize?: number; // 默认每页记录数
  defaultSorting?: Array<{
    field: string;      // 排序字段
    order: 'asc' | 'desc'; // 排序方向
  }>;
}
```

#### 图表配置

```typescript
interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'scatter'; // 图表类型
  xField: string;       // X轴字段
  yField: string;       // Y轴字段
  seriesField?: string; // 系列字段
  title?: string;       // 图表标题
  subtitle?: string;    // 图表子标题
  legend?: boolean;     // 是否显示图例
  tooltip?: boolean;    // 是否显示提示
  colors?: string[];    // 自定义颜色
  // ... 其他图表特定配置
}
```